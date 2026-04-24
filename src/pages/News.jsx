import React, { useState } from 'react';
import {
  RefreshCw, ExternalLink, Loader,
  Fuel, BarChart2, Ship, UtensilsCrossed, List, Car,
} from 'lucide-react';

const CATS = [
  { id: 'all',    label: 'ทั้งหมด',              Icon: List,            group: 'rss'   },
  { id: 'food',   label: 'อาหาร & เครื่องดื่ม',  Icon: UtensilsCrossed, group: 'rss'   },
  { id: 'trade',  label: 'การค้า',               Icon: Ship,            group: 'rss'   },
  { id: 'macro',  label: 'เศรษฐกิจ',             Icon: BarChart2,       group: 'rss'   },
  { id: 'energy', label: 'น้ำมัน',               Icon: Fuel,            group: 'rss'   },
  { id: 'js100',  label: 'สภาพจราจร',             Icon: Car,             group: 'js100' },
];


function ArticleCard({ a }) {
  return (
    <a
      href={a.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
      onClick={e => { if (!a.link) e.preventDefault(); }}
    >
      <div className="cc" style={{ padding: 0, cursor: 'pointer', overflow: 'hidden', height: '100%' }}>
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
            {a.js100Cat && (
              <span style={{
                fontSize: 10, borderRadius: 4, padding: '2px 6px', fontWeight: 600,
                ...(a.js100Cat === 'อุบัติเหตุ'
                  ? { color: '#c53030', background: 'rgba(229,62,62,.12)' }
                  : a.js100Cat === 'ติดขัดสะสม'
                  ? { color: '#c05621', background: 'rgba(237,137,54,.12)' }
                  : a.js100Cat === 'ติดขัด'
                  ? { color: '#b7791f', background: 'rgba(246,173,85,.15)' }
                  : a.js100Cat === 'ปกติ'
                  ? { color: '#276749', background: 'rgba(72,187,120,.12)' }
                  : { color: 'var(--t3)', background: 'rgba(0,0,0,.06)' }),
              }}>
                {a.js100Cat}
              </span>
            )}
            {!a.js100Cat && a.category !== 'other' && (
              <span style={{ fontSize: 10, color: 'var(--t3)', background: 'rgba(0,0,0,.05)', borderRadius: 4, padding: '2px 6px' }}>
                {CATS.find(c => c.id === a.category)?.label?.replace(/^[^ ]+ /, '') || a.category}
              </span>
            )}
            <ExternalLink size={10} style={{ color: 'var(--t3)', marginLeft: 'auto' }} />
          </div>
        </div>
      </div>
    </a>
  );
}

export default function News({ newsHook }) {
  const { articles, allArticles, loading, category, setCategory, refresh } = newsHook;

  const rssArticles  = allArticles.filter(a => a.category !== 'js100');
  const js100Articles = allArticles.filter(a => a.category === 'js100');
  const isJS100 = category === 'js100';

  const counts = {};
  CATS.forEach(c => {
    if (c.id === 'all')       counts[c.id] = rssArticles.length;
    else if (c.id === 'js100') counts[c.id] = js100Articles.length;
    else counts[c.id] = rssArticles.filter(a => a.category === c.id).length;
  });

  // Enrich js100 articles with js100Cat field for display
  const displayArticles = isJS100
    ? js100Articles.map(a => ({ ...a, js100Cat: a.js100Cat || undefined }))
    : articles.filter(a => a.category !== 'js100');

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>
            {isJS100 ? 'สถานการณ์จราจร จส.100' : 'ข่าวสารเศรษฐกิจไทย'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
            {isJS100
              ? `${js100Articles.length} รายการ · จส.100 FM · รายงานสดสถานการณ์จราจร`
              : `${rssArticles.length} ข่าว · มติชน · ประชาชาติ · Bangkok Post · BBC ไทย`
            }
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

      {/* Category tabs — RSS group left, JS100 tab separated by divider */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        {CATS.map((c, i) => {
          const isJS100Tab = c.id === 'js100';
          const active = category === c.id;
          const color = isJS100Tab ? '#e53e3e' : 'var(--cyan)';
          const activeBg = isJS100Tab ? 'rgba(229,62,62,.08)' : 'rgba(8,145,178,.08)';
          const activeBorder = isJS100Tab ? 'rgba(229,62,62,.5)' : 'var(--cyan)';
          return (
            <React.Fragment key={c.id}>
              {/* Divider before JS100 tab */}
              {isJS100Tab && (
                <div style={{ width: 1, height: 22, background: 'rgba(0,0,0,.1)', margin: '0 2px' }} />
              )}
              <button onClick={() => setCategory(c.id)} style={{
                padding: '5px 12px', borderRadius: 20, border: '1px solid',
                borderColor: active ? activeBorder : 'rgba(0,0,0,.1)',
                background: active ? activeBg : '#fff',
                color: active ? color : isJS100Tab ? '#e53e3e' : 'var(--t3)',
                fontSize: 11.5, fontWeight: active ? 700 : 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <c.Icon size={12} style={{ flexShrink: 0 }} />
                {c.label}
                <span style={{
                  background: active ? color : 'rgba(0,0,0,.08)',
                  color: active ? '#fff' : 'var(--t3)',
                  borderRadius: 10, padding: '0 5px', fontSize: 9.5, fontWeight: 700,
                }}>
                  {counts[c.id]}
                </span>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Article grid */}
      {loading && displayArticles.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 10, color: 'var(--t3)' }}>
          <Loader size={16} className="animate-spin-slow" />
          <span style={{ fontSize: 13 }}>กำลังโหลดข่าว...</span>
        </div>
      ) : displayArticles.length === 0 ? (
        <div className="no-data-state">
          <div style={{ fontSize: 13, color: 'var(--t3)' }}>ไม่มีข่าวในหมวดนี้</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 12 }}>
          {displayArticles.map(a => <ArticleCard key={a.id} a={a} />)}
        </div>
      )}
    </div>
  );
}
