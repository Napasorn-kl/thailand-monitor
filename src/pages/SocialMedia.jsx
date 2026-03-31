import React, { useState } from 'react';
import { Share2, Globe, ExternalLink, AlertTriangle, Cloud, Zap, TrendingUp } from 'lucide-react';

const PLATFORMS = {
  Facebook: {
    badge: (
      <span style={{
        fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 4,
        background: '#1877f220', color: '#1877f2', border: '1px solid #1877f230',
      }}>f</span>
    ),
  },
  X: {
    badge: (
      <span style={{
        fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 4,
        background: 'rgba(0,0,0,.08)', color: '#000', border: '1px solid rgba(0,0,0,.12)',
      }}>&#120143;</span>
    ),
  },
  Website: {
    badge: <Globe size={12} style={{ color: '#0891b2' }} />,
  },
};

const CATEGORIES = [
  {
    id: 'all',
    label: 'ทั้งหมด',
    icon: null,
  },
  {
    id: 'disaster',
    label: 'สาธารณภัย',
    icon: AlertTriangle,
    color: '#dc2626',
  },
  {
    id: 'weather',
    label: 'สภาพอากาศ',
    icon: Cloud,
    color: '#0891b2',
  },
  {
    id: 'accident',
    label: 'อุบัติเหตุ',
    icon: Zap,
    color: '#d97706',
  },
  {
    id: 'business',
    label: 'สื่อธุรกิจ-การลงทุน',
    icon: TrendingUp,
    color: '#059669',
  },
];

const DATA = [
  // สาธารณภัย / น้ำท่วม
  { category: 'disaster', sub: 'น้ำท่วม', name: 'กรมป้องกันและบรรเทาสาธารณภัย DDPM', platform: 'Facebook', url: 'https://www.facebook.com/DDPMNews' },
  { category: 'disaster', sub: 'น้ำท่วม', name: 'กรมป้องกันและบรรเทาสาธารณภัย DDPM', platform: 'X', url: 'https://x.com/DDPMNews' },
  { category: 'disaster', sub: 'น้ำท่วม', name: 'กรมป้องกันและบรรเทาสาธารณภัย DDPM', platform: 'Website', url: 'https://www.disaster.go.th/home' },
  { category: 'disaster', sub: 'น้ำท่วม', name: 'THAI DISASTER ALERT (ปภ.)', platform: 'Website', url: 'https://tdaweb.disaster.go.th/tda/AlertHome?fbclid=IwAR3mIchkTKVqdXTBxk_13nEWMQdpi3djgCHR2V-2DpgyAnl8zaPtLJt3sBU' },
  { category: 'disaster', sub: 'น้ำท่วม', name: 'มิตรเอิร์ธ - mitrearth', platform: 'Facebook', url: 'https://www.facebook.com/mitrearth' },
  { category: 'disaster', sub: 'น้ำท่วม', name: 'สถาบันสารสนเทศทรัพยากรน้ำ', platform: 'Facebook', url: 'https://www.facebook.com/hii.mhesi' },
  { category: 'disaster', sub: 'น้ำท่วม', name: 'คลังข้อมูลน้ำแห่งชาติ', platform: 'Website', url: 'https://www.thaiwater.net/report' },
  { category: 'disaster', sub: 'น้ำท่วม', name: 'กรมชลประทาน', platform: 'X', url: 'https://x.com/PR_RID' },
  { category: 'disaster', sub: 'น้ำท่วม', name: 'สำนักงานทรัพยากรน้ำแห่งชาติ', platform: 'Facebook', url: 'https://www.facebook.com/onwr.go.th' },

  // สาธารณภัย / แผ่นดินไหว
  { category: 'disaster', sub: 'แผ่นดินไหว', name: 'Earthquake TMD', platform: 'Facebook', url: 'https://www.facebook.com/EarthquakeTMD' },
  { category: 'disaster', sub: 'แผ่นดินไหว', name: 'ศูนย์เตือนภัยพิบัติแห่งชาติ', platform: 'Facebook', url: 'https://www.facebook.com/NationalDisasterWarningCenter/' },

  // สภาพอากาศ / ฝุ่น
  { category: 'weather', sub: 'ฝุ่น', name: 'กรมควบคุมมลพิษ', platform: 'Facebook', url: 'https://www.facebook.com/PCD.go.th' },

  // สภาพอากาศ / ฝนตก
  { category: 'weather', sub: 'ฝนตก', name: 'กรมอุตุนิยมวิทยา', platform: 'Facebook', url: 'https://www.facebook.com/tmd.go.th' },

  // อุบัติเหตุ / ไฟไหม้
  { category: 'accident', sub: 'ไฟไหม้', name: 'ศูนย์วิทยุพระราม199', platform: 'X', url: 'https://x.com/praramcommand' },

  // อุบัติเหตุ / การจราจร
  { category: 'accident', sub: 'การจราจร', name: 'JS100Radio', platform: 'X', url: 'https://x.com/js100radio' },
  { category: 'accident', sub: 'การจราจร', name: 'JS100Radio', platform: 'Facebook', url: 'https://www.facebook.com/js100radio' },
  { category: 'accident', sub: 'การจราจร', name: 'FM91 Trafficpro', platform: 'Facebook', url: 'https://www.facebook.com/fm91trafficpro' },

  // สื่อธุรกิจ-การลงทุน
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'Brand buffet', platform: 'Facebook', url: 'https://www.facebook.com/brandbuffet' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'Positioning', platform: 'Facebook', url: 'https://www.facebook.com/positioningmag' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'Amarin News', platform: 'Facebook', url: 'https://www.facebook.com/amarinnews' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'Infoquest', platform: 'Facebook', url: 'https://www.facebook.com/infoquest' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'THE STANDARD WEALTH', platform: 'Facebook', url: 'https://www.facebook.com/thestandardwealth' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'SME Thailand Club', platform: 'Facebook', url: 'https://www.facebook.com/SMEThailandClub' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'การตลาดวันละตอน', platform: 'Facebook', url: 'https://www.facebook.com/EverydayMarketing.co' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'Ad Addict', platform: 'Facebook', url: 'https://www.facebook.com/theadaddict' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'Forbes Thailand', platform: 'Facebook', url: 'https://www.facebook.com/forbesthailand' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'ประชาชาติธุรกิจ', platform: 'Facebook', url: 'https://www.facebook.com/prachachat' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'ฐานเศรษฐกิจ', platform: 'Facebook', url: 'https://www.facebook.com/Thansettakij' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'The Leader Asia', platform: 'Facebook', url: 'https://www.facebook.com/theleaderasia' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'Bangkok Wealth & Biz', platform: 'Facebook', url: 'https://www.facebook.com/bkkwealthandbiz' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'SME Startup', platform: 'Facebook', url: 'https://www.facebook.com/SMEStartupFreecopy' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'ลงทุนแมน', platform: 'Facebook', url: 'https://www.facebook.com/longtunman' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'คอหุ้น', platform: 'Facebook', url: 'https://www.facebook.com/korhoon' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'การเงินการธนาคาร', platform: 'Facebook', url: 'https://www.facebook.com/thanbank' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'สำนักข่าวรอยเตอร์', platform: 'Facebook', url: 'https://www.facebook.com/reuters' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'Bloomberg', platform: 'Facebook', url: 'https://www.facebook.com/bloombergnews' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'กรุงเทพธุรกิจ', platform: 'Facebook', url: 'https://www.facebook.com/bangkokbiznews' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'Marketeer Online', platform: 'Facebook', url: 'https://www.facebook.com/marketeeronline' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'Marketing Oops', platform: 'Facebook', url: 'https://www.facebook.com/marketingoops' },
  { category: 'business', sub: 'สื่อธุรกิจ-การลงทุน', name: 'Thai PBS News', platform: 'Facebook', url: 'https://www.facebook.com/ThaiPBSNews' },
];

function PlatformBadge({ platform }) {
  const def = PLATFORMS[platform];
  if (!def) return null;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {def.badge}
      {platform === 'Website' && (
        <span style={{ fontSize: 10, fontWeight: 600, color: '#0891b2' }}>Web</span>
      )}
    </span>
  );
}

function EntryCard({ entry }) {
  return (
    <a
      href={entry.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        borderRadius: 8,
        background: 'var(--bg2, #f8fafc)',
        border: '1px solid var(--border, rgba(0,0,0,0.07))',
        textDecoration: 'none',
        transition: 'box-shadow 0.15s, border-color 0.15s',
        cursor: 'pointer',
        minWidth: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.14)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.borderColor = 'var(--border, rgba(0,0,0,0.07))';
      }}
    >
      {/* Platform badge */}
      <span style={{ flexShrink: 0, minWidth: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PlatformBadge platform={entry.platform} />
      </span>

      {/* Name */}
      <span style={{
        flex: 1,
        fontSize: 12.5,
        fontWeight: 600,
        color: 'var(--t1)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {entry.name}
      </span>

      {/* Sub-category tag */}
      <span style={{
        flexShrink: 0,
        fontSize: 10,
        fontWeight: 600,
        padding: '2px 7px',
        borderRadius: 20,
        background: 'rgba(8,145,178,0.08)',
        color: 'var(--cyan, #0891b2)',
        border: '1px solid rgba(8,145,178,0.15)',
        whiteSpace: 'nowrap',
      }}>
        {entry.sub}
      </span>

      {/* External link icon */}
      <ExternalLink size={12} style={{ flexShrink: 0, color: 'var(--t3)', opacity: 0.5 }} />
    </a>
  );
}

function SubSection({ sub, entries, catColor }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
      }}>
        <span style={{
          display: 'inline-block',
          width: 3,
          height: 16,
          borderRadius: 2,
          background: catColor || 'var(--cyan, #0891b2)',
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '.4px',
          textTransform: 'uppercase',
          color: 'var(--t2)',
        }}>
          {sub}
        </span>
        <span style={{
          fontSize: 11,
          color: 'var(--t3)',
          fontWeight: 500,
          marginLeft: 2,
        }}>
          ({entries.length})
        </span>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 8,
      }}>
        {entries.map((entry, i) => (
          <EntryCard key={i} entry={entry} />
        ))}
      </div>
    </div>
  );
}

export default function SocialMedia() {
  const [activeTab, setActiveTab] = useState('all');

  const activeCat = CATEGORIES.find(c => c.id === activeTab);

  const filtered = activeTab === 'all' ? DATA : DATA.filter(e => e.category === activeTab);

  // Group by sub-category (preserving insertion order)
  const grouped = [];
  const seen = new Map();
  for (const entry of filtered) {
    const key = `${entry.category}::${entry.sub}`;
    if (!seen.has(key)) {
      seen.set(key, []);
      grouped.push({ key, category: entry.category, sub: entry.sub, entries: seen.get(key) });
    }
    seen.get(key).push(entry);
  }

  const getCatColor = (categoryId) => {
    const cat = CATEGORIES.find(c => c.id === categoryId);
    return cat?.color || 'var(--cyan, #0891b2)';
  };

  const totalCount = filtered.length;

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: 'linear-gradient(135deg, #0369a1, #0891b2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, boxShadow: '0 2px 8px rgba(8,145,178,0.3)',
        }}>
          <Share2 size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.3px' }}>
            Social Media Directory
          </div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>
            {totalCount} accounts across {grouped.length} topics
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="cc" style={{ marginBottom: 20, padding: '4px 6px' }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => {
            const isActive = activeTab === cat.id;
            const CatIcon = cat.icon;
            const count = cat.id === 'all' ? DATA.length : DATA.filter(e => e.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 8,
                  border: isActive
                    ? `1px solid ${cat.color || 'var(--cyan, #0891b2)'}40`
                    : '1px solid transparent',
                  background: isActive
                    ? `${cat.color || 'var(--cyan, #0891b2)'}12`
                    : 'transparent',
                  color: isActive
                    ? (cat.color || 'var(--cyan, #0891b2)')
                    : 'var(--t2)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {CatIcon && (
                  <CatIcon size={14} style={{ flexShrink: 0 }} />
                )}
                {cat.label}
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 10,
                  background: isActive
                    ? `${cat.color || 'var(--cyan, #0891b2)'}20`
                    : 'rgba(0,0,0,0.06)',
                  color: isActive
                    ? (cat.color || 'var(--cyan, #0891b2)')
                    : 'var(--t3)',
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="cc" style={{ padding: '20px 20px 8px' }}>
        {grouped.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--t3)', fontSize: 14 }}>
            No entries found.
          </div>
        ) : (
          grouped.map(({ key, category, sub, entries }) => (
            <SubSection
              key={key}
              sub={sub}
              entries={entries}
              catColor={getCatColor(category)}
            />
          ))
        )}
      </div>
    </div>
  );
}
