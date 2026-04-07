import React, { useState, useEffect } from 'react';
import {
  Share2, Globe, ExternalLink, AlertTriangle, Cloud, Zap,
  TrendingUp, RefreshCw, Loader, List, Rss, AlertCircle,
} from 'lucide-react';
import { useSocialFeed, SOCIAL_RSS_SOURCES } from '../hooks/useSocialFeed';

/* ─── Facebook icon ─── */
const FBIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877f2">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const FB_CAT_COLOR = {
  'สาธารณภัย': '#ef4444', 'สภาพอากาศ': '#3b82f6', 'สิ่งแวดล้อม': '#22c55e',
  'การลงทุน': '#f59e0b', 'ธุรกิจ': '#8b5cf6', 'การตลาด': '#ec4899', 'ท่องเที่ยว': '#06b6d4',
};

/* ─── Facebook card with image ─── */
function FBCard({ item }) {
  const catColor = FB_CAT_COLOR[item.category] || '#6b7280';
  const ts = item.timestamp ? new Date(item.timestamp) : null;
  const timeStr = ts ? ts.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <a href={item.post_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div className="cc" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}>
        {/* Image */}
        {item.image_url ? (
          <img src={item.image_url} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block', flexShrink: 0 }}
            onError={e => { e.target.style.display = 'none'; }} />
        ) : (
          <div style={{ width: '100%', height: 60, background: 'linear-gradient(135deg,#1877f215,#1877f205)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FBIcon size={20} />
          </div>
        )}
        {/* Body */}
        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <FBIcon size={13} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t1)', flex: 1 }}>{item.source_name}</span>
            <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: catColor + '20', color: catColor, border: '1px solid ' + catColor + '40' }}>
              {item.category}
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--t1)', lineHeight: 1.55, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
            {item.post_text}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
            <span style={{ fontSize: 10, color: 'var(--t3)' }}>{timeStr}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#1877f2', fontWeight: 600 }}>
              ดูโพสต์ <ExternalLink size={10} />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

/* ─── Facebook posts section ─── */
function FacebookSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ทั้งหมด');

  const fetchPosts = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/data/fb_news.json?t=' + Date.now());
      if (!res.ok) throw new Error('ไม่พบข้อมูล');
      const data = await res.json();
      setPosts([...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, []);

  const categories = ['ทั้งหมด', ...new Set(posts.map(p => p.category))];
  const filtered = filter === 'ทั้งหมด' ? posts : posts.filter(p => p.category === filter);

  return (
    <div style={{ marginTop: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <FBIcon size={15} />
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', flex: 1 }}>โพสต์ Facebook ล่าสุด</div>
        <button onClick={fetchPosts} style={{
          display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--t3)',
          background: 'transparent', border: '1px solid rgba(0,0,0,.12)', borderRadius: 5,
          padding: '3px 8px', cursor: 'pointer',
        }}>
          <RefreshCw size={10} /> รีเฟรช
        </button>
      </div>

      {/* Category filter */}
      {!loading && posts.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, cursor: 'pointer',
              background: filter === c ? '#1877f2' : 'transparent',
              color: filter === c ? '#fff' : 'var(--t3)',
              border: '1px solid ' + (filter === c ? '#1877f2' : 'rgba(0,0,0,.12)'),
            }}>{c}</button>
          ))}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 30, color: 'var(--t3)' }}>
          <Loader size={14} className="animate-spin-slow" />
          <span style={{ fontSize: 12 }}>กำลังโหลด…</span>
        </div>
      )}
      {error && <div style={{ textAlign: 'center', padding: 16, fontSize: 12, color: 'var(--red)' }}>⚠️ {error}</div>}
      {!loading && !error && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {filtered.slice(0, 18).map((item, i) => <FBCard key={i} item={item} />)}
        </div>
      )}
    </div>
  );
}

/* ─── Date formatter ─── */
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const pad = v => String(v).padStart(2, '0');
    return `${pad(d.getDate())}-${pad(d.getMonth()+1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch { return ''; }
}

/* ─── Platform badges ─── */
const PlatformBadge = ({ platform }) => {
  if (platform === 'Facebook') return (
    <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 4, background: '#1877f220', color: '#1877f2', border: '1px solid #1877f230' }}>f</span>
  );
  if (platform === 'X') return (
    <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 4, background: 'rgba(0,0,0,.08)', color: '#000', border: '1px solid rgba(0,0,0,.12)' }}>𝕏</span>
  );
  return <Globe size={13} style={{ color: '#0891b2' }} />;
};

/* ─── Category config ─── */
const CATS = [
  { id: 'all',      label: 'ทั้งหมด',             Icon: List,          color: '#0891b2' },
  { id: 'disaster', label: 'สาธารณภัย',           Icon: AlertTriangle, color: '#dc2626' },
  { id: 'weather',  label: 'สภาพอากาศ',           Icon: Cloud,         color: '#0891b2' },
  { id: 'accident', label: 'อุบัติเหตุ',           Icon: Zap,           color: '#d97706' },
  { id: 'business', label: 'สื่อธุรกิจ-การลงทุน', Icon: TrendingUp,    color: '#059669' },
];

/* ─── Static directory data ─── */
const DIR_DATA = [
  { category: 'disaster', sub: 'น้ำท่วม',     name: 'กรมป้องกันและบรรเทาสาธารณภัย DDPM', platform: 'Facebook', url: 'https://www.facebook.com/DDPMNews' },
  { category: 'disaster', sub: 'น้ำท่วม',     name: 'กรมป้องกันและบรรเทาสาธารณภัย DDPM', platform: 'X',        url: 'https://x.com/DDPMNews' },
  { category: 'disaster', sub: 'น้ำท่วม',     name: 'กรมป้องกันและบรรเทาสาธารณภัย DDPM', platform: 'Website',  url: 'https://www.disaster.go.th/home' },
  { category: 'disaster', sub: 'น้ำท่วม',     name: 'THAI DISASTER ALERT (ปภ.)',          platform: 'Website',  url: 'https://tdaweb.disaster.go.th/tda/AlertHome' },
  { category: 'disaster', sub: 'น้ำท่วม',     name: 'มิตรเอิร์ธ - mitrearth',            platform: 'Facebook', url: 'https://www.facebook.com/mitrearth' },
  { category: 'disaster', sub: 'น้ำท่วม',     name: 'สถาบันสารสนเทศทรัพยากรน้ำ',         platform: 'Facebook', url: 'https://www.facebook.com/hii.mhesi' },
  { category: 'disaster', sub: 'น้ำท่วม',     name: 'คลังข้อมูลน้ำแห่งชาติ',             platform: 'Website',  url: 'https://www.thaiwater.net/report' },
  { category: 'disaster', sub: 'น้ำท่วม',     name: 'กรมชลประทาน',                       platform: 'X',        url: 'https://x.com/PR_RID' },
  { category: 'disaster', sub: 'น้ำท่วม',     name: 'สำนักงานทรัพยากรน้ำแห่งชาติ',      platform: 'Facebook', url: 'https://www.facebook.com/onwr.go.th' },
  { category: 'disaster', sub: 'แผ่นดินไหว', name: 'Earthquake TMD',                     platform: 'Facebook', url: 'https://www.facebook.com/EarthquakeTMD' },
  { category: 'disaster', sub: 'แผ่นดินไหว', name: 'ศูนย์เตือนภัยพิบัติแห่งชาติ',        platform: 'Facebook', url: 'https://www.facebook.com/NationalDisasterWarningCenter/' },
  { category: 'weather',  sub: 'ฝุ่น',        name: 'กรมควบคุมมลพิษ',                    platform: 'Facebook', url: 'https://www.facebook.com/PCD.go.th' },
  { category: 'weather',  sub: 'ฝนตก',        name: 'กรมอุตุนิยมวิทยา',                  platform: 'Facebook', url: 'https://www.facebook.com/tmd.go.th' },
  { category: 'accident', sub: 'ไฟไหม้',      name: 'ศูนย์วิทยุพระราม199',               platform: 'X',        url: 'https://x.com/praramcommand' },
  { category: 'accident', sub: 'การจราจร',    name: 'JS100Radio',                         platform: 'X',        url: 'https://x.com/js100radio' },
  { category: 'accident', sub: 'การจราจร',    name: 'JS100Radio',                         platform: 'Facebook', url: 'https://www.facebook.com/js100radio' },
  { category: 'accident', sub: 'การจราจร',    name: 'FM91 Trafficpro',                    platform: 'Facebook', url: 'https://www.facebook.com/fm91trafficpro' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'Brand Buffet',                       platform: 'Facebook', url: 'https://www.facebook.com/brandbuffet' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'Positioning',                        platform: 'Facebook', url: 'https://www.facebook.com/positioningmag' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'Amarin News',                        platform: 'Facebook', url: 'https://www.facebook.com/amarinnews' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'Infoquest',                          platform: 'Facebook', url: 'https://www.facebook.com/infoquest' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'THE STANDARD WEALTH',                platform: 'Facebook', url: 'https://www.facebook.com/thestandardwealth' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'SME Thailand Club',                  platform: 'Facebook', url: 'https://www.facebook.com/SMEThailandClub' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'การตลาดวันละตอน',                    platform: 'Facebook', url: 'https://www.facebook.com/EverydayMarketing.co' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'Ad Addict',                          platform: 'Facebook', url: 'https://www.facebook.com/theadaddict' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'Forbes Thailand',                    platform: 'Facebook', url: 'https://www.facebook.com/forbesthailand' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'ประชาชาติธุรกิจ',                    platform: 'Facebook', url: 'https://www.facebook.com/prachachat' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'ฐานเศรษฐกิจ',                        platform: 'Facebook', url: 'https://www.facebook.com/Thansettakij' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'The Leader Asia',                    platform: 'Facebook', url: 'https://www.facebook.com/theleaderasia' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'Bangkok Wealth & Biz',               platform: 'Facebook', url: 'https://www.facebook.com/bkkwealthandbiz' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'SME Startup',                        platform: 'Facebook', url: 'https://www.facebook.com/SMEStartupFreecopy' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'ลงทุนแมน',                           platform: 'Facebook', url: 'https://www.facebook.com/longtunman' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'คอหุ้น',                             platform: 'Facebook', url: 'https://www.facebook.com/korhoon' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'การเงินการธนาคาร',                   platform: 'Facebook', url: 'https://www.facebook.com/thanbank' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'สำนักข่าวรอยเตอร์',                  platform: 'Facebook', url: 'https://www.facebook.com/reuters' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'Bloomberg',                          platform: 'Facebook', url: 'https://www.facebook.com/bloombergnews' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'กรุงเทพธุรกิจ',                      platform: 'Facebook', url: 'https://www.facebook.com/bangkokbiznews' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'Marketeer Online',                   platform: 'Facebook', url: 'https://www.facebook.com/marketeeronline' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'Marketing Oops',                     platform: 'Facebook', url: 'https://www.facebook.com/marketingoops' },
  { category: 'business', sub: 'สื่อธุรกิจ',  name: 'Thai PBS News',                      platform: 'Facebook', url: 'https://www.facebook.com/ThaiPBSNews' },
];

/* ─── Tab bar ─── */
function CatTabs({ cats, active, onSelect, counts }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
      {cats.map(c => {
        const isActive = active === c.id;
        return (
          <button key={c.id} onClick={() => onSelect(c.id)} style={{
            padding: '5px 12px', borderRadius: 20, border: '1px solid',
            borderColor: isActive ? c.color : 'rgba(0,0,0,.1)',
            background: isActive ? c.color + '14' : '#fff',
            color: isActive ? c.color : 'var(--t3)',
            fontSize: 11.5, fontWeight: isActive ? 700 : 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <c.Icon size={12} style={{ flexShrink: 0 }} />
            {c.label}
            {counts && (
              <span style={{
                background: isActive ? c.color : 'rgba(0,0,0,.08)',
                color: isActive ? '#fff' : 'var(--t3)',
                borderRadius: 10, padding: '0 5px', fontSize: 9.5, fontWeight: 700,
              }}>{counts[c.id] ?? 0}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Directory view ─── */
function DirectoryView({ category }) {
  const filtered = category === 'all' ? DIR_DATA : DIR_DATA.filter(d => d.category === category);
  const subs = [...new Set(filtered.map(d => d.sub))];
  const catColor = CATS.find(c => c.id === category)?.color || 'var(--cyan)';

  return (
    <div>
      {subs.map(sub => (
        <div key={sub} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ width: 3, height: 16, borderRadius: 2, background: catColor, flexShrink: 0, display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>{sub}</span>
            <span style={{ fontSize: 10, color: 'var(--t3)', marginLeft: 2 }}>
              {filtered.filter(d => d.sub === sub).length} แหล่ง
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 8 }}>
            {filtered.filter(d => d.sub === sub).map((entry, i) => (
              <a key={i} href={entry.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 8,
                  background: '#f8fafc', border: '1px solid rgba(0,0,0,.07)',
                  cursor: 'pointer', transition: 'border-color .15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,.18)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,.07)'}
                >
                  <span style={{ flexShrink: 0, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PlatformBadge platform={entry.platform} />
                  </span>
                  <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.name}
                  </span>
                  <ExternalLink size={11} style={{ color: 'var(--t3)', flexShrink: 0 }} />
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Feed view ─── */
function FeedView({ category }) {
  const { articles, loading, failedSources, refresh } = useSocialFeed();

  const filtered = category === 'all' ? articles : articles.filter(a => a.category === category);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: 'var(--t3)' }}>
          {SOCIAL_RSS_SOURCES.filter(s => category === 'all' || s.category === category).length} แหล่ง RSS · {filtered.length} บทความ
        </span>
        <button onClick={refresh} disabled={loading} style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 11px', borderRadius: 8, border: '1px solid rgba(0,0,0,.1)',
          background: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: 11, fontWeight: 600, color: 'var(--t2)',
        }}>
          <RefreshCw size={11} className={loading ? 'animate-spin-slow' : ''} />
          รีเฟรช
        </button>
      </div>

      {/* failed sources warning */}
      {failedSources.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12,
          padding: '8px 12px', borderRadius: 8,
          background: 'rgba(220,38,38,.04)', border: '1px solid rgba(220,38,38,.12)',
          fontSize: 10.5, color: 'var(--t3)',
        }}>
          <AlertCircle size={13} style={{ color: '#dc2626', flexShrink: 0, marginTop: 1 }} />
          <span>โหลดไม่ได้: {failedSources.join(' · ')}</span>
        </div>
      )}

      {loading && filtered.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 10, color: 'var(--t3)' }}>
          <Loader size={16} className="animate-spin-slow" />
          <span style={{ fontSize: 13 }}>กำลังโหลดฟีด...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="no-data-state">
          <span style={{ fontSize: 13, color: 'var(--t3)' }}>ไม่มีบทความในหมวดนี้</span>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 12 }}>
          {filtered.map(a => (
            <a key={a.id} href={a.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#fff', borderRadius: 12,
                boxShadow: '0 2px 12px rgba(0,0,0,.08)',
                border: '1px solid rgba(0,0,0,.07)',
                overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%',
                cursor: 'pointer',
              }}>
                {/* Image */}
                {a.image ? (
                  <img src={a.image} alt="" style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block', flexShrink: 0 }}
                    onError={e => { e.target.style.display = 'none'; }} />
                ) : (
                  <div style={{ width: '100%', height: 80, background: `linear-gradient(135deg,${a.sourceColor}22,${a.sourceColor}08)`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: a.sourceColor }} />
                  </div>
                )}

                {/* Body */}
                <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {/* Post text */}
                  <div style={{
                    fontSize: 13.5, color: '#1a1a1a', lineHeight: 1.55, flex: 1,
                    overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical',
                  }}>
                    {a.title}{a.desc ? ' ' + a.desc : ''}
                  </div>

                  {/* Meta */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', gap: 8, fontSize: 11.5, color: '#888' }}>
                      <span style={{ fontWeight: 600, color: '#aaa', minWidth: 36 }}>แหล่ง</span>
                      <span style={{ fontWeight: 600, color: a.sourceColor }}>{a.source}</span>
                    </div>
                    {a.pubDate && (
                      <div style={{ display: 'flex', gap: 8, fontSize: 11.5, color: '#888' }}>
                        <span style={{ fontWeight: 600, color: '#aaa', minWidth: 36 }}>Time</span>
                        <span>{formatDate(a.pubDate)}</span>
                      </div>
                    )}
                  </div>

                  {/* View Original button */}
                  <div style={{
                    textAlign: 'center', paddingTop: 8,
                    borderTop: '1px solid rgba(0,0,0,.06)',
                    fontSize: 13, fontWeight: 600, color: '#0891b2',
                  }}>
                    View Original
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main page ─── */
export default function SocialMedia() {
  return (
    <div>
      <FacebookSection />
    </div>
  );
}
