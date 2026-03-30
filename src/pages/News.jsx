import React from 'react';
import { RefreshCw, ExternalLink, Loader } from 'lucide-react';

const CATS = [
  { id: 'all',    label: 'ทั้งหมด'    },
  { id: 'energy', label: '⛽ น้ำมัน'  },
  { id: 'gold',   label: '🪙 ทองคำ'   },
  { id: 'macro',  label: '📊 เศรษฐกิจ' },
  { id: 'trade',  label: '🚢 การค้า'  },
  { id: 'invest', label: '📈 ตลาดทุน' },
  { id: 'food',   label: '🍽️ อาหาร & เครื่องดื่ม' },
];

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
    </div>
  );
}
