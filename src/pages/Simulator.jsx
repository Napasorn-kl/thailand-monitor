import React, { useState, useMemo } from 'react';
import { SIMULATOR_BASE } from '../data/staticData';

const SLIDERS = [
  { key: 'oil',     label: 'ราคาน้ำมัน Brent',  unit: '$/bbl', min: 40,  max: 150, step: 1,   base: 74,   col: '#d97706' },
  { key: 'fx',      label: 'อัตราแลกเปลี่ยน',    unit: 'THB/$', min: 28,  max: 45,  step: 0.5, base: 34.8, col: '#0891b2' },
  { key: 'exports', label: 'การส่งออก YoY',      unit: '%',     min: -15, max: 20,  step: 0.5, base: 3.2,  col: '#22c55e' },
  { key: 'tourism', label: 'นักท่องเที่ยว YoY',  unit: '%',     min: -30, max: 50,  step: 1,   base: 12.4, col: '#8b5cf6' },
  { key: 'fdi',     label: 'FDI Growth YoY',     unit: '%',     min: -20, max: 40,  step: 1,   base: 8.5,  col: '#ec4899' },
];

function computeImpact(vals) {
  const { oil, fx, exports: exp, tourism, fdi } = vals;

  // Oil effect: +$10/bbl → CPI +0.15%, GDP -0.08%
  const oilDiff  = oil - SIMULATOR_BASE.baseBrent;
  const oilCPI   = (oilDiff * 0.015).toFixed(2);
  const oilGDP   = (-oilDiff * 0.008).toFixed(2);

  // FX: weaker THB → exports boost, import cost up
  const fxDiff   = fx - 34.8;
  const fxExpImp = (fxDiff * 0.4).toFixed(1);

  // Export YoY impact
  const expGDP   = ((exp - 3.2) * 0.08).toFixed(2);

  // Tourism YoY
  const tourGDP  = ((tourism - 12.4) * 0.05).toFixed(2);

  // FDI
  const fdiGDP   = ((fdi - 8.5) * 0.03).toFixed(2);

  const totalGDPAdj = (parseFloat(oilGDP) + parseFloat(expGDP) + parseFloat(tourGDP) + parseFloat(fdiGDP)).toFixed(2);
  const baseGDP = 2.5;
  const projGDP = (baseGDP + parseFloat(totalGDPAdj)).toFixed(2);
  const projCPI = (SIMULATOR_BASE.baseCPI + parseFloat(oilCPI)).toFixed(2);

  return { oilCPI, oilGDP, fxExpImp, expGDP, tourGDP, fdiGDP, totalGDPAdj, projGDP, projCPI };
}

export default function Simulator({ data }) {
  const initialVals = useMemo(() => ({
    oil: parseFloat(data.brent) || SLIDERS[0].base,
    fx: parseFloat(data.usdthb) || SLIDERS[1].base,
    exports: 3.2, tourism: 12.4, fdi: 8.5,
  }), [data.brent, data.usdthb]);

  const [vals, setVals] = useState(initialVals);
  const impact = useMemo(() => computeImpact(vals), [vals]);

  const handleChange = (key, val) => setVals(prev => ({ ...prev, [key]: parseFloat(val) }));
  const reset = () => setVals(initialVals);

  const projGDPNum = parseFloat(impact.projGDP);
  const gdpColor = projGDPNum >= 2.5 ? 'var(--green)' : projGDPNum >= 1.5 ? '#f59e0b' : 'var(--red)';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Economic Scenario Simulator</div>
          <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>ปรับตัวแปรและดูผลกระทบต่อเศรษฐกิจไทย</div>
        </div>
        <button onClick={reset} style={{
          padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,.12)',
          background: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: 'var(--t2)',
        }}>
          Reset
        </button>
      </div>

      <div className="g-rhs">
        {/* Sliders */}
        <div className="cc">
          <div className="cc-title" style={{ marginBottom: 16 }}>ปรับตัวแปรเศรษฐกิจ</div>
          {SLIDERS.map(s => {
            const pct = ((vals[s.key] - s.min) / (s.max - s.min) * 100).toFixed(0);
            const isChanged = Math.abs(vals[s.key] - s.base) > 0.01;
            return (
              <div key={s.key} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: s.col }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>{s.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {isChanged && (
                      <span style={{ fontSize: 10, color: 'var(--t3)' }}>
                        base: {s.base}{s.unit}
                      </span>
                    )}
                    <span style={{
                      fontSize: 13, fontWeight: 800, color: s.col,
                      background: s.col + '15', borderRadius: 6, padding: '2px 8px',
                    }}>
                      {vals[s.key]}{s.unit}
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min={s.min} max={s.max} step={s.step}
                  value={vals[s.key]}
                  onChange={e => handleChange(s.key, e.target.value)}
                  style={{ background: `linear-gradient(to right, ${s.col} ${pct}%, rgba(148,163,184,.25) ${pct}%)` }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                  <span style={{ fontSize: 9, color: 'var(--t3)' }}>{s.min}{s.unit}</span>
                  <span style={{ fontSize: 9, color: 'var(--t3)' }}>{s.max}{s.unit}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Projected GDP */}
          <div className="kpi-card" style={{ borderLeftColor: gdpColor }}>
            <div className="kpi-glow" style={{ background: gdpColor }} />
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 8 }}>
              Projected GDP Growth
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: gdpColor, lineHeight: 1 }}>
              {impact.projGDP}<span style={{ fontSize: 18 }}>%</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 5 }}>
              Adjusted from base 2.5% ({impact.totalGDPAdj >= 0 ? '+' : ''}{impact.totalGDPAdj}%)
            </div>
          </div>

          {/* Projected CPI */}
          <div className="kpi-card" style={{ borderLeftColor: '#ef4444' }}>
            <div className="kpi-glow" style={{ background: '#ef4444' }} />
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 8 }}>
              Projected CPI Inflation
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#ef4444', lineHeight: 1 }}>
              {impact.projCPI}<span style={{ fontSize: 16 }}>%</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 5 }}>
              Oil impact: {parseFloat(impact.oilCPI) >= 0 ? '+' : ''}{impact.oilCPI}% CPI
            </div>
          </div>

          {/* Breakdown */}
          <div className="cc">
            <div className="cc-title" style={{ marginBottom: 12 }}>ผลกระทบต่อ GDP</div>
            {[
              { label: 'น้ำมัน', val: impact.oilGDP, col: '#d97706' },
              { label: 'ส่งออก', val: impact.expGDP, col: '#22c55e' },
              { label: 'ท่องเที่ยว', val: impact.tourGDP, col: '#8b5cf6' },
              { label: 'FDI',   val: impact.fdiGDP,  col: '#ec4899' },
            ].map(r => {
              const v = parseFloat(r.val);
              const isPos = v >= 0;
              return (
                <div key={r.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '7px 0', borderBottom: '1px solid rgba(0,0,0,.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: 2, background: r.col }} />
                    <span style={{ fontSize: 11, color: 'var(--t2)' }}>{r.label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: isPos ? 'var(--green)' : 'var(--red)' }}>
                    {isPos ? '+' : ''}{r.val}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
