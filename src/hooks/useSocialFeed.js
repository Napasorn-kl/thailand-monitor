import { useState, useEffect, useCallback } from 'react';

const IS_LOCAL = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const CORS_PROXY = IS_LOCAL ? 'https://corsproxy.io/?' : '/api/rss?url=';

function buildFetchUrl(rssUrl) {
  if (IS_LOCAL) return CORS_PROXY + encodeURIComponent(rssUrl);
  if (rssUrl.includes('rsshub.app')) {
    const path = rssUrl.replace('https://rsshub.app/', '');
    return '/api/rsshub?path=' + encodeURIComponent(path);
  }
  return CORS_PROXY + encodeURIComponent(rssUrl);
}

// Sources with known RSS feeds — deduplicated by logical source
export const SOCIAL_RSS_SOURCES = [
  // สื่อธุรกิจ-การลงทุน
  { name: 'กรุงเทพธุรกิจ',     rss: 'https://www.bangkokbiznews.com/rss/',             category: 'business', color: '#d97706' },
  { name: 'ฐานเศรษฐกิจ',       rss: 'https://www.thansettakij.com/feed/',              category: 'business', color: '#059669' },
  { name: 'ประชาชาติธุรกิจ',   rss: 'https://www.prachachat.net/feed',                 category: 'business', color: '#0891b2' },
  { name: 'ลงทุนแมน',          rss: 'https://longtunman.com/feed/',                    category: 'business', color: '#6366f1' },
  { name: 'Positioning',        rss: 'https://positioningmag.com/feed/',                category: 'business', color: '#7c3aed' },
  { name: 'Marketing Oops',     rss: 'https://www.marketingoops.com/feed/',             category: 'business', color: '#dc2626' },
  { name: 'Marketeer Online',   rss: 'https://www.marketeeronline.co/feed/',            category: 'business', color: '#ea580c' },
  { name: 'The Standard Wealth',rss: 'https://thestandard.co/feed/',                   category: 'business', color: '#1d4ed8' },
  { name: 'Thai PBS News',      rss: 'https://news.thaipbs.or.th/rss',                 category: 'business', color: '#0f766e' },
  { name: 'Bloomberg',          rss: 'https://feeds.bloomberg.com/markets/news.rss',   category: 'business', color: '#1d4ed8' },
  { name: 'Reuters',            rss: 'https://feeds.reuters.com/reuters/businessNews', category: 'business', color: '#c2410c' },
  { name: 'Brand Buffet',       rss: 'https://www.brandbuffet.in.th/feed/',            category: 'business', color: '#8b5cf6' },
  { name: 'Amarin News',        rss: 'https://www.amarin.tv/feed/',                    category: 'business', color: '#f59e0b' },
  { name: 'Forbes Thailand',    rss: 'https://forbesthailand.com/feed/',               category: 'business', color: '#ca8a04' },
  { name: 'คอหุ้น',            rss: 'https://www.kaohoon.com/feed/',                  category: 'business', color: '#16a34a' },
  // สาธารณภัย / สภาพอากาศ / อุบัติเหตุ — ผ่าน RSSHub (Facebook → RSS)
  { name: 'กรมป้องกันสาธารณภัย', rss: 'https://rsshub.app/facebook/page/DDPMNews',       category: 'disaster', color: '#dc2626' },
  { name: 'กรมอุตุนิยมวิทยา',    rss: 'https://rsshub.app/facebook/page/tmd.go.th',      category: 'weather',  color: '#0891b2' },
  { name: 'กรมควบคุมมลพิษ',      rss: 'https://rsshub.app/facebook/page/PCD.go.th',      category: 'weather',  color: '#65a30d' },
  { name: 'JS100Radio',           rss: 'https://rsshub.app/facebook/page/js100radio',     category: 'accident', color: '#d97706' },
  { name: 'FM91 Trafficpro',      rss: 'https://rsshub.app/facebook/page/fm91trafficpro', category: 'accident', color: '#7c3aed' },
];

let feedCache = null;
let feedCacheTime = 0;
const CACHE_MS = 10 * 60 * 1000;

function relativeTime(dateStr) {
  if (!dateStr) return '';
  try {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (diff < 1) return 'เมื่อกี้';
    if (diff < 60) return diff + ' นาทีที่แล้ว';
    const hrs = Math.floor(diff / 60);
    if (hrs < 24) return hrs + ' ชั่วโมงที่แล้ว';
    return Math.floor(hrs / 24) + ' วันที่แล้ว';
  } catch { return ''; }
}

async function fetchOneFeed(src) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  try {
    const r = await fetch(buildFetchUrl(src.rss), { signal: ctrl.signal });
    clearTimeout(timer);
    if (!r.ok) return [];
    const xml = await r.text();
    if (!xml || xml.trim().startsWith('<!DOCTYPE') || xml.trim().startsWith('<html')) return [];
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    const items = doc.querySelectorAll('item');
    const results = [];
    items.forEach((item, idx) => {
      if (idx >= 10) return;
      const title = item.querySelector('title')?.textContent?.replace(/<!\\[CDATA\\[|\\]\\]>/g, '').trim() || '';
      const link  = item.querySelector('link')?.textContent?.trim() || item.querySelector('guid')?.textContent?.trim() || '';
      const desc  = (item.querySelector('description')?.textContent || '').replace(/<[^>]+>/g, '').replace(/<!\\[CDATA\\[|\\]\\]>/g, '').trim().slice(0, 180);
      const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';
      if (!title) return;
      const image =
        item.querySelector('thumbnail')?.getAttribute('url') ||
        item.querySelector('content')?.getAttribute('url') ||
        item.querySelector('enclosure[type^="image"]')?.getAttribute('url') ||
        null;
      results.push({
        id: src.name + '_' + idx,
        title, link, desc, pubDate, image,
        source: src.name,
        sourceColor: src.color,
        category: src.category,
        ago: relativeTime(pubDate),
      });
    });
    return results;
  } catch {
    clearTimeout(timer);
    return [];
  }
}

export function useSocialFeed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [failedSources, setFailedSources] = useState([]);

  const fetchAll = useCallback(async (force = false) => {
    if (!force && feedCache && Date.now() - feedCacheTime < CACHE_MS) {
      setArticles(feedCache);
      return;
    }
    setLoading(true);
    const results = await Promise.allSettled(SOCIAL_RSS_SOURCES.map(fetchOneFeed));
    const failed = [];
    const all = results.flatMap((r, i) => {
      if (r.status === 'fulfilled' && r.value.length > 0) return r.value;
      if (r.status === 'fulfilled' && r.value.length === 0) failed.push(SOCIAL_RSS_SOURCES[i].name);
      return [];
    }).sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    feedCache = all;
    feedCacheTime = Date.now();
    setArticles(all);
    setFailedSources(failed);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(true); }, []); // eslint-disable-line

  return { articles, loading, failedSources, refresh: () => fetchAll(true) };
}
