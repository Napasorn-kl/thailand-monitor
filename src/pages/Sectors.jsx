import React, { useState, useRef, useEffect } from 'react';
import { SECTORS, GOLD_EXPOSURE } from '../data/staticData';

const OIL_BADGE = {
  H: { label: '▲ High',  bg: 'rgba(239,68,68,.1)',  color: '#ef4444' },
  M: { label: '— Med',   bg: 'rgba(245,158,11,.1)', color: '#f59e0b' },
  L: { label: '▽ Low',   bg: 'rgba(148,163,184,.1)',color: '#94a3b8' },
  '+':{ label: '★ Benefit',bg:'rgba(5,150,105,.1)',  color: '#059669' },
};

function SparkLine({ data, color }) {
  const ref = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!ref.current || !window.Chart) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new window.Chart(ref.current, {
      type: 'line',
      data: { labels: data.map((_, i) => i), datasets: [{ data, borderColor: color, borderWidth: 1.5, pointRadius: 0, tension: 0.4, fill: false }] },
      options: { responsive: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } }, animation: false },
    });
    return () => chartRef.current?.destroy();
  }, []);
  return <canvas ref={ref} width={60} height={28} />;
}

function BubbleChart({ sectors }) {
  const ref = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!ref.current || !window.Chart) return;
    if (chartRef.current) chartRef.current.destroy();
    const datasets = sectors.map(s => ({
      label: s.name,
      data: [{ x: s.cap, y: s.growth, r: Math.sqrt(s.reg / 300) }],
      backgroundColor: s.col + '88',
      borderColor: s.col,
    }));
    chartRef.current = new window.Chart(ref.current, {
      type: 'bubble',
      data: { datasets },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#fff', padding: 8, bodyColor: '#1e293b', borderColor: 'rgba(0,0,0,.12)', borderWidth: 1, cornerRadius: 6, callbacks: { label: ctx => `${ctx.dataset.label}: ฿${ctx.parsed.x}B · ${ctx.parsed.y}% growth` } } },
        scales: {
          x: { title: { display: true, text: 'Capital (฿B)', color: '#94a3b8', font: { size: 9 } }, ticks: { color: '#94a3b8', font: { size: 9 } }, grid: { color: 'rgba(0,0,0,.05)' } },
          y: { title: { display: true, text: 'Growth %', color: '#94a3b8', font: { size: 9 } }, ticks: { color: '#94a3b8', font: { size: 9 } }, grid: { color: 'rgba(0,0,0,.05)' } },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}

function OilGoldPanel({ sectors, brent, goldBar }) {
  const brentF = parseFloat(brent) || 74.2;
  const goldBarSell = goldBar?.sell;

  const oilHigh = sectors.filter(s => s.oilSens === 'H');
  const goldHigh = Object.entries(GOLD_EXPOSURE).sort((a, b) => b[1].score - a[1].score).slice(0, 4);

  return (
    <div style={{ background: 'var(--card)', border: '1px solid rgba(0,0,0,.07)', borderRadius: 14, padding: 20, boxShadow: '0 1px 2px rgba(0,0,0,.04),0 4px 12px rgba(0,0,0,.04)' }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t1)', marginBottom: 16 }}>Oil &amp; Gold Impact Analysis</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', background: 'linear-gradient(135deg,rgba(217,119,6,.06),rgba(183,121,31,.03))', border: '1px solid rgba(217,119,6,.18)', borderRadius: 10, padding: '14px 18px', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--t3)' }}>Brent Crude</div>
          <div style={{ fontSize: 21, fontWeight: 800, lineHeight: 1.1, color: '#d97706' }}>${brentF}<span style={{ fontSize: 12, color: 'var(--t3)' }}>/bbl</span></div>
        </div>
        <div style={{ width: 1, height: 52, background: 'rgba(0,0,0,.08)' }} />
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--t3)' }}>Thai Gold Bar Sell</div>
          <div style={{ fontSize: 21, fontWeight: 800, lineHeight: 1.1, color: '#b7791f' }}>{goldBarSell ? goldBarSell.toLocaleString('th-TH') : '71,800'}<span style={{ fontSize: 12, color: 'var(--t3)' }}>฿</span></div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 10.5, color: 'var(--t3)' }}>อัปเดตล่าสุดจาก Live API</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
            ⛽ High Oil Sensitivity Sectors
          </div>
          {oilHigh.map(s => {
            const imp = +((brentF - 70) / 10 * 1.2).toFixed(1);
            return (
              <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: s.col }} />
                  <span style={{ fontSize: 12, color: 'var(--t2)' }}>{s.nameTH || s.name}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: imp > 0 ? '#ef4444' : '#22c55e' }}>
                  {imp >= 0 ? '+' : ''}{imp}%
                </span>
              </div>
            );
          })}
        </div>
        <div>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: '#b7791f', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
            🥇 Gold Exposure Sectors
          </div>
          {goldHigh.map(([name, ge]) => (
            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,.05)' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--t2)' }}>{name}</div>
                <div style={{ fontSize: 10, color: 'var(--t3)' }}>{ge.note}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 40, height: 4, background: 'rgba(0,0,0,.07)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: ge.score + '%', height: '100%', background: '#d97706', borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#b7791f' }}>{ge.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Sectors({ data }) {
  const [expanded, setExpanded] = useState(null);
  const { brent, goldBar } = data;

  const sparkData = (s) => {
    const base = s.reg / 12;
    return Array.from({ length: 6 }, (_, i) => Math.round(base * (0.9 + Math.random() * 0.2)));
  };

  return (
    <div>
      <div style={{ background: 'var(--card)', border: '1px solid rgba(0,0,0,.07)', borderRadius: 14, overflow: 'hidden', marginBottom: 16, boxShadow: '0 1px 2px rgba(0,0,0,.04),0 4px 12px rgba(0,0,0,.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Sector','Registrations ▼','Capital','Avg Capital','Growth','Share','Oil Sens.','Trend'].map(h => (
                <th key={h} style={{ background: 'var(--bg)', padding: '11px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '.7px', textTransform: 'uppercase', color: 'var(--t2)', borderBottom: '1px solid rgba(0,0,0,.07)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SECTORS.map((s, i) => {
              const ob = OIL_BADGE[s.oilSens] || OIL_BADGE.L;
              const isExp = expanded === i;
              return (
                <React.Fragment key={s.name}>
                  <tr
                    style={{ cursor: 'pointer', transition: 'background .12s', background: isExp ? 'rgba(8,145,178,.04)' : '' }}
                    onClick={() => setExpanded(isExp ? null : i)}
                  >
                    <td style={{ padding: '11px 12px', borderBottom: '1px solid rgba(0,0,0,.04)', verticalAlign: 'middle' }}>
                      <span style={{ fontSize: 8, color: isExp ? 'var(--cyan)' : 'var(--t3)', marginRight: 9, display: 'inline-block', transform: isExp ? 'rotate(90deg)' : 'none', transition: 'transform .18s' }}>▶</span>
                      <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', marginRight: 7, background: s.col }} />
                      {s.name}
                    </td>
                    <td style={{ padding: '11px 12px', borderBottom: '1px solid rgba(0,0,0,.04)', fontWeight: 700 }}>{s.reg.toLocaleString()}</td>
                    <td style={{ padding: '11px 12px', borderBottom: '1px solid rgba(0,0,0,.04)', color: 'var(--gold)', fontWeight: 600 }}>฿{s.cap}B</td>
                    <td style={{ padding: '11px 12px', borderBottom: '1px solid rgba(0,0,0,.04)', color: 'var(--t2)' }}>฿{s.avg}M</td>
                    <td style={{ padding: '11px 12px', borderBottom: '1px solid rgba(0,0,0,.04)', color: s.growth >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>{s.growth >= 0 ? '+' : ''}{s.growth}%</td>
                    <td style={{ padding: '11px 12px', borderBottom: '1px solid rgba(0,0,0,.04)', color: 'var(--t2)' }}>{s.share}%</td>
                    <td style={{ padding: '11px 12px', borderBottom: '1px solid rgba(0,0,0,.04)' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: ob.bg, color: ob.color }}>{ob.label}</span>
                    </td>
                    <td style={{ padding: '11px 12px', borderBottom: '1px solid rgba(0,0,0,.04)' }}>
                      <SparkLine data={sparkData(s)} color={s.col} />
                    </td>
                  </tr>
                  {isExp && (
                    <tr>
                      <td colSpan={8} style={{ padding: 0, borderBottom: '1px solid rgba(0,0,0,.07)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '2px solid rgba(8,145,178,.2)', background: 'rgba(241,245,249,.6)' }}>
                          <div style={{ padding: '16px 18px', borderRight: '1px solid rgba(0,0,0,.07)' }}>
                            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 12 }}>ข้อมูลรายละเอียด</div>
                            {[['นิติบุคคลทั้งหมด', s.reg.toLocaleString()], ['ทุนรวม', '฿' + s.cap + 'B'], ['ทุนเฉลี่ย', '฿' + s.avg + 'M'], ['สัดส่วน', s.share + '%']].map(([l, v]) => (
                              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', fontSize: 12, borderBottom: '1px solid rgba(0,0,0,.04)' }}>
                                <span style={{ color: 'var(--t2)' }}>{l}</span>
                                <span style={{ fontWeight: 600 }}>{v}</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ padding: '16px 18px', borderRight: '1px solid rgba(0,0,0,.07)' }}>
                            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 12 }}>Oil &amp; Gold Impact</div>
                            <div style={{ marginBottom: 10 }}>
                              <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 4 }}>Oil Sensitivity</div>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: ob.bg, color: ob.color }}>{ob.label}</span>
                            </div>
                            {GOLD_EXPOSURE[s.name] && (
                              <div>
                                <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 4 }}>Gold Exposure</div>
                                <div style={{ fontSize: 11.5, color: '#b7791f', fontWeight: 700 }}>{GOLD_EXPOSURE[s.name].score}/100</div>
                                <div style={{ fontSize: 10.5, color: 'var(--t3)' }}>{GOLD_EXPOSURE[s.name].note}</div>
                              </div>
                            )}
                          </div>
                          <div style={{ padding: '16px 18px' }}>
                            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 12 }}>การกระจายภาค</div>
                            <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.8 }}>
                              <div>• EEC Zone: ระยอง, ชลบุรี, ฉะเชิงเทรา</div>
                              <div>• Northern Hub: เชียงใหม่, เชียงราย</div>
                              <div>• Capital Cluster: กรุงเทพฯ, นนทบุรี</div>
                              <div>• Southern: ภูเก็ต, สงขลา</div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bubble Chart */}
      <div style={{ background: 'var(--card)', border: '1px solid rgba(0,0,0,.07)', borderRadius: 14, padding: 20, marginBottom: 14, boxShadow: '0 1px 2px rgba(0,0,0,.04),0 4px 12px rgba(0,0,0,.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t1)' }}>Sector Opportunity Matrix</div>
          <div style={{ fontSize: 10, color: 'var(--t3)' }}>X = Capital (฿B) · Y = Growth % · Size = Registrations</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, alignItems: 'start' }}>
          <div style={{ position: 'relative', height: 210 }}>
            <BubbleChart sectors={SECTORS} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, paddingTop: 4, maxHeight: 210, overflowY: 'auto' }}>
            {SECTORS.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: s.col, flexShrink: 0 }} />
                <span style={{ fontSize: 10.5, color: 'var(--t2)' }}>{s.name}</span>
                <span style={{ marginLeft: 'auto', fontSize: 10, color: s.growth >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>{s.growth >= 0 ? '+' : ''}{s.growth}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Oil & Gold panel */}
      <OilGoldPanel sectors={SECTORS} brent={brent} goldBar={goldBar} />
    </div>
  );
}
