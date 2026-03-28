import React, { useState } from 'react';
import { PROVINCES_DATA } from '../data/staticData';

const REGION_COLORS = {
  central:      '#0891b2',
  north:        '#22c55e',
  south:        '#f97316',
  east:         '#8b5cf6',
  'north-east': '#f59e0b',
};

const TABS = [
  { id: 'reg',   label: 'Registrations', unit: 'บริษัท', key: 'reg'  },
  { id: 'cap',   label: 'Capital (฿B)',  unit: '฿B',     key: 'cap'  },
  { id: 'dens',  label: 'Density/km²',  unit: '/km²',   key: 'dens' },
];

export default function Provinces({ data }) {
  const [tab, setTab]     = useState('reg');
  const [selected, setSelected] = useState('BKK');

  const tabCfg  = TABS.find(t => t.id === tab);
  const sorted  = [...PROVINCES_DATA].sort((a, b) => b[tabCfg.key] - a[tabCfg.key]);
  const maxVal  = sorted[0]?.[tabCfg.key] || 1;
  const selProv = PROVINCES_DATA.find(p => p.id === selected);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Province Data · Thailand</div>
          <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>77 จังหวัด · ข้อมูล DBD 2024</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '5px 12px', borderRadius: 7, border: '1px solid',
              borderColor: tab === t.id ? 'var(--cyan)' : 'rgba(0,0,0,.1)',
              background: tab === t.id ? 'rgba(8,145,178,.08)' : 'transparent',
              color: tab === t.id ? 'var(--cyan)' : 'var(--t3)',
              fontSize: 11, fontWeight: tab === t.id ? 700 : 500, cursor: 'pointer',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }}>
        {/* Province bar list */}
        <div className="cc">
          <div className="cc-title" style={{ marginBottom: 14 }}>จังหวัดทั้งหมด · {tabCfg.label}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {sorted.slice(0, 20).map((p, i) => {
              const pct = (p[tabCfg.key] / maxVal * 100).toFixed(0);
              const col = REGION_COLORS[p.region];
              const isSelected = p.id === selected;
              return (
                <div key={p.id}
                  onClick={() => setSelected(p.id)}
                  style={{
                    display: 'grid', gridTemplateColumns: '28px 120px 1fr 70px',
                    alignItems: 'center', gap: 8, cursor: 'pointer', padding: '5px 8px',
                    borderRadius: 8, background: isSelected ? 'rgba(8,145,178,.07)' : 'transparent',
                    border: isSelected ? '1px solid rgba(8,145,178,.2)' : '1px solid transparent',
                    transition: 'all .15s',
                  }}>
                  <span style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600, textAlign: 'right' }}>
                    {i + 1}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, overflow: 'hidden' }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: col, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.th}
                    </span>
                  </div>
                  <div style={{ background: 'rgba(148,163,184,.12)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                    <div style={{ width: pct + '%', height: '100%', background: col, borderRadius: 4, transition: 'width .4s' }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--t2)', textAlign: 'right', fontWeight: 600 }}>
                    {tab === 'cap'
                      ? '฿' + p[tabCfg.key] + 'B'
                      : p[tabCfg.key].toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Province detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {selProv && (
            <div className="cc">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: REGION_COLORS[selProv.region] + '20',
                  border: '1.5px solid ' + REGION_COLORS[selProv.region] + '40',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 800, color: REGION_COLORS[selProv.region],
                }}>
                  {selProv.id.slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{selProv.th}</div>
                  <div style={{ fontSize: 11, color: 'var(--t3)' }}>{selProv.en}</div>
                </div>
              </div>

              {[
                { label: 'ประชากร',             val: selProv.pop },
                { label: 'บริษัทจดทะเบียน',     val: selProv.reg.toLocaleString() + ' บริษัท' },
                { label: 'ทุนจดทะเบียน',         val: '฿' + selProv.cap + 'B' },
                { label: 'ความหนาแน่น (DBD)',     val: selProv.dens.toLocaleString() + ' /km²' },
                { label: 'ภูมิภาค',              val: selProv.region },
              ].map(row => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,.05)',
                }}>
                  <span style={{ fontSize: 11, color: 'var(--t3)' }}>{row.label}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t1)' }}>{row.val}</span>
                </div>
              ))}
            </div>
          )}

          {/* Region legend */}
          <div className="cc">
            <div className="cc-title" style={{ marginBottom: 10 }}>ภูมิภาค</div>
            {Object.entries(REGION_COLORS).map(([r, col]) => (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: col }} />
                <span style={{ fontSize: 11, color: 'var(--t2)', textTransform: 'capitalize' }}>{r}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--t3)' }}>
                  {PROVINCES_DATA.filter(p => p.region === r).length} จังหวัด
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
