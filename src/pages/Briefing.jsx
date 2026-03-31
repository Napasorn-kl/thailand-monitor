import React from 'react';
import { TrendingUp } from 'lucide-react';
import { BRIEFING_DATA, SECTORS } from '../data/staticData';

function SignalCard({ item }) {
  return (
    <div className="cc" style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{
          fontSize: 9, fontWeight: 800, letterSpacing: '.5px',
          padding: '2px 7px', borderRadius: 5,
          background: item.col + '20', color: item.col, border: '1px solid ' + item.col + '40',
        }}>
          {item.badge}
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: item.col }}>{item.pct}</span>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t1)', marginBottom: 5, lineHeight: 1.35 }}>
        {item.title}
      </div>
      <div style={{ fontSize: 11, color: 'var(--t3)', lineHeight: 1.5 }}>
        {item.desc}
      </div>
    </div>
  );
}

const TOP_COMPANIES = [
  { name:'PTT',          sector:'Energy',      cap:'฿1.2T', yoy:'+4.2%',  col:'#d97706' },
  { name:'SCG',          sector:'Construction',cap:'฿186B', yoy:'+2.8%',  col:'#22c55e' },
  { name:'CP Group',     sector:'Retail',      cap:'฿890B', yoy:'+6.1%',  col:'#3b82f6' },
  { name:'Central Group',sector:'Retail',      cap:'฿320B', yoy:'+8.4%',  col:'#3b82f6' },
  { name:'KASIKORN',     sector:'Finance',     cap:'฿520B', yoy:'+3.1%',  col:'#0ea5e9' },
  { name:'Thai Airways', sector:'Transport',   cap:'฿45B',  yoy:'-12.4%', col:'#f43f5e' },
];

export default function Briefing({ data }) {
  const { gdp, cpi, brent, exports: exports_, tourism } = data;

  const ECON_SIGNALS = [
    { label: 'GDP Growth',      val: gdp ? gdp + '%' : '2.5%',      target: '3.0%', ok: parseFloat(gdp || 2.5) >= 2.5, src: 'World Bank' },
    { label: 'CPI Inflation',   val: cpi ? cpi + '%' : '0.64%',     target: '1–3%', ok: true, src: 'World Bank' },
    { label: 'Brent Crude',     val: brent ? '$' + brent : '$74.2', target: '<$80',  ok: parseFloat(brent || 74) < 80, src: 'Yahoo/EIA' },
    { label: 'Exports',         val: exports_ ? '$' + exports_ + 'B' : '$24.1B', target: '>$22B', ok: true, src: 'World Bank' },
    { label: 'Tourism Arrivals',val: tourism ? tourism + 'M' : '15.9M', target: '>12M', ok: true, src: 'World Bank' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>AI Economic Briefing · Thailand</div>
        <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>สัญญาณเศรษฐกิจ · โอกาส · ความเสี่ยง · แนวโน้ม</div>
      </div>

      {/* Economic Signal grid */}
      <div className="cc" style={{ marginBottom: 14 }}>
        <div className="cc-title" style={{ marginBottom: 12 }}>Economic Signals · สถานะปัจจุบัน</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10 }}>
          {ECON_SIGNALS.map(s => (
            <div key={s.label} style={{
              padding: '10px 12px', borderRadius: 10,
              background: s.ok ? 'rgba(5,150,105,.05)' : 'rgba(220,38,38,.05)',
              border: '1px solid ' + (s.ok ? 'rgba(5,150,105,.2)' : 'rgba(220,38,38,.2)'),
            }}>
              <div style={{ fontSize: 9.5, color: 'var(--t3)', fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: s.ok ? 'var(--green)' : 'var(--red)', lineHeight: 1.1, marginBottom: 3 }}>
                {s.val}
              </div>
              <div style={{ fontSize: 9.5, color: 'var(--t3)' }}>target: {s.target}</div>
              <div style={{ fontSize: 9, color: 'var(--t3)', marginTop: 2 }}>{s.src}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Opportunities & Risks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
            ▲ โอกาส
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {BRIEFING_DATA.opportunities.map((item, i) => <SignalCard key={i} item={item} />)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--red)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
            ▼ ความเสี่ยง
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {BRIEFING_DATA.risks.map((item, i) => <SignalCard key={i} item={item} />)}
          </div>
        </div>
      </div>

      {/* Trends */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--cyan)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
          <TrendingUp size={13} /> แนวโน้มสำคัญ
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10 }}>
          {BRIEFING_DATA.trends.map((item, i) => <SignalCard key={i} item={item} />)}
        </div>
      </div>

      {/* Notable companies */}
      <div className="cc">
        <div className="cc-title" style={{ marginBottom: 12 }}>บริษัทที่น่าสนใจ · Top Corporates</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(0,0,0,.07)' }}>
                {['บริษัท', 'Sector', 'Market Cap', 'YoY'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--t3)', letterSpacing: '.3px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_COMPANIES.map((c, i) => {
                const isPos = c.yoy.startsWith('+');
                return (
                  <tr key={c.name} style={{ borderBottom: '1px solid rgba(0,0,0,.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,.015)' }}>
                    <td style={{ padding: '8px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: c.col }} />
                        <span style={{ fontWeight: 700, color: 'var(--t1)' }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '8px 10px', color: 'var(--t3)', fontSize: 11 }}>{c.sector}</td>
                    <td style={{ padding: '8px 10px', fontWeight: 700, color: 'var(--t1)' }}>{c.cap}</td>
                    <td style={{ padding: '8px 10px', fontWeight: 700, color: isPos ? 'var(--green)' : 'var(--red)' }}>{c.yoy}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
