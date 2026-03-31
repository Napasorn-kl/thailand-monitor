import { useState, useEffect, useCallback } from 'react';

const RSS_SOURCES = [
  { name: 'มติชน',               url: 'https://www.matichon.co.th/feed',                              color: '#0891b2',  dot: '#22d3ee' },
  { name: 'ประชาชาติธุรกิจ',     url: 'https://www.prachachat.net/feed',                              color: '#059669',  dot: '#22c55e' },
  { name: 'Bangkok Post',        url: 'https://www.bangkokpost.com/rss/data/business.xml',            color: '#d97706',  dot: '#f59e0b' },
  { name: 'BBC ไทย',             url: 'https://feeds.bbci.co.uk/thai/rss.xml',                       color: '#7c3aed',  dot: '#a78bfa' },
];

const IS_LOCAL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const CORS_PROXY = IS_LOCAL ? 'https://corsproxy.io/?' : '/api/rss?url=';
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

// 4 categories only — maps 1:1 to the 4 visible tabs (food, trade, energy, macro)
// Priority order when scoring: energy > food > trade > macro
// Articles with no keyword match default to macro (catch-all)
const NEWS_CATEGORY_KEYWORDS = {
  energy: ['น้ำมัน','energy','oil','brent','crude','petroleum','ปิโตรเลียม','พลังงาน','ptt','fuel','ราคาน้ำมัน','opec','ก๊าซ','lpg','lng','solar','renewable','พลังงานหมุนเวียน','โซลาร์','egat','การไฟฟ้า','ngv','ค่าไฟ','ไฟฟ้า','กฟผ','กฟน','กฟภ','ปตท','โรงไฟฟ้า','coal','ถ่านหิน','ไฮโดรเจน'],
  food:   ['อาหาร','food','beverage','เครื่องดื่ม','restaurant','cpf','อุตสาหกรรมอาหาร','ข้าวสาร','น้ำตาลทราย','เนื้อสัตว์','dairy','snack','fnb','f&b','ประมง','seafood','กุ้ง','ทูน่า','tuna','thai union','betagro','oishi','singha','chang','เบียร์','นม','สุรา','เกษตร','ข้าว','ยางพารา','มันสำปะหลัง','อ้อย','ปาล์ม','ไก่','สุกร','ปศุสัตว์','ผักผลไม้','ราคาพืช','เกษตรกร'],
  trade:  ['ส่งออก','export','import','นำเข้า','trade','customs','ศุลกากร','fta','wto','tariff','ภาษีนำเข้า','trade war','rcep','ท่าเรือ','logistics','supply chain','พาณิชย์','กระทรวงพาณิชย์','ดุลการค้า','ตลาดต่างประเทศ','ตลาดส่งออก'],
  macro:  ['gdp','เศรษฐกิจ','economy','inflation','เงินเฟ้อ','ธนาคารแห่งประเทศไทย','fed','interest rate','ดอกเบี้ย','เศรษฐกิจไทย','thb','ค่าเงินบาท','อัตราแลกเปลี่ยน','imf','world bank','ธปท','mpc','cpi','pmi','นโยบายการเงิน','กระตุ้นเศรษฐกิจ','งบประมาณ','กระทรวงการคลัง','การคลัง','สภาพัฒน์','ธุรกิจ','บริษัท','กำไร','ขาดทุน','รายได้','ภาษี','ค่าแรง','แรงงาน','ว่างงาน','อุตสาหกรรม','หอการค้า','สภาอุตสาหกรรม','ลงทุน','หุ้น','ตลาดหลักทรัพย์','set','กองทุน','bond','ธนาคาร','สินเชื่อ','หนี้','รัฐบาล','นโยบาย','เอกชน','ดัชนี','ผู้บริโภค','กำลังซื้อ','ราคาทอง','ทองคำ','gold','ตลาดทุน','ipo','dividend','ปันผล','fdi','นักลงทุน'],
};

let newsCache = null;
let newsCacheTime = 0;

async function fetchOneRSS(src) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  const fetchUrl = encodeURIComponent(src.url);
  try {
    const r = await fetch(CORS_PROXY + fetchUrl, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!r.ok) return [];
    const xml = await r.text();
    if (!xml || xml.trim().startsWith('<!DOCTYPE html') || xml.trim().startsWith('<html')) return [];
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    const items = doc.querySelectorAll('item');
    const results = [];
    items.forEach((item, idx) => {
      if (idx >= 15) return;
      const title = item.querySelector('title')?.textContent?.replace(/<!\[CDATA\[|\]\]>/g,'').trim() || '';
      const link  = item.querySelector('link')?.textContent?.trim() || item.querySelector('guid')?.textContent?.trim() || '';
      const desc  = (item.querySelector('description')?.textContent || '').replace(/<[^>]+>/g,'').replace(/<!\[CDATA\[|\]\]>/g,'').trim().slice(0,200);
      const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';
      if (!title) return;

      // extract image: media:thumbnail > media:content > enclosure
      const image =
        item.querySelector('thumbnail')?.getAttribute('url') ||
        item.querySelector('content')?.getAttribute('url') ||
        item.querySelector('enclosure[type^="image"]')?.getAttribute('url') ||
        null;

      // detect category: score-based, title match = 3pts, desc match = 1pt
      const titleLow = title.toLowerCase();
      const descLow  = desc.toLowerCase();
      let bestCat = 'macro'; // default: ข่าวที่ไม่ตรง category ใดเลยให้ไปอยู่เศรษฐกิจ
      let bestScore = 0;
      for (const [cat, kws] of Object.entries(NEWS_CATEGORY_KEYWORDS)) {
        let score = 0;
        for (const k of kws) {
          if (titleLow.includes(k)) score += 3;
          else if (descLow.includes(k)) score += 1;
        }
        if (score > bestScore) { bestScore = score; bestCat = cat; }
      }
      const category = bestCat;

      results.push({
        id: src.name + '_' + idx,
        title,
        link,
        desc,
        pubDate,
        image,
        source: src.name,
        sourceColor: src.color,
        sourceDot: src.dot,
        category,
        ago: relativeTime(pubDate),
      });
    });
    return results;
  } catch (e) {
    clearTimeout(timer);
    return [];
  }
}

function relativeTime(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const diff = Math.floor((Date.now() - d.getTime()) / 60000);
    if (diff < 1) return 'เมื่อกี้';
    if (diff < 60) return diff + ' นาทีที่แล้ว';
    const hrs = Math.floor(diff / 60);
    if (hrs < 24) return hrs + ' ชั่วโมงที่แล้ว';
    return Math.floor(hrs / 24) + ' วันที่แล้ว';
  } catch { return ''; }
}

export function useNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('all');

  const fetchAll = useCallback(async (force = false) => {
    if (!force && newsCache && Date.now() - newsCacheTime < CACHE_DURATION_MS) {
      setArticles(newsCache);
      return;
    }
    setLoading(true);
    try {
      const results = await Promise.allSettled(RSS_SOURCES.map(fetchOneRSS));
      const all = results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value)
        .sort((a, b) => {
          const da = new Date(a.pubDate), db = new Date(b.pubDate);
          return db - da;
        });
      newsCache = all;
      newsCacheTime = Date.now();
      setArticles(all);
    } catch (e) {
      console.warn('[News]', e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll(true); // always force-fetch on mount to skip stale cache
    const interval = setInterval(() => fetchAll(false), 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // category ตรงกับ tab 1:1 (food, trade, energy, macro) ไม่มี group ซับซ้อน
  const filtered = category === 'all'
    ? articles
    : articles.filter(a => a.category === category);

  return { articles: filtered, allArticles: articles, loading, category, setCategory, refresh: () => fetchAll(true) };
}
