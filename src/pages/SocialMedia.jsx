import React, { useState } from 'react';
import {
  Share2, Globe, ExternalLink, AlertTriangle, Cloud, Zap,
  TrendingUp, RefreshCw, Loader, List, Rss, AlertCircle,
} from 'lucide-react';
import { useSocialFeed, SOCIAL_RSS_SOURCES } from '../hooks/useSocialFeed';

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 12 }}>
          {filtered.map(a => (
            <a key={a.id} href={a.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div className="cc" style={{ padding: 0, cursor: 'pointer', overflow: 'hidden', height: '100%' }}>
                {/* Thumbnail */}
                {a.image ? (
                  <img src={a.image} alt="" style={{ width: '100%', height: 150, objectFit: 'cover', display: 'block' }}
                    onError={e => { e.target.style.display = 'none'; }} />
                ) : (
                  <div style={{
                    width: '100%', height: 60,
                    background: `linear-gradient(135deg,${a.sourceColor}22,${a.sourceColor}08)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.sourceColor }} />
                  </div>
                )}
                {/* Content */}
                <div style={{ padding: '12px 14px 14px' }}>
                  <div style={{
                    fontSize: 13, fontWeight: 600, color: 'var(--t1)', lineHeight: 1.45, marginBottom: 6,
                    overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                  }}>{a.title}</div>
                  {a.desc && (
                    <div style={{
                      fontSize: 11.5, color: 'var(--t3)', lineHeight: 1.5, marginBottom: 8,
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>{a.desc}</div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: a.sourceColor, background: a.sourceColor + '18', borderRadius: 4, padding: '2px 7px' }}>
                      {a.source}
                    </span>
                    {a.ago && <span style={{ fontSize: 10, color: 'var(--t3)' }}>{a.ago}</span>}
                    <ExternalLink size={10} style={{ color: 'var(--t3)', marginLeft: 'auto' }} />
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
  const [view, setView] = useState('feed');   // 'feed' | 'directory'
  const [category, setCategory] = useState('all');

  const dirCounts = {};
  CATS.forEach(c => {
    dirCounts[c.id] = c.id === 'all' ? DIR_DATA.length : DIR_DATA.filter(d => d.category === c.id).length;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <Share2 size={16} style={{ color: 'var(--cyan)', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Social Media & Feeds</div>
          <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
            {DIR_DATA.length} แหล่งข้อมูล · {SOCIAL_RSS_SOURCES.length} RSS feeds
          </div>
        </div>

        {/* View toggle */}
        <div style={{ marginLeft: 'auto', display: 'flex', borderRadius: 8, border: '1px solid rgba(0,0,0,.1)', overflow: 'hidden' }}>
          {[
            { id: 'feed',      label: 'ฟีดข่าว',    Icon: Rss  },
            { id: 'directory', label: 'ไดเรกทอรี', Icon: List },
          ].map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 13px', border: 'none', cursor: 'pointer',
              background: view === v.id ? 'var(--cyan)' : '#fff',
              color: view === v.id ? '#fff' : 'var(--t2)',
              fontSize: 11.5, fontWeight: 600, transition: 'background .15s',
            }}>
              <v.Icon size={12} /> {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <CatTabs
        cats={CATS}
        active={category}
        onSelect={setCategory}
        counts={view === 'directory' ? dirCounts : null}
      />

      {/* View content */}
      {view === 'feed'
        ? <FeedView category={category} />
        : <DirectoryView category={category} />
      }
    </div>
  );
}
