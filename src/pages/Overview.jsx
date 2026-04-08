import React from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart,
} from 'recharts';
import {
  OVERVIEW_TREND_DATA, FX_DATA, TOURISM_DATA, TRADE_DATA,
} from '../data/staticData';

const SECTOR_COLORS = ['#22d3ee','#f97316','#22c55e','#3b82f6','#f59e0b','#6b7280','#8b5cf6','#ec4899'];
const SECTOR_LABELS = ['Tourism','Hospitality','Construction','Retail','Wholesale','Other Svcs','Manufacturing','Real Estate'];
const SECTOR_VALUES = [15.9, 12.7, 10.3, 9.8, 8.5, 8.1, 5.0, 6.2];

const TOOLTIP_STYLE = {
  contentStyle: { background: '#fff', border: '1px solid rgba(0,0,0,.1)', borderRadius: 8, padding: '8px 12px', fontSize: 11 },
  labelStyle: { color: '#64748b', fontWeight: 600 },
  itemStyle: { color: '#1e293b' },
};

function KpiCard({ label, value, sub, color, glowColor, subColor }) {
  return (
    <div className="kpi-card" style={{ borderLeftColor: color }}>
      <div className="kpi-glow" style={{ background: glowColor || color }} />
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.1, marginBottom: 5, color }}>{value}</div>
      <div style={{ fontSize: 11.5, color: subColor || 'var(--t3)', lineHeight: 1.4 }}>{sub}</div>
    </div>
  );
}

const trendData = OVERVIEW_TREND_DATA.labels.map((label, i) => ({
  label, gdp: OVERVIEW_TREND_DATA.gdpIndex[i], exports: OVERVIEW_TREND_DATA.exports[i],
}));
const fxData    = FX_DATA.labels.map((label, i)    => ({ label, rate: FX_DATA.rates[i] }));
const tourData  = TOURISM_DATA.labels.map((label, i) => ({ label, arrivals: TOURISM_DATA.arrivals[i] }));
const tradeData = TRADE_DATA.labels.map((label, i)  => ({ label, exports: TRADE_DATA.exports[i], imports: TRADE_DATA.imports[i] }));
const oilCpiData = [
  { label:'ต.ค.', brent:81.2, cpi:0.83 },
  { label:'พ.ย.', brent:78.5, cpi:0.91 },
  { label:'ธ.ค.', brent:76.8, cpi:0.78 },
  { label:'ม.ค.', brent:79.4, cpi:0.72 },
  { label:'ก.พ.', brent:77.1, cpi:0.64 },
  { label:'มี.ค.', brent:74.2, cpi:0.68 },
];

export default function Overview({ data }) {
  const {
    gdp, gdpYear, cpi, cpiYear,
    exports: exports_, exportsYear,
    tourism, tourismYear,
    brent, brentChange, brentChangePct,
  } = data;

  const brentUp = brent && parseFloat(brentChange) >= 0;

  const sMax = Math.max(...SECTOR_VALUES);

  return (
    <div>
      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 20 }}>
        <KpiCard
          label="GDP Growth YoY"
          value={`${gdp || '2.5'}%`}
          sub={`World Bank · ${gdpYear || '2024'}`}
          color="var(--cyan)"
        />
        <KpiCard
          label="Total Exports"
          value={`$${exports_ || '368.8'}B`}
          sub={`${exportsYear || '2024'} annual (World Bank)`}
          color="var(--gold)"
        />
        <KpiCard
          label="Inflation CPI"
          value={`${cpi || '1.37'}%`}
          sub={`World Bank · ${cpiYear || '2024'} · BoT target 1–3%`}
          color="var(--t1)"
          glowColor="#fff"
        />
        <KpiCard
          label="Top Sector"
          value="Tourism"
          sub={tourism ? `${tourism}M arrivals · ${tourismYear}` : '15.9% GDP share'}
          color="var(--cyan)"
        />
        <KpiCard
          label="Top Province"
          value="กรุงเทพฯ"
          sub="฿4.2T capital registered"
          color="var(--purple)"
        />
        <KpiCard
          label="Brent Crude"
          value={`$${brent || '74.2'}/bbl`}
          sub={brent
            ? `${brentUp ? '▲' : '▼'} ${brentUp ? '+' : ''}${brentChange} (${brentChangePct}%) วันนี้`
            : 'ICE delayed'}
          subColor={brent ? (brentUp ? 'var(--green)' : 'var(--red)') : 'var(--t3)'}
          color="var(--gold)"
        />
      </div>

      {/* Main 2-col row */}
      <div className="g-3-2" style={{ marginBottom: 14 }}>
        {/* Trend chart */}
        <div className="cc" style={{ paddingBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="cc-title">Economic Trend · GDP Index &amp; Exports</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[{ col: '#1d8cf8', label: 'GDP Index' }, { col: '#f59e0b', label: 'Exports $M' }].map(l => (
                <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--t3)' }}>
                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: l.col }} />{l.label}
                </span>
              ))}
            </div>
          </div>
          {/* Strip */}
          <div style={{ display: 'flex', gap: 0, border: '1px solid rgba(0,0,0,.07)', borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ flex: 1, padding: '8px 12px', borderRight: '1px solid rgba(0,0,0,.07)', background: 'rgba(29,140,248,.04)' }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: 2 }}>GDP Growth</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#1d8cf8', lineHeight: 1 }}>{gdp ? gdp + '%' : '2.5%'}</div>
              <div style={{ fontSize: 10.5, color: 'var(--green)', fontWeight: 600 }}>World Bank</div>
            </div>
            <div style={{ flex: 1, padding: '8px 12px', borderRight: '1px solid rgba(0,0,0,.07)' }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: 2 }}>Exports</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold)', lineHeight: 1 }}>{exports_ ? '$' + exports_ + 'B' : '$368.8B'}</div>
              <div style={{ fontSize: 10.5, color: 'var(--green)', fontWeight: 600 }}>▲ +3.2% YoY</div>
            </div>
            <div style={{ flex: 1, padding: '8px 12px' }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: 2 }}>17M Avg/mo</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--t2)', lineHeight: 1 }}>12.8K</div>
              <div style={{ fontSize: 10.5, color: 'var(--t3)' }}>Biz reg / month</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={148}>
            <ComposedChart data={trendData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={3} />
              <YAxis yAxisId="left" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fill: '#d97706' }} tickLine={false} axisLine={false} tickFormatter={v => '$' + (v/1000).toFixed(0) + 'K'} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar yAxisId="left" dataKey="gdp" fill="rgba(29,140,248,0.62)" radius={[3,3,0,0]} />
              <Line yAxisId="right" type="monotone" dataKey="exports" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Sectors bar */}
        <div className="cc" style={{ paddingBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <div className="cc-title">Top Sectors by Share</div>
            <span style={{ fontSize: 10, color: 'var(--t3)' }}>38.4M visitors YTD</span>
          </div>
          {SECTOR_LABELS.map((label, i) => {
            const pct = (SECTOR_VALUES[i] / sMax * 100).toFixed(0);
            return (
              <div key={label} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 36px', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, overflow: 'hidden' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: SECTOR_COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: 10.5, color: 'var(--t2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
                </div>
                <div style={{ background: 'rgba(148,163,184,.12)', borderRadius: 4, height: 10, overflow: 'hidden' }}>
                  <div style={{ width: pct + '%', height: '100%', background: SECTOR_COLORS[i], borderRadius: 4, transition: 'width .4s' }} />
                </div>
                <span style={{ fontSize: 10.5, color: 'var(--t3)', textAlign: 'right' }}>{SECTOR_VALUES[i]}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
        <div className="cc">
          <div className="cc-title" style={{ marginBottom: 8 }}>USD/THB Exchange Rate</div>
          <ResponsiveContainer width="100%" height={110}>
            <AreaChart data={fxData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fxGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={['auto','auto']} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="rate" stroke="#d97706" strokeWidth={2} fill="url(#fxGrad)" dot={{ r: 3, fill: '#d97706' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="cc">
          <div className="cc-title" style={{ marginBottom: 8 }}>Tourist Arrivals Monthly (M)</div>
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={tourData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="arrivals" fill="rgba(8,145,178,.55)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="cc">
          <div className="cc-title" style={{ marginBottom: 8 }}>Trade Balance (USD B)</div>
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={tradeData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="exports" fill="rgba(8,145,178,.6)" radius={[3,3,0,0]} />
              <Bar dataKey="imports" fill="rgba(220,38,38,.5)" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="cc">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div className="cc-title">น้ำมัน vs เงินเฟ้อ</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ col: '#d97706', label: 'Brent' }, { col: '#ef4444', label: 'CPI%' }].map(l => (
                <span key={l.label} style={{ fontSize: 10, color: l.col, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ display: 'inline-block', width: 12, height: 2, background: l.col }} />{l.label}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={110}>
            <ComposedChart data={oilCpiData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 9, fill: '#d97706' }} tickLine={false} axisLine={false} tickFormatter={v => '$' + v} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fill: '#ef4444' }} tickLine={false} axisLine={false} tickFormatter={v => v + '%'} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Line yAxisId="left" type="monotone" dataKey="brent" stroke="#d97706" strokeWidth={2.5} dot={{ r: 3, fill: '#d97706' }} />
              <Line yAxisId="right" type="monotone" dataKey="cpi" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 3" dot={{ r: 3, fill: '#ef4444' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
