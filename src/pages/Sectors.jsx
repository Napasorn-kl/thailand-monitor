import React, { useState } from 'react';
import {
  Plane, ShoppingCart, Hotel, Package, HardHat, Factory, Building2,
  Wrench, HeartPulse, Wheat, Landmark, Truck, Monitor, BookOpen,
  Zap, Tv, BarChart2, Fuel, Trophy,
} from 'lucide-react';
import { SECTORS, GOLD_EXPOSURE } from '../data/staticData';

const SECTOR_ICON_MAP = {
  Tourism:         Plane,
  Retail:          ShoppingCart,
  Hospitality:     Hotel,
  Wholesale:       Package,
  Construction:    HardHat,
  Manufacturing:   Factory,
  'Real Estate':   Building2,
  'Other Services': Wrench,
  Healthcare:      HeartPulse,
  Agriculture:     Wheat,
  Finance:         Landmark,
  Transport:       Truck,
  Technology:      Monitor,
  Education:       BookOpen,
  Energy:          Zap,
  Media:           Tv,
};

function SectorIcon({ name, size = 16, style }) {
  const Icon = SECTOR_ICON_MAP[name] || BarChart2;
  return <Icon size={size} style={style} />;
}

const OIL_INFO = {
  H:   { label: 'ต้นทุนสูงตามน้ำมัน',   desc: 'ราคาน้ำมันขึ้น → ต้นทุนเพิ่มมาก',        bg: 'rgba(239,68,68,.07)',   border: 'rgba(239,68,68,.22)',   color: '#ef4444' },
  M:   { label: 'ต้นทุนบางส่วน',         desc: 'ราคาน้ำมันขึ้น → ต้นทุนเพิ่มบางส่วน',    bg: 'rgba(245,158,11,.07)',  border: 'rgba(245,158,11,.22)',  color: '#f59e0b' },
  L:   { label: 'กระทบน้อย',             desc: 'ไม่พึ่งน้ำมันโดยตรง',                     bg: 'rgba(148,163,184,.07)', border: 'rgba(148,163,184,.22)', color: '#94a3b8' },
  '+': { label: 'ได้ประโยชน์',           desc: 'ราคาน้ำมันขึ้น → รายได้เพิ่มขึ้น',       bg: 'rgba(5,150,105,.07)',   border: 'rgba(5,150,105,.22)',   color: '#059669' },
};

const METRICS = [
  { id: 'reg',    label: 'บริษัทจดทะเบียน', key: 'reg',    fmt: v => v.toLocaleString() },
  { id: 'cap',    label: 'ทุนจดทะเบียน',    key: 'cap',    fmt: v => '฿' + v + 'B'      },
  { id: 'growth', label: 'การเติบโต',        key: 'growth', fmt: v => (v >= 0 ? '+' : '') + v + '%' },
];

function goldLevel(score) {
  if (score >= 70) return { label: 'สูง',      color: '#d97706', bg: 'rgba(217,119,6,.15)' };
  if (score >= 40) return { label: 'ปานกลาง', color: '#b7791f', bg: 'rgba(183,121,31,.12)' };
  return              { label: 'ต่ำ',         color: '#92400e', bg: 'rgba(146,64,14,.10)'  };
}

export default function Sectors({ data }) {
  const [selected, setSelected] = useState(SECTORS[0].name);
  const [metric,   setMetric]   = useState('reg');
  const { brent, goldBar } = data;

  const mc     = METRICS.find(m => m.id === metric);
  const sorted = [...SECTORS].sort((a, b) =>
    metric === 'growth' ? b.growth - a.growth : b[mc.key] - a[mc.key]
  );
  const maxVal = Math.max(...sorted.map(s => Math.abs(s[mc.key])));

  const selSec = SECTORS.find(s => s.name === selected);
  const selGe  = selSec ? GOLD_EXPOSURE[selSec.name] : null;
  const selOil = selSec ? (OIL_INFO[selSec.oilSens] || OIL_INFO.L) : null;

  const totalReg  = SECTORS.reduce((s, x) => s + x.reg, 0);
  const avgGrowth = (SECTORS.reduce((s, x) => s + x.growth, 0) / SECTORS.length).toFixed(1);
  const topSector = [...SECTORS].sort((a, b) => b.growth - a.growth)[0];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>ภาคธุรกิจไทย</div>
        <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
          {SECTORS.length} ภาคธุรกิจ · ข้อมูล DBD 2024
        </div>
      </div>

      {/* KPI Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
        {[
          { label: 'นิติบุคคลทั้งหมด',  val: totalReg.toLocaleString() + ' บริษัท', color: '#0891b2' },
          { label: 'การเติบโตเฉลี่ย',    val: (parseFloat(avgGrowth) >= 0 ? '+' : '') + avgGrowth + '%', color: parseFloat(avgGrowth) >= 0 ? '#16a34a' : '#dc2626' },
          { label: 'ภาคเติบโตสูงสุด',   val: topSector.nameTH, color: topSector.col },
        ].map(k => (
          <div key={k.label} style={{ background: '#fff', borderRadius: 10, padding: '10px 13px', border: '1px solid rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: k.color }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* Metric Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {METRICS.map(m => (
          <button key={m.id} onClick={() => setMetric(m.id)} style={{
            padding: '5px 12px', borderRadius: 20, fontSize: 11.5, cursor: 'pointer',
            border:     metric === m.id ? '1px solid var(--cyan)' : '1px solid rgba(0,0,0,0.1)',
            background: metric === m.id ? 'rgba(8,145,178,0.08)' : '#fff',
            color:      metric === m.id ? 'var(--cyan)' : 'var(--t3)',
            fontWeight: metric === m.id ? 700 : 500,
          }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Two-panel layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 256px', gap: 14 }}>

        {/* LEFT: Ranked list */}
        <div className="cc">
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t2)', marginBottom: 12 }}>
            จัดอันดับตาม{mc.label}
            <span style={{ fontWeight: 400, color: 'var(--t3)', marginLeft: 6 }}>({sorted.length} ภาคธุรกิจ)</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {sorted.map((s, i) => {
              const isNeg = metric === 'growth' && s.growth < 0;
              const pct   = maxVal > 0 ? (Math.abs(s[mc.key]) / maxVal * 100).toFixed(0) : 0;
              const isSel = s.name === selected;
              return (
                <div
                  key={s.name}
                  onClick={() => setSelected(s.name)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '20px minmax(0,1fr) 70px 60px',
                    alignItems: 'center', gap: 6,
                    padding: '6px 8px', borderRadius: 8, cursor: 'pointer',
                    background: isSel ? s.col + '12' : 'transparent',
                    border: isSel ? `1px solid ${s.col}35` : '1px solid transparent',
                    transition: 'all .15s',
                  }}
                >
                  <span style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600, textAlign: 'right' }}>{i + 1}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, overflow: 'hidden' }}>
                    <SectorIcon name={s.name} size={15} style={{ flexShrink: 0, color: isSel ? s.col : 'var(--t3)', opacity: isSel ? 1 : 0.7 }} />
                    <span style={{
                      fontSize: 12, color: 'var(--t1)', overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      fontWeight: isSel ? 700 : 500,
                    }}>{s.nameTH}</span>
                  </div>
                  <div style={{ background: 'rgba(148,163,184,0.15)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                    <div style={{
                      width: pct + '%', height: '100%', borderRadius: 4, transition: 'width .4s',
                      background: isNeg ? '#ef4444' : s.col,
                    }} />
                  </div>
                  <span style={{
                    fontSize: 11, textAlign: 'right', fontWeight: isSel ? 800 : 600,
                    color: metric === 'growth'
                      ? (s.growth >= 0 ? '#16a34a' : '#dc2626')
                      : (isSel ? s.col : 'var(--t2)'),
                  }}>
                    {mc.fmt(s[mc.key])}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Detail panel */}
        {selSec && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Sector info card */}
            <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.07)' }}>
              <div style={{ height: 4, background: selSec.col }} />
              <div style={{ padding: '14px 16px' }}>

                {/* Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                    background: selSec.col + '20', border: `1.5px solid ${selSec.col}50`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: selSec.col,
                  }}>
                    <SectorIcon name={selSec.name} size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', lineHeight: 1.2 }}>{selSec.nameTH}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--t3)', marginBottom: 4 }}>{selSec.name}</div>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 3,
                      fontSize: 12, fontWeight: 800, padding: '2px 8px', borderRadius: 6,
                      background: selSec.growth >= 0 ? 'rgba(22,163,74,.1)' : 'rgba(220,38,38,.1)',
                      color: selSec.growth >= 0 ? '#16a34a' : '#dc2626',
                    }}>
                      {selSec.growth >= 0 ? '↑' : '↓'} {selSec.growth >= 0 ? '+' : ''}{selSec.growth}%
                    </div>
                  </div>
                </div>

                {/* Metrics grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                  {[
                    { label: 'บริษัทจดทะเบียน',  val: selSec.reg.toLocaleString(), unit: 'บริษัท', color: '#0891b2' },
                    { label: 'ทุนจดทะเบียน',      val: '฿' + selSec.cap + 'B',       unit: '',      color: '#d97706' },
                    { label: 'สัดส่วนในตลาด',    val: selSec.share + '%',           unit: 'ของทั้งหมด', color: selSec.col },
                    { label: 'ทุนเฉลี่ย/บริษัท', val: '฿' + selSec.avg + 'M',       unit: 'ต่อบริษัท',  color: 'var(--t2)' },
                  ].map(row => (
                    <div key={row.label} style={{ background: 'rgba(0,0,0,0.03)', borderRadius: 8, padding: '8px 10px' }}>
                      <div style={{ fontSize: 9.5, color: 'var(--t3)', marginBottom: 3 }}>{row.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: row.color, lineHeight: 1.1 }}>{row.val}</div>
                      {row.unit && <div style={{ fontSize: 9, color: 'var(--t3)', marginTop: 1 }}>{row.unit}</div>}
                    </div>
                  ))}
                </div>

                {/* Oil impact */}
                <div style={{
                  background: selOil.bg, borderRadius: 8, padding: '9px 11px',
                  border: `1px solid ${selOil.border}`, marginBottom: 8,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: selOil.color, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Fuel size={12} style={{ flexShrink: 0 }} />
                    <span>น้ำมัน: {selOil.label}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--t2)' }}>{selOil.desc}</div>
                </div>

                {/* Gold exposure */}
                {selGe && (() => {
                  const gl = goldLevel(selGe.score);
                  return (
                    <div style={{
                      background: 'rgba(217,119,6,.07)', borderRadius: 8,
                      padding: '9px 11px', border: '1px solid rgba(217,119,6,.2)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#b7791f', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Trophy size={12} style={{ flexShrink: 0 }} /> ความเกี่ยวข้องกับทองคำ
                        </span>
                        <span style={{
                          fontSize: 10.5, fontWeight: 800, padding: '1px 8px', borderRadius: 10,
                          background: gl.bg, color: gl.color,
                        }}>{gl.label}</span>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.08)', borderRadius: 6, height: 6, marginBottom: 6 }}>
                        <div style={{ width: selGe.score + '%', height: '100%', background: 'linear-gradient(90deg,#d97706,#f59e0b)', borderRadius: 6 }} />
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t2)', marginBottom: 1 }}>{selGe.th}</div>
                      <div style={{ fontSize: 9.5, color: 'var(--t3)' }}>{selGe.score}/100 · {selGe.note}</div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Live prices */}
            <div style={{ background: '#fff', borderRadius: 12, padding: '12px 14px', border: '1px solid rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t2)', marginBottom: 10 }}>ราคาตลาดวันนี้</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10.5, color: 'var(--t3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Fuel size={12} /> Brent Crude
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#d97706' }}>
                    ${parseFloat(brent) || 74.2}
                    <span style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 400 }}>/bbl</span>
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10.5, color: 'var(--t3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Trophy size={12} /> ทองแท่ง (ขายออก)
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#b7791f' }}>
                    {goldBar?.sell ? goldBar.sell.toLocaleString('th-TH') : '—'}
                    <span style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 400 }}>฿</span>
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
