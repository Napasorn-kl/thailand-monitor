import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { FDI_DATA, FDI_ORIGIN, FDI_SECTOR } from '../data/staticData';

const TOOLTIP_STYLE = {
  contentStyle: { background: '#fff', border: '1px solid rgba(0,0,0,.1)', borderRadius: 8, padding: '8px 12px', fontSize: 11 },
  labelStyle: { color: '#64748b', fontWeight: 600 },
};

const fdiChartData = FDI_DATA.labels.map((label, i) => ({ label, value: FDI_DATA.values[i] }));

function DonutChart({ data }) {
  const pieData = data.labels.map((name, i) => ({ name, value: data.values[i], fill: data.colors[i] }));
  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie data={pieData} cx="45%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
          {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
        </Pie>
        <Tooltip {...TOOLTIP_STYLE} formatter={v => v + '%'} />
        <Legend iconSize={9} wrapperStyle={{ fontSize: 10, color: '#64748b' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default function Capital({ data }) {
  const { fdi, fdiYear, exports: exports_, exportsYear, usdthb } = data;

  return (
    <div>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 14 }}>
        {[
          { label: 'FDI Net Inflows',  val: fdi ? `$${fdi}B` : '$3.2B',           sub: `World Bank · ${fdiYear || '2023'}`,           col: 'var(--cyan)'  },
          { label: 'SET Index',         val: '1,486',                                sub: '▲ +0.4% today',    subCol: 'var(--green)',    col: '#22c55e'      },
          { label: 'Total Exports',     val: exports_ ? `$${exports_}B` : '$24.1B', sub: `${exportsYear || '2024'} annual · World Bank`, col: 'var(--gold)'  },
          { label: 'USD/THB',           val: usdthb ? `฿${usdthb}` : '฿34.8',      sub: 'Open Exchange Rates',                         col: 'var(--blue)'  },
        ].map((k, i) => (
          <div key={i} className="kpi-card" style={{ borderLeftColor: k.col }}>
            <div className="kpi-glow" style={{ background: k.col }} />
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: k.col, lineHeight: 1.1, marginBottom: 5 }}>{k.val}</div>
            <div style={{ fontSize: 11, color: k.subCol || 'var(--t3)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* FDI Trend */}
      <div className="cc" style={{ marginBottom: 14 }}>
        <div className="cc-title" style={{ marginBottom: 12 }}>FDI Quarterly Trend · Thailand ($ Million)</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={fdiChartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={v => '$' + v + 'M'} />
            <Tooltip {...TOOLTIP_STYLE} formatter={v => ['$' + v + 'M', 'FDI']} />
            <Bar dataKey="value" fill="rgba(8,145,178,.55)" radius={[5,5,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* FDI breakdowns */}
      <div className="g-1-1">
        <div className="cc">
          <div className="cc-title" style={{ marginBottom: 8 }}>FDI แหล่งที่มา (%)</div>
          <DonutChart data={FDI_ORIGIN} />
        </div>
        <div className="cc">
          <div className="cc-title" style={{ marginBottom: 8 }}>FDI แยกอุตสาหกรรม (%)</div>
          <DonutChart data={FDI_SECTOR} />
        </div>
      </div>
    </div>
  );
}
