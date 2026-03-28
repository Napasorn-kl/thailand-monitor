import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DBD_MONTHLY_DATA, CUSTOMS_TRADE_DATA, OPEN_DATASETS } from '../data/staticData';

const TOOLTIP_STYLE = {
  contentStyle: { background: '#fff', border: '1px solid rgba(0,0,0,.1)', borderRadius: 8, padding: '8px 12px', fontSize: 11 },
  labelStyle: { color: '#64748b', fontWeight: 600 },
};

const FORMAT_MAP = {
  csv:  { label: 'CSV',  col: '#22c55e' },
  xlsx: { label: 'XLSX', col: '#0891b2' },
  json: { label: 'JSON', col: '#f59e0b' },
  api:  { label: 'API',  col: '#8b5cf6' },
};

export default function GovData() {
  const { labels, new: newReg, cap, sectors } = DBD_MONTHLY_DATA;
  const { labels: tLabels, exports: tExp, imports: tImp, topExports } = CUSTOMS_TRADE_DATA;

  const latestReg = newReg[newReg.length - 1];
  const latestCap = cap[cap.length - 1];
  const latestExp = tExp[tExp.length - 1];
  const latestImp = tImp[tImp.length - 1];
  const tradeBal  = (latestExp - latestImp).toFixed(0);

  const dbdData   = labels.map((label, i) => ({ label, new: newReg[i] }));
  const tradeData = tLabels.map((label, i) => ({ label, exports: tExp[i], imports: tImp[i] }));

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>ข้อมูลภาครัฐ · Open Government Data</div>
        <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>DBD · กรมศุลกากร · data.go.th</div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 14 }}>
        {[
          { label: 'บริษัทจดทะเบียนใหม่ (มี.ค.)',  val: latestReg.toLocaleString(), sub: 'DBD · นิติบุคคลใหม่', col: 'var(--cyan)' },
          { label: 'ทุนจดทะเบียนใหม่ (มี.ค.)',      val: '฿' + latestCap + 'B',      sub: 'DBD · capital',        col: 'var(--gold)' },
          { label: 'ส่งออก (มี.ค.)',                val: '$' + latestExp + 'M',      sub: 'กรมศุลกากร',           col: 'var(--green)' },
          { label: 'ดุลการค้า (มี.ค.)',              val: (parseInt(tradeBal) >= 0 ? '+' : '') + '$' + tradeBal + 'M', sub: 'ส่งออก − นำเข้า', col: parseInt(tradeBal) >= 0 ? 'var(--green)' : 'var(--red)' },
        ].map((k, i) => (
          <div key={i} className="kpi-card" style={{ borderLeftColor: k.col }}>
            <div className="kpi-glow" style={{ background: k.col }} />
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.col, lineHeight: 1.1, marginBottom: 5 }}>{k.val}</div>
            <div style={{ fontSize: 11, color: 'var(--t3)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div className="cc">
          <div className="cc-title" style={{ marginBottom: 12 }}>บริษัทจดทะเบียนใหม่รายเดือน (DBD)</div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={dbdData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={v => (v/1000).toFixed(0) + 'K'} />
              <Tooltip {...TOOLTIP_STYLE} formatter={v => [v.toLocaleString(), 'บริษัทใหม่']} />
              <Bar dataKey="new" fill="rgba(8,145,178,.55)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="cc">
          <div className="cc-title" style={{ marginBottom: 12 }}>มูลค่าการค้า ส่งออก/นำเข้า (กรมศุลกากร)</div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={tradeData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={v => '$' + (v/1000).toFixed(0) + 'K'} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v, n) => ['$' + v.toLocaleString(), n]} />
              <Bar dataKey="exports" fill="rgba(8,145,178,.55)" radius={[4,4,0,0]} name="ส่งออก" />
              <Bar dataKey="imports" fill="rgba(220,38,38,.4)" radius={[4,4,0,0]} name="นำเข้า" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div className="cc">
          <div className="cc-title" style={{ marginBottom: 12 }}>สัดส่วนภาคธุรกิจที่จดทะเบียนใหม่</div>
          {sectors.map(s => (
            <div key={s.name} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 36px', alignItems: 'center', gap: 8, marginBottom: 7 }}>
              <span style={{ fontSize: 11, color: 'var(--t2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
              <div style={{ background: 'rgba(8,145,178,.1)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                <div style={{ width: s.pct + '%', height: '100%', background: 'var(--cyan)', borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 11, color: 'var(--t3)', textAlign: 'right' }}>{s.pct}%</span>
            </div>
          ))}
        </div>
        <div className="cc">
          <div className="cc-title" style={{ marginBottom: 12 }}>สินค้าส่งออกสำคัญ</div>
          {topExports.map((item, i) => (
            <div key={item.name} style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
              padding: '8px 10px', borderRadius: 8, background: 'rgba(0,0,0,.02)',
            }}>
              <span style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700, width: 16, textAlign: 'center' }}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--t1)', marginBottom: 3 }}>{item.name}</div>
                <div style={{ background: 'rgba(8,145,178,.1)', borderRadius: 3, height: 4, overflow: 'hidden' }}>
                  <div style={{ width: item.pct + '%', height: '100%', background: 'var(--cyan)', borderRadius: 3 }} />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t1)' }}>{item.value}</div>
                <div style={{ fontSize: 10, color: 'var(--t3)' }}>{item.pct}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Open datasets */}
      <div className="cc">
        <div className="cc-title" style={{ marginBottom: 12 }}>Open Datasets · data.go.th</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 8 }}>
          {OPEN_DATASETS.map(ds => {
            const fmt = FORMAT_MAP[ds.format] || { label: ds.format.toUpperCase(), col: '#94a3b8' };
            return (
              <div key={ds.title} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                border: '1px solid rgba(0,0,0,.06)', borderRadius: 8, background: 'rgba(0,0,0,.015)',
              }}>
                <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: fmt.col + '20', color: fmt.col, flexShrink: 0 }}>{fmt.label}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ds.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 2 }}>{ds.org} · {ds.date}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
