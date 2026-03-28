import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { GOLD_PRICE_DATA, GOLD_EXPOSURE, SECTORS } from '../data/staticData';

const TOOLTIP_STYLE = {
  contentStyle: { background: '#fff', border: '1px solid rgba(0,0,0,.1)', borderRadius: 8, padding: '8px 12px', fontSize: 11 },
  labelStyle: { color: '#64748b', fontWeight: 600 },
};

const goldChartData = GOLD_PRICE_DATA.labels.map((label, i) => ({
  label, sell: GOLD_PRICE_DATA.barSell[i],
}));

export default function Gold({ data }) {
  const { goldBar, goldOrn, goldDate, usdthb } = data;

  const xauUsd = goldBar?.sell
    ? (goldBar.sell / 32.15 / (parseFloat(usdthb) || 34.8)).toFixed(2)
    : null;

  const PRICE_GRID = [
    { label: 'ทองแท่ง 96.5% ซื้อ', val: goldBar?.buy,  col: '#22c55e', fmt: v => '฿' + v.toLocaleString('th-TH') },
    { label: 'ทองแท่ง 96.5% ขาย', val: goldBar?.sell, col: '#d97706', fmt: v => '฿' + v.toLocaleString('th-TH') },
    { label: 'ทองรูปพรรณ ซื้อ',   val: goldOrn?.buy,  col: '#22c55e', fmt: v => '฿' + v.toLocaleString('th-TH') },
    { label: 'ทองรูปพรรณ ขาย',   val: goldOrn?.sell, col: '#d97706', fmt: v => '฿' + v.toLocaleString('th-TH') },
    { label: 'XAU/USD (ประมาณ)',   val: xauUsd ? parseFloat(xauUsd) : null, col: '#6b7280', fmt: v => '$' + v.toFixed(2) },
    { label: 'USD/THB',            val: usdthb ? parseFloat(usdthb) : null, col: '#0891b2', fmt: v => '฿' + v.toFixed(2) },
  ];

  const exposureSectors = Object.entries(GOLD_EXPOSURE).map(([name, info]) => ({
    name, ...info, col: SECTORS.find(s => s.name === name)?.col || '#94a3b8',
  })).sort((a, b) => b.score - a.score);

  return (
    <div>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 14 }}>
        {[
          {
            label: 'ทองแท่ง 96.5% (ขาย)',
            val: goldBar?.sell ? '฿' + goldBar.sell.toLocaleString('th-TH') : '—',
            sub: goldDate || 'สมาคมค้าทองคำ',
            col: '#d97706',
          },
          {
            label: 'ทองรูปพรรณ (ขาย)',
            val: goldOrn?.sell ? '฿' + goldOrn.sell.toLocaleString('th-TH') : '—',
            sub: 'ต่อบาท (15.16 กรัม)',
            col: '#c9a227',
          },
          {
            label: 'XAU/USD (ประมาณ)',
            val: xauUsd ? '$' + xauUsd : '—',
            sub: `คำนวณจากราคาแท่ง · ฿${usdthb || '34.8'}/USD`,
            col: '#6b7280',
          },
        ].map((k, i) => (
          <div key={i} className="kpi-card" style={{ borderLeftColor: k.col }}>
            <div className="kpi-glow" style={{ background: k.col }} />
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 8 }}>
              {k.label}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: k.col, lineHeight: 1.1, marginBottom: 5 }}>{k.val}</div>
            <div style={{ fontSize: 11, color: 'var(--t3)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Chart */}
        <div className="cc">
          <div className="cc-title" style={{ marginBottom: 12 }}>ราคาทองแท่ง · 12-Month History (฿/บาททอง)</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={goldChartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false}
                tickFormatter={v => '฿' + (v/1000).toFixed(0) + 'K'} domain={['auto','auto']} />
              <Tooltip {...TOOLTIP_STYLE} formatter={v => ['฿' + v.toLocaleString('th-TH') + '/บาท', 'ราคาขาย']} />
              <Area type="monotone" dataKey="sell" stroke="#d97706" strokeWidth={2.5} fill="url(#goldGrad)"
                dot={{ r: 3, fill: '#d97706' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Price table */}
        <div className="cc">
          <div className="cc-title" style={{ marginBottom: 12 }}>ราคาปัจจุบัน</div>
          {PRICE_GRID.map((row, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '7px 0', borderBottom: i < PRICE_GRID.length - 1 ? '1px solid rgba(0,0,0,.05)' : 'none',
            }}>
              <span style={{ fontSize: 11, color: 'var(--t3)' }}>{row.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: row.val ? row.col : 'var(--t3)' }}>
                {row.val ? row.fmt(row.val) : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sector exposure */}
      <div className="cc">
        <div className="cc-title" style={{ marginBottom: 14 }}>Gold Exposure · ภาคธุรกิจที่ได้รับผลกระทบจากทองคำ</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 10 }}>
          {exposureSectors.map(s => (
            <div key={s.name} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 36px', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: s.col, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'var(--t2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
              </div>
              <div style={{ background: 'rgba(217,119,6,.1)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                <div style={{ width: s.score + '%', height: '100%', background: '#d97706', borderRadius: 4, transition: 'width .4s' }} />
              </div>
              <span style={{ fontSize: 11, color: 'var(--t3)', textAlign: 'right' }}>{s.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
