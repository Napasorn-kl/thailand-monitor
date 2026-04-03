import React, { useState, useEffect } from 'react';
import {
  RefreshCw, ExternalLink, Loader,
  Fuel, BarChart2, Ship, UtensilsCrossed, List,
} from 'lucide-react';

const CATS = [
  { id: 'all',    label: 'ทั้งหมด',              Icon: List            },
  { id: 'food',   label: 'อาหาร & เครื่องดื่ม',  Icon: UtensilsCrossed },
  { id: 'trade',  label: 'การค้า',               Icon: Ship            },
  { id: 'macro',  label: 'เศรษฐกิจ',             Icon: BarChart2       },
  { id: 'energy', label: 'น้ำมัน',               Icon: Fuel            },
];

const CATEGORY_COLOR = {
  'สาธารณภัย': '#ef4444',
  'สภาพอากาศ': '#3b82f6',
  'สิ่งแวดล้อม': '#22c55e',
  'การลงทุน': '#f59e0b',
  'ธุรกิจ': '#8b5cf6',
  'การตลาด': '#ec4899',
};

const FBIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877f2">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

function FBCard({ item }) {
  const catColor = CATEGORY_COLOR[item.category] || '#6b7280';
  const ts = item.timestamp ? new Date(item.timestamp) : null;
  const timeStr = ts ? ts.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="cc" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <FBIcon size={13} />
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t1)', flex: 1 }}>{item.source_name}</span>
        <span style={{
          fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
          background: catColor + '20', color: catColor, border: '1px solid ' + catColor + '40',
        }}>{item.category}</span>
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--t2)', lineHeight: 1.55 }}>
        {item.post_text.length > 160 ? item.post_text.substring(0, 160) + '…' : item.post_text}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
        <span style={{ fontSize: 10, color: 'var(--t3)' }}>{timeStr}</span>
        <a href={item.post_url} target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#1877f2', fontWeight: 600, textDecoration: 'none' }}>
          ดูโพสต์ <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}

function FacebookSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ทั้งหมด');

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/data/fb_news.json?t=' + Date.now());
      if (!res.ok) throw new Error('ไม่พบข้อมูล');
      const data = await res.json();
      setPosts([...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const categories = ['ทั้งหมด', ...new Set(posts.map(p => p.category))];
  const filtered = filter === 'ทั้งหมด' ? posts : posts.filter(p => p.category === filter);

  return (
    <div style={{ marginTop: 24 }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <FBIcon size={14} />
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', flex: 1 }}>
          โพสต์ Facebook ล่าสุด
        </div>
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

      {/* Content */}
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 30, color: 'var(--t3)' }}>
          <Loader size={14} className="animate-spin-slow" />
          <span style={{ fontSize: 12 }}>กำลังโหลด…</span>
        </div>
      )}
      {error && (
        <div style={{ textAlign: 'center', padding: 16, fontSize: 12, color: 'var(--red)' }}>
          ⚠️ {error}
        </div>
      )}
      {!loading && !error && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
          {filtered.slice(0, 9).map((item, i) => <FBCard key={i} item={item} />)}
        </div>
      )}
    </div>
  );
}

export default function News({ newsHook }) {
  const { articles, allArticles, loading, category, setCategory, refresh } = newsHook;

  const counts = {};
  CATS.forEach(c => {
    counts[c.id] = c.id === 'all'
      ? allArticles.length
      : allArticles.filter(a => a.category === c.id).length;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>ข่าวสารเศรษฐกิจไทย</div>
          <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
            {allArticles.length} ข่าว · มติชน · ประชาชาติ · Bangkok Post · BBC ไทย
          </div>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,.1)',
            background: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 11, fontWeight: 600, color: 'var(--t2)',
          }}
        >
          <RefreshCw size={12} className={loading ? 'animate-spin-slow' : ''} />
          รีเฟรช
        </button>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {CATS.map(c => (
          <button key={c.id} onClick={() => setCategory(c.id)} style={{
            padding: '5px 12px', borderRadius: 20, border: '1px solid',
            borderColor: category === c.id ? 'var(--cyan)' : 'rgba(0,0,0,.1)',
            background: category === c.id ? 'rgba(8,145,178,.08)' : '#fff',
            color: category === c.id ? 'var(--cyan)' : 'var(--t3)',
            fontSize: 11.5, fontWeight: category === c.id ? 700 : 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <c.Icon size={12} style={{ flexShrink: 0 }} />
            {c.label}
            <span style={{
              background: category === c.id ? 'var(--cyan)' : 'rgba(0,0,0,.08)',
              color: category === c.id ? '#fff' : 'var(--t3)',
              borderRadius: 10, padding: '0 5px', fontSize: 9.5, fontWeight: 700,
            }}>
              {counts[c.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Article list */}
      {loading && articles.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 10, color: 'var(--t3)' }}>
          <Loader size={16} className="animate-spin-slow" />
          <span style={{ fontSize: 13 }}>กำลังโหลดข่าว...</span>
        </div>
      ) : articles.length === 0 ? (
        <div className="no-data-state">
          <div style={{ fontSize: 13, color: 'var(--t3)' }}>ไม่มีข่าวในหมวดนี้</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 12 }}>
          {articles.map(a => (
            <a
              key={a.id}
              href={a.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
              onClick={e => { if (!a.link) e.preventDefault(); }}
            >
              <div className="cc" style={{ padding: 0, cursor: 'pointer', overflow: 'hidden', height: '100%' }}>
                {/* Thumbnail */}
                {a.image ? (
                  <img
                    src={a.image}
                    alt=""
                    style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: 80,
                    background: `linear-gradient(135deg,${a.sourceColor}22,${a.sourceColor}08)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.sourceDot || a.sourceColor }} />
                  </div>
                )}
                {/* Content */}
                <div style={{ padding: '12px 14px 14px' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', lineHeight: 1.45, marginBottom: 6,
                    overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {a.title}
                  </div>
                  {a.desc && (
                    <div style={{ fontSize: 11.5, color: 'var(--t3)', lineHeight: 1.5, marginBottom: 8,
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {a.desc}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: a.sourceColor,
                      background: a.sourceColor + '15', borderRadius: 4, padding: '2px 7px' }}>
                      {a.source}
                    </span>
                    {a.ago && <span style={{ fontSize: 10, color: 'var(--t3)' }}>{a.ago}</span>}
                    {a.category !== 'other' && (
                      <span style={{ fontSize: 10, color: 'var(--t3)', background: 'rgba(0,0,0,.05)', borderRadius: 4, padding: '2px 6px' }}>
                        {CATS.find(c => c.id === a.category)?.label?.replace(/^[^ ]+ /, '') || a.category}
                      </span>
                    )}
                    <ExternalLink size={10} style={{ color: 'var(--t3)', marginLeft: 'auto' }} />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Facebook Posts Section */}
      <FacebookSection />
    </div>
  );
}
