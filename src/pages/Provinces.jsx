import React, { useState } from 'react';
import { PROVINCES_DATA } from '../data/staticData';

const REGION_COLORS = {
  central:      '#0891b2',
  north:        '#22c55e',
  south:        '#f97316',
  east:         '#8b5cf6',
  'north-east': '#f59e0b',
};

const REGION_TH = {
  central:      'ภาคกลาง',
  north:        'ภาคเหนือ',
  south:        'ภาคใต้',
  east:         'ภาคตะวันออก',
  'north-east': 'ภาคอีสาน',
};

const METRICS = [
  { id: 'reg',  labelTH: 'บริษัทจดทะเบียน', labelEN: 'Registrations', unit: 'บริษัท', key: 'reg',  fmt: v => v.toLocaleString() },
  { id: 'cap',  labelTH: 'ทุนจดทะเบียน',    labelEN: 'Capital',       unit: '฿B',     key: 'cap',  fmt: v => '฿' + v + 'B'      },
  { id: 'dens', labelTH: 'ความหนาแน่น',     labelEN: 'Density',       unit: '/km²',   key: 'dens', fmt: v => v.toLocaleString() + '/km²' },
];

const REGIONS = ['all', 'central', 'north', 'south', 'east', 'north-east'];

export default function Provinces() {
  const [metric,   setMetric]   = useState('reg');
  const [region,   setRegion]   = useState('all');
  const [selected, setSelected] = useState('BKK');

  const mc = METRICS.find(m => m.id === metric);

  const filtered = region === 'all'
    ? PROVINCES_DATA
    : PROVINCES_DATA.filter(p => p.region === region);

  const sorted = [...filtered].sort((a, b) => b[mc.key] - a[mc.key]);
  const maxVal = sorted[0]?.[mc.key] || 1;
  const selProv = PROVINCES_DATA.find(p => p.id === selected);

  // Summary KPIs
  const totalReg = PROVINCES_DATA.reduce((s, p) => s + p.reg, 0);
  const totalCap = PROVINCES_DATA.reduce((s, p) => s + p.cap, 0);
  const topProv  = [...PROVINCES_DATA].sort((a, b) => b.reg - a.reg)[0];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>ข้อมูลธุรกิจจังหวัด</div>
        <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
          77 จังหวัด · ข้อมูลกรมพัฒนาธุรกิจการค้า (DBD) 2024
        </div>
      </div>

      {/* KPI Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
        {[
          { label: 'บริษัทจดทะเบียนทั้งหมด', val: totalReg.toLocaleString() + ' บริษัท', color: '#0891b2' },
          { label: 'ทุนจดทะเบียนรวม',         val: '฿' + totalCap.toLocaleString() + 'B',  color: '#059669' },
          { label: 'จังหวัดนำ',               val: topProv.th,                              color: '#7c3aed' },
        ].map(k => (
          <div key={k.label} style={{
            background: '#fff', borderRadius: 10, padding: '10px 13px',
            border: '1px solid rgba(0,0,0,0.07)',
          }}>
            <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: k.color }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* Metric Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
        {METRICS.map(m => (
          <button key={m.id} onClick={() => setMetric(m.id)} style={{
            padding: '5px 12px', borderRadius: 20, fontSize: 11.5, cursor: 'pointer',
            border:     metric === m.id ? '1px solid var(--cyan)' : '1px solid rgba(0,0,0,0.1)',
            background: metric === m.id ? 'rgba(8,145,178,0.08)' : '#fff',
            color:      metric === m.id ? 'var(--cyan)' : 'var(--t3)',
            fontWeight: metric === m.id ? 700 : 500,
          }}>
            {m.labelTH}
          </button>
        ))}
      </div>

      {/* Region Filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {REGIONS.map(r => {
          const col = r === 'all' ? 'var(--t2)' : REGION_COLORS[r];
          const active = region === r;
          return (
            <button key={r} onClick={() => setRegion(r)} style={{
              padding: '4px 10px', borderRadius: 20, fontSize: 11, cursor: 'pointer',
              border:     active ? `1px solid ${col}` : '1px solid rgba(0,0,0,0.08)',
              background: active ? (r === 'all' ? 'rgba(0,0,0,0.06)' : col + '18') : '#fff',
              color:      active ? (r === 'all' ? 'var(--t1)' : col) : 'var(--t3)',
              fontWeight: active ? 700 : 400,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              {r !== 'all' && (
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: col, display: 'inline-block' }} />
              )}
              {r === 'all' ? 'ทั้งหมด' : REGION_TH[r]}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 290px', gap: 14 }}>
        {/* Province ranked list */}
        <div className="cc">
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t2)', marginBottom: 12 }}>
            {region === 'all' ? 'ทุกจังหวัด' : REGION_TH[region]} · {mc.labelTH}
            <span style={{ fontWeight: 400, color: 'var(--t3)', marginLeft: 6 }}>({sorted.length} จังหวัด)</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {sorted.map((p, i) => {
              const pct   = (p[mc.key] / maxVal * 100).toFixed(0);
              const col   = REGION_COLORS[p.region];
              const isSel = p.id === selected;
              return (
                <div key={p.id} onClick={() => setSelected(p.id)} style={{
                  display: 'grid', gridTemplateColumns: '24px 1fr 90px 72px',
                  alignItems: 'center', gap: 8, cursor: 'pointer',
                  padding: '5px 8px', borderRadius: 8,
                  background: isSel ? col + '12' : 'transparent',
                  border: isSel ? `1px solid ${col}35` : '1px solid transparent',
                  transition: 'all .15s',
                }}>
                  <span style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600, textAlign: 'right' }}>
                    {i + 1}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
                    <div style={{ width: 7, height: 7, borderRadius: 2, background: col, flexShrink: 0 }} />
                    <span style={{ fontSize: 11.5, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.th}
                    </span>
                  </div>
                  <div style={{ background: 'rgba(148,163,184,0.15)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                    <div style={{ width: pct + '%', height: '100%', background: col, borderRadius: 4, transition: 'width .4s' }} />
                  </div>
                  <span style={{ fontSize: 11, color: isSel ? col : 'var(--t2)', textAlign: 'right', fontWeight: isSel ? 800 : 600 }}>
                    {mc.fmt(p[mc.key])}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Province Detail Card */}
          {selProv && (() => {
            const col = REGION_COLORS[selProv.region];
            return (
              <div className="cc" style={{ borderTop: `3px solid ${col}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: col + '20', border: `1.5px solid ${col}50`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, color: col, flexShrink: 0,
                  }}>
                    {selProv.id.slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)' }}>{selProv.th}</div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>{selProv.en}</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 3, background: col + '18', borderRadius: 10, padding: '1px 7px' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: col, display: 'inline-block' }} />
                      <span style={{ fontSize: 10, color: col, fontWeight: 600 }}>{REGION_TH[selProv.region]}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { label: 'ประชากร',           val: selProv.pop,                              icon: '👥' },
                    { label: 'บริษัทจดทะเบียน',   val: selProv.reg.toLocaleString() + ' บริษัท', icon: '🏢' },
                    { label: 'ทุนจดทะเบียน',       val: '฿' + selProv.cap + 'B',                 icon: '💰' },
                    { label: 'ความหนาแน่น (DBD)',  val: selProv.dens.toLocaleString() + ' /km²',  icon: '📍' },
                  ].map(row => (
                    <div key={row.label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)',
                    }}>
                      <span style={{ fontSize: 11, color: 'var(--t3)', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span>{row.icon}</span>{row.label}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>{row.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Region Summary */}
          <div className="cc">
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t2)', marginBottom: 10 }}>สรุปรายภูมิภาค</div>
            {Object.entries(REGION_COLORS).map(([r, col]) => {
              const provs  = PROVINCES_DATA.filter(p => p.region === r);
              const sumReg = provs.reduce((s, p) => s + p.reg, 0);
              const pct    = (sumReg / totalReg * 100).toFixed(0);
              return (
                <div key={r} onClick={() => setRegion(r === region ? 'all' : r)}
                  style={{ marginBottom: 8, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: col }} />
                      <span style={{ fontSize: 11, color: 'var(--t2)' }}>{REGION_TH[r]}</span>
                      <span style={{ fontSize: 10, color: 'var(--t3)' }}>{provs.length} จว.</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: col }}>{pct}%</span>
                  </div>
                  <div style={{ background: 'rgba(148,163,184,0.15)', borderRadius: 4, height: 5 }}>
                    <div style={{ width: pct + '%', height: '100%', background: col, borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
