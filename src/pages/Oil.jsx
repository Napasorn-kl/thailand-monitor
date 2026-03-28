import React from 'react';
import {
  ComposedChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import { OIL_PRICE_DATA, OIL_ORIGIN } from '../data/staticData';

const TOOLTIP_STYLE = {
  contentStyle: { background: '#fff', border: '1px solid rgba(0,0,0,.1)', borderRadius: 8, padding: '8px 12px', fontSize: 11 },
  labelStyle: { color: '#64748b', fontWeight: 600 },
};

const priceData = OIL_PRICE_DATA.labels.map((label, i) => ({
  label, brent: OIL_PRICE_DATA.brent[i], dubai: OIL_PRICE_DATA.dubai[i],
}));

const FUEL_TYPES = [
  { key: 'd95',        label: 'Gasohol 95',  col: '#0891b2' },
  { key: 'd91',        label: 'Gasohol 91',  col: '#22d3ee' },
  { key: 'de20',       label: 'E20',          col: '#22c55e' },
  { key: 'de85',       label: 'E85',          col: '#84cc16' },
  { key: 'dDiesel',    label: 'ดีเซล B7',     col: '#f59e0b' },
  { key: 'dDieselB10', label: 'ดีเซล B10',    col: '#d97706' },
];

export default function Oil({ data }) {
  const { brent, brentChange, brentChangePct, usdthb, calcThaiRetail } = data;
  const retail = calcThaiRetail();
  const up = brentChange ? parseFloat(brentChange) >= 0 : false;

  return (
    <div>
      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 14 }}>
        {[
          {
            label: 'Brent Crude (ICE)',
            val: `$${brent || '74.2'}/bbl`,
            sub: brent
              ? `${up ? '▲' : '▼'} ${up ? '+' : ''}${brentChange} (${brentChangePct}%) today`
              : 'Yahoo Finance · delayed',
            subCol: brent ? (up ? 'var(--green)' : 'var(--red)') : 'var(--t3)',
            col: '#d97706',
          },
          {
            label: 'Dubai Crude',
            val: `$${brent ? (parseFloat(brent) - 1.5).toFixed(2) : '72.7'}/bbl`,
            sub: 'Spread Brent −$1.5',
            col: '#ea580c',
          },
          {
            label: 'USD/THB',
            val: `฿${usdthb || '34.8'}`,
            sub: 'Open Exchange Rates',
            col: 'var(--cyan)',
          },
          {
            label: 'Gasohol 95 (ไทย)',
            val: retail?.d95 ? `฿${retail.d95}/ลิตร` : '—',
            sub: retail?.isReal ? `PTT OR · ${retail.src?.split('·')[1]?.trim() || ''}` : retail?.src || 'กำลังโหลด...',
            col: 'var(--cyan)',
          },
        ].map((k, i) => (
          <div key={i} className="kpi-card" style={{ borderLeftColor: k.col }}>
            <div className="kpi-glow" style={{ background: k.col }} />
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 8 }}>
              {k.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.col, lineHeight: 1.1, marginBottom: 5 }}>{k.val}</div>
            <div style={{ fontSize: 11, color: k.subCol || 'var(--t3)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Price chart */}
        <div className="cc">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="cc-title">Brent & Dubai · 12-Month History</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[{ col: '#d97706', label: 'Brent' }, { col: '#0891b2', label: 'Dubai' }].map(l => (
                <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--t3)' }}>
                  <span style={{ display: 'inline-block', width: 12, height: 2, background: l.col }} />{l.label}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={priceData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={v => '$' + v} domain={['auto','auto']} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v, n) => ['$' + v, n]} />
              <Line type="monotone" dataKey="brent" stroke="#d97706" strokeWidth={2.5} dot={{ r: 3, fill: '#d97706' }} name="Brent" />
              <Line type="monotone" dataKey="dubai" stroke="#0891b2" strokeWidth={2} strokeDasharray="4 3" dot={false} name="Dubai" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Origin donut */}
        <div className="cc">
          <div className="cc-title" style={{ marginBottom: 8 }}>แหล่งนำเข้าน้ำมันดิบ</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={OIL_ORIGIN.labels.map((l, i) => ({ name: l, value: OIL_ORIGIN.values[i] }))}
                cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">
                {OIL_ORIGIN.labels.map((_, i) => <Cell key={i} fill={OIL_ORIGIN.colors[i]} />)}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} formatter={v => v + '%'} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 10, color: '#64748b' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Thai retail prices */}
      <div className="cc">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div className="cc-title">ราคาน้ำมันไทย (PTT OR)</div>
          {retail && <span style={{ fontSize: 10, color: 'var(--t3)' }}>{retail.src}</span>}
        </div>
        {retail ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10 }}>
            {FUEL_TYPES.map(f => {
              const val = retail[f.key];
              return (
                <div key={f.key} style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: val ? f.col + '08' : 'rgba(0,0,0,.02)',
                  border: '1px solid ' + (val ? f.col + '25' : 'rgba(0,0,0,.07)'),
                }}>
                  <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600, marginBottom: 5 }}>{f.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: val ? f.col : 'var(--t3)' }}>
                    {val ? `฿${val}` : '—'}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 2 }}>ต่อลิตร</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-data-state">
            <div style={{ fontSize: 13, color: 'var(--t3)' }}>กำลังโหลดข้อมูล...</div>
          </div>
        )}
      </div>
    </div>
  );
}
