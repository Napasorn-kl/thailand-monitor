import React, { useState } from 'react';
import { SECTORS, GOLD_EXPOSURE } from '../data/staticData';

const OIL_BADGE = {
  H:   { label: 'น้ำมัน: สูง',     bg: 'rgba(239,68,68,.1)',   color: '#ef4444', icon: '🔴' },
  M:   { label: 'น้ำมัน: ปานกลาง', bg: 'rgba(245,158,11,.1)',  color: '#f59e0b', icon: '🟡' },
  L:   { label: 'น้ำมัน: ต่ำ',     bg: 'rgba(148,163,184,.1)', color: '#94a3b8', icon: '⚪' },
  '+': { label: 'น้ำมัน: บวก',     bg: 'rgba(5,150,105,.1)',   color: '#059669', icon: '🟢' },
};

const SECTOR_ICONS = {
  Tourism: '✈️', Retail: '🛒', Hospitality: '🏨', Wholesale: '📦',
  Construction: '🏗️', Manufacturing: '🏭', 'Real Estate': '🏢',
  'Other Services': '🔧', Healthcare: '🏥', Agriculture: '🌾',
  Finance: '💰', Transport: '🚚', Technology: '💻', Education: '📚',
  Energy: '⚡', Media: '📺',
};

const maxReg = Math.max(...SECTORS.map(s => s.reg));

function SectorCard({ s, selected, onSelect }) {
  const ob  = OIL_BADGE[s.oilSens] || OIL_BADGE.L;
  const pct = (s.reg / maxReg * 100).toFixed(0);
  const isUp = s.growth >= 0;
  const ge  = GOLD_EXPOSURE[s.name];

  return (
    <div
      onClick={() => onSelect(selected ? null : s.name)}
      style={{
        background: '#fff',
        border: `1px solid ${selected ? s.col + '60' : 'rgba(0,0,0,0.07)'}`,
        borderRadius: 14,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all .15s',
        boxShadow: selected ? `0 0 0 2px ${s.col}30, 0 4px 16px rgba(0,0,0,.08)` : '0 1px 3px rgba(0,0,0,.05)',
      }}>

      {/* Colored top bar */}
      <div style={{ height: 4, background: s.col }} />

      <div style={{ padding: '13px 15px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>{SECTOR_ICONS[s.name] || '📊'}</span>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--t1)', lineHeight: 1.2 }}>{s.nameTH}</div>
              <div style={{ fontSize: 10, color: 'var(--t3)' }}>{s.name}</div>
            </div>
          </div>
          {/* Growth badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            background: isUp ? 'rgba(22,163,74,.1)' : 'rgba(220,38,38,.1)',
            color: isUp ? '#16a34a' : '#dc2626',
            borderRadius: 8, padding: '3px 8px', fontSize: 12, fontWeight: 800,
          }}>
            {isUp ? '↑' : '↓'} {isUp ? '+' : ''}{s.growth}%
          </div>
        </div>

        {/* Registrations bar */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: 'var(--t3)' }}>บริษัทจดทะเบียน</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t1)' }}>{s.reg.toLocaleString()}</span>
          </div>
          <div style={{ background: 'rgba(148,163,184,0.15)', borderRadius: 4, height: 5 }}>
            <div style={{ width: pct + '%', height: '100%', background: s.col, borderRadius: 4 }} />
          </div>
        </div>

        {/* Metrics row */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.03)', borderRadius: 8, padding: '6px 9px' }}>
            <div style={{ fontSize: 9.5, color: 'var(--t3)', marginBottom: 2 }}>ทุนจดทะเบียน</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#d97706' }}>฿{s.cap}B</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.03)', borderRadius: 8, padding: '6px 9px' }}>
            <div style={{ fontSize: 9.5, color: 'var(--t3)', marginBottom: 2 }}>สัดส่วน</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2)' }}>{s.share}%</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.03)', borderRadius: 8, padding: '6px 9px' }}>
            <div style={{ fontSize: 9.5, color: 'var(--t3)', marginBottom: 2 }}>ทุนเฉลี่ย</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2)' }}>฿{s.avg}M</div>
          </div>
        </div>

        {/* Oil badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6,
            background: ob.bg, color: ob.color,
          }}>
            {ob.icon} {ob.label}
          </span>
          {ge && (
            <span style={{ fontSize: 10, color: '#b7791f', fontWeight: 600, marginLeft: 'auto' }}>
              🥇 Gold {ge.score}/100
            </span>
          )}
        </div>

        {/* Expanded detail */}
        {selected && ge && (
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 4 }}>Gold Exposure</div>
            <div style={{ background: 'rgba(0,0,0,0.04)', borderRadius: 8, height: 6, marginBottom: 4 }}>
              <div style={{ width: ge.score + '%', height: '100%', background: '#d97706', borderRadius: 8 }} />
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--t3)' }}>{ge.note}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Sectors({ data }) {
  const [selected, setSelected] = useState(null);
  const [sortBy,   setSortBy]   = useState('reg');
  const { brent, goldBar } = data;

  const sorted = [...SECTORS].sort((a, b) => {
    if (sortBy === 'reg')    return b.reg    - a.reg;
    if (sortBy === 'cap')    return b.cap    - a.cap;
    if (sortBy === 'growth') return b.growth - a.growth;
    return 0;
  });

  const totalReg = SECTORS.reduce((s, x) => s + x.reg, 0);
  const avgGrowth = (SECTORS.reduce((s, x) => s + x.growth, 0) / SECTORS.length).toFixed(1);
  const topSector = [...SECTORS].sort((a, b) => b.growth - a.growth)[0];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>ภาคธุรกิจไทย</div>
        <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
          {SECTORS.length} ภาคธุรกิจ · ข้อมูล DBD 2024
        </div>
      </div>

      {/* KPI Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
        {[
          { label: 'นิติบุคคลทั้งหมด',  val: totalReg.toLocaleString() + ' บริษัท', color: '#0891b2' },
          { label: 'การเติบโตเฉลี่ย',    val: (parseFloat(avgGrowth) >= 0 ? '+' : '') + avgGrowth + '%', color: parseFloat(avgGrowth) >= 0 ? '#16a34a' : '#dc2626' },
          { label: 'ภาคเติบโตสูงสุด',   val: topSector.nameTH, color: topSector.col },
        ].map(k => (
          <div key={k.label} style={{ background: '#fff', borderRadius: 10, padding: '10px 13px', border: '1px solid rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: k.color }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* Sort tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {[
          { id: 'reg',    label: 'เรียงตามบริษัท' },
          { id: 'cap',    label: 'เรียงตามทุน'    },
          { id: 'growth', label: 'เรียงตามการเติบโต' },
        ].map(t => (
          <button key={t.id} onClick={() => setSortBy(t.id)} style={{
            padding: '5px 12px', borderRadius: 20, fontSize: 11.5, cursor: 'pointer',
            border:     sortBy === t.id ? '1px solid var(--cyan)' : '1px solid rgba(0,0,0,0.1)',
            background: sortBy === t.id ? 'rgba(8,145,178,0.08)' : '#fff',
            color:      sortBy === t.id ? 'var(--cyan)' : 'var(--t3)',
            fontWeight: sortBy === t.id ? 700 : 500,
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Card grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
        {sorted.map(s => (
          <SectorCard
            key={s.name}
            s={s}
            selected={selected === s.name}
            onSelect={setSelected}
          />
        ))}
      </div>

      {/* Oil & Gold Summary */}
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', marginBottom: 12 }}>⛽ ผลกระทบจากน้ำมัน & ทองคำ</div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', background: 'linear-gradient(135deg,rgba(217,119,6,.06),rgba(183,121,31,.03))', border: '1px solid rgba(217,119,6,.18)', borderRadius: 10, padding: '12px 16px', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 9.5, color: 'var(--t3)', marginBottom: 2 }}>Brent Crude</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#d97706' }}>
              ${parseFloat(brent) || 74.2}<span style={{ fontSize: 11, color: 'var(--t3)' }}>/bbl</span>
            </div>
          </div>
          <div style={{ width: 1, background: 'rgba(0,0,0,0.08)' }} />
          <div>
            <div style={{ fontSize: 9.5, color: 'var(--t3)', marginBottom: 2 }}>ทองแท่ง (ขายออก)</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#b7791f' }}>
              {goldBar?.sell ? goldBar.sell.toLocaleString('th-TH') : '—'}
              <span style={{ fontSize: 11, color: 'var(--t3)' }}>฿</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {/* Oil sensitivity */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t2)', marginBottom: 8 }}>ภาคที่ได้รับผลกระทบจากน้ำมันสูง</div>
            {SECTORS.filter(s => s.oilSens === 'H').map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: 14 }}>{SECTOR_ICONS[s.name]}</span>
                <span style={{ fontSize: 11.5, color: 'var(--t2)', flex: 1 }}>{s.nameTH}</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#ef4444' }}>ความเสี่ยงสูง</span>
              </div>
            ))}
          </div>
          {/* Gold exposure */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#b7791f', marginBottom: 8 }}>ภาคที่เกี่ยวข้องกับทองคำ</div>
            {Object.entries(GOLD_EXPOSURE).sort((a, b) => b[1].score - a[1].score).slice(0, 5).map(([name, ge]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: 11.5, color: 'var(--t2)', flex: 1 }}>{name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 44, background: 'rgba(0,0,0,0.07)', borderRadius: 3, height: 4 }}>
                    <div style={{ width: ge.score + '%', height: '100%', background: '#d97706', borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: '#b7791f' }}>{ge.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
