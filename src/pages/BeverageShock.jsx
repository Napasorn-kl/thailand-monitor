import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, CartesianGrid, ReferenceLine,
} from 'recharts';
import {
  AlertTriangle, TrendingDown, TrendingUp, Package, Truck,
  Globe, BarChart2, Activity, Droplets, Factory, ShieldAlert,
  Clock, CheckCircle2, XCircle, Info,
} from 'lucide-react';

// ─── Color constants ──────────────────────────────────────────────────────────
const RISK_COLOR = {
  Critical: '#ef4444',
  High:     '#f59e0b',
  Medium:   '#3b82f6',
  Low:      '#22c55e',
};
const RISK_BG = {
  Critical: 'rgba(239,68,68,0.10)',
  High:     'rgba(245,158,11,0.10)',
  Medium:   'rgba(59,130,246,0.10)',
  Low:      'rgba(34,197,94,0.10)',
};
const RISK_BORDER = {
  Critical: 'rgba(239,68,68,0.28)',
  High:     'rgba(245,158,11,0.28)',
  Medium:   'rgba(59,130,246,0.28)',
  Low:      'rgba(34,197,94,0.28)',
};

const TOOLTIP_STYLE = {
  contentStyle: { background: '#fff', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 8, padding: '8px 12px', fontSize: 11 },
  labelStyle: { color: '#64748b', fontWeight: 600 },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const RISK_COUNTS = { Critical: 3, High: 5, Medium: 6, Low: 4 };

const COMPOSITE_SCORE = 72; // 0–100, higher = more at risk

const TOP_ALERTS = [
  {
    id: 1, level: 'Critical', material: 'น้ำตาลทราย', icon: '🍬',
    msg: 'ภัยแล้งภาคกลางกระทบอ้อย 40% ของโควตา Q2',
    detail: 'ราคาน้ำตาลดิบขึ้น +18% MoM · คาดขาดแคลน 85,000 ตัน',
  },
  {
    id: 2, level: 'Critical', material: 'CO₂ / Gas', icon: '💨',
    msg: 'โรงผลิต CO₂ หยุดซ่อมฉุกเฉิน 3 โรง ทำให้ขาดแคลนทั่วภูมิภาค',
    detail: 'กระทบสายการผลิตน้ำอัดลมและเบียร์ · ETA กลับสู่ปกติ 3 สัปดาห์',
  },
  {
    id: 3, level: 'Critical', material: 'อลูมิเนียมกระป๋อง', icon: '🥫',
    msg: 'ราคาอลูมิเนียม LME พุ่ง +22% จากมาตรการภาษีสหรัฐ',
    detail: 'ผู้ผลิตไทยสต็อกเหลือ 18 วัน · Spot premium เพิ่ม $85/ตัน',
  },
];

const RISK_BREAKDOWN = [
  { name: 'น้ำตาลทราย',       score: 91, level: 'Critical' },
  { name: 'CO₂/Gas',          score: 88, level: 'Critical' },
  { name: 'อลูมิเนียมกระป๋อง', score: 85, level: 'Critical' },
  { name: 'PET Resin',         score: 74, level: 'High' },
  { name: 'ขวดแก้ว',          score: 68, level: 'High' },
  { name: 'ฉลาก/บรรจุภัณฑ์', score: 62, level: 'High' },
  { name: 'น้ำสะอาด',         score: 48, level: 'Medium' },
  { name: 'สารแต่งสี/กลิ่น',  score: 35, level: 'Low' },
];

const GLOBAL_EVENTS = [
  {
    event: 'ภัยแล้งลุ่มน้ำเจ้าพระยา',
    region: 'ไทย (ภาคกลาง)',
    materials: 'น้ำตาลทราย, น้ำสะอาด',
    score: 91, status: 'Active',
    statusColor: '#ef4444',
  },
  {
    event: 'CO₂ Plant Shutdown — PTT & Air Liquide',
    region: 'ไทย / อาเซียน',
    materials: 'CO₂ / Carbonation Gas',
    score: 88, status: 'Active',
    statusColor: '#ef4444',
  },
  {
    event: 'US Section 232 Aluminum Tariff',
    region: 'Global',
    materials: 'อลูมิเนียมกระป๋อง',
    score: 85, status: 'Escalating',
    statusColor: '#f59e0b',
  },
  {
    event: 'พายุไต้ฝุ่น Mawar — ท่าเรือมะนิลาปิด',
    region: 'ฟิลิปปินส์ / SEA',
    materials: 'PET Resin, ขวดแก้ว',
    score: 76, status: 'Monitoring',
    statusColor: '#3b82f6',
  },
  {
    event: 'China PET Resin Export Quota Cut',
    region: 'จีน / Global',
    materials: 'PET Resin',
    score: 72, status: 'Confirmed',
    statusColor: '#f59e0b',
  },
  {
    event: 'Indonesia Palm Sugar Export Ban',
    region: 'อินโดนีเซีย',
    materials: 'น้ำตาลทราย, สารให้ความหวาน',
    score: 65, status: 'Monitoring',
    statusColor: '#3b82f6',
  },
  {
    event: 'ปัญหาการขนส่งทางทะเล — Red Sea Disruption',
    region: 'Global',
    materials: 'ฉลาก, บรรจุภัณฑ์, เคมีภัณฑ์',
    score: 58, status: 'Ongoing',
    statusColor: '#f59e0b',
  },
  {
    event: 'Malaysia Glass Plant Closure',
    region: 'มาเลเซีย / SEA',
    materials: 'ขวดแก้ว',
    score: 44, status: 'Resolved',
    statusColor: '#22c55e',
  },
];

const FORECAST_DATA = [
  { month: 'ต.ค. 68', risk: 52, sugar: 60, co2: 45, aluminum: 55, pet: 50 },
  { month: 'พ.ย. 68', risk: 58, sugar: 65, co2: 50, aluminum: 62, pet: 54 },
  { month: 'ธ.ค. 68', risk: 63, sugar: 72, co2: 58, aluminum: 70, pet: 58 },
  { month: 'ม.ค. 69', risk: 70, sugar: 80, co2: 78, aluminum: 78, pet: 65 },
  { month: 'ก.พ. 69', risk: 75, sugar: 88, co2: 85, aluminum: 82, pet: 70 },
  { month: 'มี.ค. 69', risk: 72, sugar: 91, co2: 88, aluminum: 85, pet: 72 },
];

const INVENTORY_MATERIALS = [
  { name: 'น้ำตาลทราย',        days: 18, safe: 45, level: 'Critical', region: 'ไทย',   unit: 'วัน',  price: '฿22,400/ตัน', change: '+18%' },
  { name: 'CO₂ / Gas',         days: 9,  safe: 30, level: 'Critical', region: 'SEA',   unit: 'วัน',  price: '$240/ตัน',    change: '+31%' },
  { name: 'อลูมิเนียมกระป๋อง', days: 18, safe: 40, level: 'Critical', region: 'Global',unit: 'วัน',  price: '$2,850/ตัน',  change: '+22%' },
  { name: 'PET Resin',          days: 28, safe: 45, level: 'High',     region: 'จีน',   unit: 'วัน',  price: '$1,180/ตัน',  change: '+9%'  },
  { name: 'ขวดแก้ว',           days: 35, safe: 60, level: 'High',     region: 'SEA',   unit: 'วัน',  price: '฿8,200/ตัน',  change: '+7%'  },
  { name: 'ฉลาก/บรรจุภัณฑ์',  days: 42, safe: 60, level: 'Medium',   region: 'ไทย',   unit: 'วัน',  price: '฿45/ชิ้น',    change: '+3%'  },
  { name: 'สารแต่งสี/กลิ่น',   days: 55, safe: 60, level: 'Low',      region: 'Global',unit: 'วัน',  price: '$8/kg',        change: '-1%'  },
  { name: 'น้ำสะอาด',          days: 60, safe: 60, level: 'Medium',   region: 'ไทย',   unit: 'วัน',  price: '฿2.5/ลบ.ม.',  change: '+12%' },
];

const OTIF_DATA = [
  { supplier: 'Mitr Phol Sugar',     otif: 62, risk: 'Critical', onTime: 68, inFull: 56 },
  { supplier: 'Air Liquide TH',      otif: 48, risk: 'Critical', onTime: 52, inFull: 44 },
  { supplier: 'Ball Beverage Pack.', otif: 55, risk: 'Critical', onTime: 60, inFull: 50 },
  { supplier: 'Indorama Ventures',   otif: 74, risk: 'High',     onTime: 78, inFull: 70 },
  { supplier: 'Thai Beverage Can',   otif: 71, risk: 'High',     onTime: 75, inFull: 67 },
  { supplier: 'Siam Glass Ind.',     otif: 78, risk: 'Medium',   onTime: 82, inFull: 74 },
  { supplier: 'Berli Jucker',        otif: 85, risk: 'Low',      onTime: 88, inFull: 82 },
  { supplier: 'SCG Packaging',       otif: 90, risk: 'Low',      onTime: 91, inFull: 89 },
];

const SUPPLIER_PERF = [
  { supplier: 'Mitr Phol Sugar',     category: 'น้ำตาล',        score: 62, status: 'Critical', action: 'หาซัพพลายเออร์สำรอง' },
  { supplier: 'Air Liquide TH',      category: 'CO₂/Gas',       score: 48, status: 'Critical', action: 'สั่งซื้อล่วงหน้า 3 เดือน' },
  { supplier: 'Ball Beverage Pack.', category: 'อลูมิเนียม',    score: 55, status: 'Critical', action: 'เจรจาสัญญาระยะยาว' },
  { supplier: 'Indorama Ventures',   category: 'PET Resin',     score: 74, status: 'High',     action: 'เพิ่มสต็อกสำรอง' },
  { supplier: 'Thai Beverage Can',   category: 'กระป๋อง',       score: 71, status: 'High',     action: 'ติดตามใกล้ชิด' },
  { supplier: 'Siam Glass Ind.',     category: 'ขวดแก้ว',      score: 78, status: 'Medium',   action: 'รักษาสต็อก 35 วัน' },
  { supplier: 'Berli Jucker',        category: 'บรรจุภัณฑ์',   score: 85, status: 'Low',      action: 'ปกติ' },
  { supplier: 'SCG Packaging',       category: 'ฉลาก',         score: 90, status: 'Low',      action: 'ปกติ' },
];

const SUPPLIER_RADAR = [
  { metric: 'คุณภาพ',     'Mitr Phol': 72, 'Air Liquide': 60, 'Ball Pack.': 65 },
  { metric: 'ตรงเวลา',   'Mitr Phol': 62, 'Air Liquide': 48, 'Ball Pack.': 55 },
  { metric: 'ราคา',       'Mitr Phol': 70, 'Air Liquide': 74, 'Ball Pack.': 68 },
  { metric: 'ความยืดหยุ่น','Mitr Phol': 50,'Air Liquide': 40, 'Ball Pack.': 60 },
  { metric: 'ความน่าเชื่อถือ','Mitr Phol': 65,'Air Liquide': 52,'Ball Pack.': 58 },
];

const CATEGORY_CARDS = [
  {
    material: 'น้ำตาลทราย',
    icon: '🍬',
    risk: 'Critical',
    price: '฿22,400/ตัน',
    priceChange: '+18% MoM',
    up: true,
    status: 'ขาดแคลนรุนแรง',
    suppliers: 'Mitr Phol, KSL, Thai Roong Ruang',
    action: 'เร่งสรรหาน้ำตาลจากบราซิล / ออสเตรเลีย และพิจารณาใช้สารให้ความหวานทดแทน',
    days: 18,
    trend: [60, 65, 72, 80, 88, 91],
  },
  {
    material: 'อลูมิเนียมกระป๋อง',
    icon: '🥫',
    risk: 'Critical',
    price: '$2,850/ตัน',
    priceChange: '+22% MoM',
    up: true,
    status: 'ราคาพุ่งสูง',
    suppliers: 'Ball Corp, Crown Holdings, Thai Beverage Can',
    action: 'ล็อคราคาด้วยสัญญา Hedge 6 เดือน · เพิ่มสัดส่วนบรรจุภัณฑ์ PET',
    days: 18,
    trend: [55, 62, 70, 78, 82, 85],
  },
  {
    material: 'CO₂ / Gas',
    icon: '💨',
    risk: 'Critical',
    price: '$240/ตัน',
    priceChange: '+31% MoM',
    up: true,
    status: 'หยุดซ่อมฉุกเฉิน',
    suppliers: 'Air Liquide TH, Linde TH, PTT Global Chemical',
    action: 'ประสาน Air Liquide ฉุกเฉิน · ลดการผลิตน้ำอัดลมชั่วคราว 20%',
    days: 9,
    trend: [45, 50, 58, 78, 85, 88],
  },
  {
    material: 'ขวดแก้ว',
    icon: '🍾',
    risk: 'High',
    price: '฿8,200/ตัน',
    priceChange: '+7% MoM',
    up: true,
    status: 'ตึงตัวปานกลาง',
    suppliers: 'Siam Glass, BGF, O-I Glass',
    action: 'เพิ่มสต็อกสำรองเป็น 45 วัน · ประสาน BGF สำรองไลน์ผลิต',
    days: 35,
    trend: [44, 50, 55, 60, 65, 68],
  },
  {
    material: 'PET Resin',
    icon: '🧴',
    risk: 'High',
    price: '$1,180/ตัน',
    priceChange: '+9% MoM',
    up: true,
    status: 'จีนลดโควตา',
    suppliers: 'Indorama Ventures, Alpek, Far Eastern',
    action: 'กระจายซัพพลายเออร์ไปอินเดีย / MEA · เพิ่มอัตราการรีไซเคิล rPET',
    days: 28,
    trend: [50, 54, 58, 65, 70, 72],
  },
];

// ─── Shared sub-components ────────────────────────────────────────────────────
function RiskBadge({ level, size = 'sm' }) {
  const fs  = size === 'sm' ? 9.5 : 11;
  const pad = size === 'sm' ? '2px 7px' : '3px 10px';
  return (
    <span style={{
      fontSize: fs, fontWeight: 700, padding: pad, borderRadius: 5,
      background: RISK_BG[level], color: RISK_COLOR[level],
      border: `1px solid ${RISK_BORDER[level]}`, whiteSpace: 'nowrap',
    }}>
      {level}
    </span>
  );
}

function MiniSparkline({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 64, h = 24;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GaugeMeter({ score }) {
  const r = 70;
  const cx = 90, cy = 90;
  const startAngle = -210;
  const endAngle   = 30;
  const totalDeg   = endAngle - startAngle; // 240°
  const scoreDeg   = (score / 100) * totalDeg;
  const toRad = d => (d * Math.PI) / 180;
  const arcPath = (start, end, radius) => {
    const s = toRad(start), e = toRad(end);
    const x1 = cx + radius * Math.cos(s), y1 = cy + radius * Math.sin(s);
    const x2 = cx + radius * Math.cos(e), y2 = cy + radius * Math.sin(e);
    const large = end - start > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
  };
  const trackPath = arcPath(startAngle, endAngle, r);
  const fillPath  = arcPath(startAngle, startAngle + scoreDeg, r);
  const scoreColor = score >= 75 ? '#ef4444' : score >= 50 ? '#f59e0b' : '#22c55e';
  const scoreLabel = score >= 75 ? 'CRITICAL' : score >= 50 ? 'HIGH' : 'MODERATE';
  return (
    <svg viewBox="0 0 180 120" style={{ width: '100%', maxWidth: 200 }}>
      <path d={trackPath} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={10} strokeLinecap="round" />
      <path d={fillPath}  fill="none" stroke={scoreColor}       strokeWidth={10} strokeLinecap="round" />
      <text x={cx} y={cy - 4}  textAnchor="middle" fill={scoreColor}       fontSize={26} fontWeight={800}>{score}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--t2)"        fontSize={9}  fontWeight={700} letterSpacing={1}>{scoreLabel}</text>
      <text x={cx} y={cy + 26} textAnchor="middle" fill="var(--t3)"        fontSize={8}>Composite Risk Score</text>
      <text x={20} y={cy + 14} textAnchor="middle" fill="#22c55e"          fontSize={8} fontWeight={600}>0</text>
      <text x={160} y={cy + 14} textAnchor="middle" fill="#ef4444"         fontSize={8} fontWeight={600}>100</text>
    </svg>
  );
}

function ProgressBar({ value, max, color }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ height: 6, borderRadius: 4, background: 'rgba(0,0,0,0.07)', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.5s ease' }} />
    </div>
  );
}

const CUSTOM_BAR_TICK = (props) => {
  const { x, y, payload } = props;
  return (
    <text x={x} y={y + 3} textAnchor="end" fill="var(--t2)" fontSize={10} fontWeight={500}>
      {payload.value}
    </text>
  );
};

// ─── Tab content components ───────────────────────────────────────────────────
function OverviewTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Risk Index Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {Object.entries(RISK_COUNTS).map(([level, count]) => (
          <div key={level} className="kpi-card" style={{ borderLeftColor: RISK_COLOR[level] }}>
            <div className="kpi-glow" style={{ background: RISK_COLOR[level] }} />
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 6 }}>
              {level} Risk
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: RISK_COLOR[level], lineHeight: 1 }}>{count}</div>
            <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 5 }}>
              {level === 'Critical' ? 'ต้องดำเนินการทันที' : level === 'High' ? 'เฝ้าระวังสูง' : level === 'Medium' ? 'ติดตามอย่างใกล้ชิด' : 'ระดับปกติ'}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 14 }}>
        {/* Gauge + Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Gauge */}
          <div className="cc" style={{ textAlign: 'center' }}>
            <div className="cc-title">🎯 Supply Shock Composite Score</div>
            <GaugeMeter score={COMPOSITE_SCORE} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginTop: 8 }}>
              {[['Low','<50','#22c55e'],['Medium','50-65','#3b82f6'],['High','65-80','#f59e0b'],['Critical','>80','#ef4444']].map(([l,r,c]) => (
                <div key={l} style={{ textAlign: 'center', fontSize: 9, color: c, fontWeight: 600 }}>
                  <div style={{ background: RISK_BG[l], borderRadius: 4, padding: '2px 4px' }}>{l}</div>
                  <div style={{ color: 'var(--t3)', marginTop: 2 }}>{r}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Alert Summary */}
          <div className="cc">
            <div className="cc-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={13} color="#ef4444" />
              Critical Alerts · ต้องดำเนินการ
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {TOP_ALERTS.map(a => (
                <div key={a.id} style={{
                  padding: '9px 11px', borderRadius: 9,
                  background: RISK_BG[a.level], border: `1px solid ${RISK_BORDER[a.level]}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 14 }}>{a.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t1)' }}>{a.material}</span>
                    <RiskBadge level={a.level} />
                  </div>
                  <div style={{ fontSize: 10.5, color: 'var(--t1)', marginBottom: 3 }}>{a.msg}</div>
                  <div style={{ fontSize: 10, color: 'var(--t3)' }}>{a.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Breakdown Bar Chart */}
        <div className="cc">
          <div className="cc-title">📊 Risk Breakdown by Material</div>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              data={RISK_BREAKDOWN}
              layout="vertical"
              margin={{ top: 0, right: 20, bottom: 0, left: 110 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--t3)' }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'var(--t2)' }} tickLine={false} axisLine={false} width={105} />
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(v, n, p) => [v, 'Risk Score']}
              />
              <Bar dataKey="score" radius={4} maxBarSize={18}>
                {RISK_BREAKDOWN.map((entry, i) => (
                  <rect key={i} fill={RISK_COLOR[entry.level]} />
                ))}
              </Bar>
              {/* Use cells via custom rendering */}
              <Bar dataKey="score" radius={4} maxBarSize={18} fill="#3b82f6">
                {RISK_BREAKDOWN.map((entry, index) => (
                  <React.Fragment key={index} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8, flexWrap: 'wrap' }}>
            {Object.entries(RISK_COLOR).map(([level, color]) => (
              <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--t2)' }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                {level}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Fix: Render BarChart with proper cell colors using a CustomBar
function CustomRiskBar(props) {
  const { x, y, width, height, level } = props;
  return <rect x={x} y={y} width={width} height={height} fill={RISK_COLOR[level] || '#3b82f6'} rx={4} />;
}

function OverviewBarChart({ data = RISK_BREAKDOWN }) {
  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 110 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--t3)' }} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: 'var(--t2)' }} tickLine={false} axisLine={false} width={105} />
        <Tooltip {...TOOLTIP_STYLE} formatter={v => [v, 'Risk Score']} />
        <Bar dataKey="score" radius={4} maxBarSize={18} shape={<CustomRiskBar />} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function OverviewTabFixed({ liveData }) {
  // Merge real commodity data into RISK_BREAKDOWN
  const effectiveBreakdown = RISK_BREAKDOWN.map(item => {
    const key = item.name === 'น้ำตาลทราย' ? 'sugar'
              : item.name === 'อลูมิเนียมกระป๋อง' ? 'aluminum'
              : item.name === 'PET Resin' ? 'crude_oil'
              : null;
    const mat = key && liveData?.materials?.[key];
    if (!mat) return item;
    return { ...item, score: mat.risk_score, level: mat.risk_level };
  });
  const effectiveScore = liveData?.composite_score ?? COMPOSITE_SCORE;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Risk Index Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {Object.entries(RISK_COUNTS).map(([level, count]) => (
          <div key={level} className="kpi-card" style={{ borderLeftColor: RISK_COLOR[level] }}>
            <div className="kpi-glow" style={{ background: RISK_COLOR[level] }} />
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 6 }}>
              {level} Risk
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: RISK_COLOR[level], lineHeight: 1 }}>{count}</div>
            <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 5 }}>
              {level === 'Critical' ? 'ต้องดำเนินการทันที' : level === 'High' ? 'เฝ้าระวังสูง' : level === 'Medium' ? 'ติดตามอย่างใกล้ชิด' : 'ระดับปกติ'}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Gauge */}
          <div className="cc" style={{ textAlign: 'center' }}>
            <div className="cc-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              🎯 Supply Shock Composite Score
              {liveData && <span style={{ fontSize: 9, fontWeight: 700, background: '#22c55e15', color: '#22c55e', border: '1px solid #22c55e40', borderRadius: 4, padding: '1px 5px' }}>🟢 Live</span>}
            </div>
            <GaugeMeter score={effectiveScore} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4, marginTop: 8 }}>
              {[['Low','<50','#22c55e'],['Medium','50-65','#3b82f6'],['High','65-80','#f59e0b'],['Critical','>80','#ef4444']].map(([l,r,c]) => (
                <div key={l} style={{ textAlign: 'center', fontSize: 8.5, color: c, fontWeight: 600 }}>
                  <div style={{ background: RISK_BG[l], borderRadius: 4, padding: '2px 3px' }}>{l}</div>
                  <div style={{ color: 'var(--t3)', marginTop: 2 }}>{r}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Alert Summary */}
          <div className="cc">
            <div className="cc-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={13} color="#ef4444" />
              Critical Alerts
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {TOP_ALERTS.map(a => (
                <div key={a.id} style={{ padding: '9px 11px', borderRadius: 9, background: RISK_BG[a.level], border: `1px solid ${RISK_BORDER[a.level]}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 14 }}>{a.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t1)' }}>{a.material}</span>
                    <RiskBadge level={a.level} />
                  </div>
                  <div style={{ fontSize: 10.5, color: 'var(--t1)', marginBottom: 3 }}>{a.msg}</div>
                  <div style={{ fontSize: 10, color: 'var(--t3)' }}>{a.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Breakdown Bar Chart */}
        <div className="cc">
          <div className="cc-title">📊 Risk Breakdown by Material</div>
          <OverviewBarChart data={effectiveBreakdown} />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8, flexWrap: 'wrap' }}>
            {Object.entries(RISK_COLOR).map(([level, color]) => (
              <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--t2)' }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                {level}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EventsTab() {
  const statusIcon = (status) => {
    if (status === 'Active' || status === 'Escalating') return <AlertTriangle size={11} />;
    if (status === 'Resolved') return <CheckCircle2 size={11} />;
    return <Info size={11} />;
  };
  return (
    <div className="cc">
      <div className="cc-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Globe size={14} color="var(--cyan)" />
        Global Supply Events · เหตุการณ์กระทบห่วงโซ่อุปทาน
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
          <thead>
            <tr style={{ borderBottom: '1.5px solid rgba(0,0,0,0.08)' }}>
              {['เหตุการณ์', 'ภูมิภาค', 'วัสดุที่กระทบ', 'Impact Score', 'สถานะ'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--t3)', letterSpacing: '.5px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GLOBAL_EVENTS.map((ev, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '11px 12px', fontWeight: 600, color: 'var(--t1)', maxWidth: 220 }}>
                  {ev.event}
                </td>
                <td style={{ padding: '11px 12px', color: 'var(--t2)', whiteSpace: 'nowrap' }}>
                  {ev.region}
                </td>
                <td style={{ padding: '11px 12px', color: 'var(--t2)', fontSize: 11 }}>
                  {ev.materials}
                </td>
                <td style={{ padding: '11px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'rgba(0,0,0,0.07)', overflow: 'hidden', minWidth: 50 }}>
                      <div style={{ height: '100%', width: `${ev.score}%`, background: ev.score >= 75 ? '#ef4444' : ev.score >= 55 ? '#f59e0b' : '#3b82f6', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: ev.score >= 75 ? '#ef4444' : ev.score >= 55 ? '#f59e0b' : '#3b82f6', minWidth: 24, textAlign: 'right' }}>
                      {ev.score}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '11px 12px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 5,
                    color: ev.statusColor,
                    background: `${ev.statusColor}15`,
                    border: `1px solid ${ev.statusColor}40`,
                  }}>
                    {statusIcon(ev.status)}
                    {ev.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ForecastTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Composite Risk Trend */}
      <div className="cc">
        <div className="cc-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Activity size={14} color="var(--cyan)" />
          Supply Risk Index Forecast · 6-Month Outlook (ต.ค. 68 – มี.ค. 69)
          <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 600, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 5, padding: '2px 8px' }}>
            FORECAST
          </span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={FORECAST_DATA} margin={{ top: 8, right: 16, bottom: 0, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="month" tick={{ fontSize: 10.5, fill: 'var(--t2)' }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--t3)' }} tickLine={false} axisLine={false} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
            <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="4 3" strokeWidth={1.2} label={{ value: 'Critical', position: 'insideTopRight', fontSize: 9, fill: '#ef4444' }} />
            <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth={1.2} label={{ value: 'High', position: 'insideTopRight', fontSize: 9, fill: '#f59e0b' }} />
            <Line type="monotone" dataKey="risk"     name="Composite Risk" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3, fill: '#ef4444' }} />
            <Line type="monotone" dataKey="sugar"    name="น้ำตาล"         stroke="#f59e0b" strokeWidth={1.5} dot={false} strokeDasharray="5 3" />
            <Line type="monotone" dataKey="co2"      name="CO₂/Gas"        stroke="#8b5cf6" strokeWidth={1.5} dot={false} strokeDasharray="5 3" />
            <Line type="monotone" dataKey="aluminum" name="อลูมิเนียม"     stroke="#0891b2" strokeWidth={1.5} dot={false} strokeDasharray="5 3" />
            <Line type="monotone" dataKey="pet"      name="PET Resin"      stroke="#22c55e" strokeWidth={1.5} dot={false} strokeDasharray="5 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Forecast Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
        {[
          { label: 'น้ำตาลทราย', peak: 91, month: 'มี.ค. 69', trend: 'up', color: '#f59e0b', desc: 'ภัยแล้งยาวนาน Q1' },
          { label: 'CO₂/Gas',    peak: 88, month: 'ก.พ. 69', trend: 'up', color: '#8b5cf6', desc: 'โรงผลิตซ่อม 3 สัปดาห์' },
          { label: 'อลูมิเนียม', peak: 85, month: 'มี.ค. 69', trend: 'up', color: '#0891b2', desc: 'ภาษีสหรัฐกดดัน' },
          { label: 'PET Resin',  peak: 72, month: 'มี.ค. 69', trend: 'up', color: '#22c55e', desc: 'จีนลดโควตา' },
        ].map(f => (
          <div key={f.label} className="cc" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>{f.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: f.color }}>{f.peak}</div>
            <div style={{ fontSize: 9, color: 'var(--t3)', marginBottom: 4 }}>Peak · {f.month}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 10, color: '#ef4444' }}>
              <TrendingUp size={11} /> <span>{f.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InventoryTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { label: 'วัสดุในภาวะวิกฤต (<21 วัน)', val: '3', color: '#ef4444', icon: '🔴' },
          { label: 'วัสดุเฝ้าระวัง (21–35 วัน)',  val: '2', color: '#f59e0b', icon: '🟡' },
          { label: 'วัสดุปกติ (>35 วัน)',          val: '3', color: '#22c55e', icon: '🟢' },
        ].map(s => (
          <div key={s.label} className="kpi-card" style={{ borderLeftColor: s.color }}>
            <div className="kpi-glow" style={{ background: s.color }} />
            <div style={{ fontSize: 10, color: 'var(--t2)', fontWeight: 600, marginBottom: 6 }}>{s.icon} {s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 10, color: 'var(--t3)' }}>รายการวัสดุ</div>
          </div>
        ))}
      </div>

      {/* Inventory Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 12 }}>
        {INVENTORY_MATERIALS.map(m => {
          const pct = Math.min(100, (m.days / m.safe) * 100);
          const barColor = m.level === 'Critical' ? '#ef4444' : m.level === 'High' ? '#f59e0b' : m.level === 'Medium' ? '#3b82f6' : '#22c55e';
          return (
            <div key={m.name} className="cc" style={{ border: `1.5px solid ${RISK_BORDER[m.level]}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>{m.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 2 }}>{m.region}</div>
                </div>
                <RiskBadge level={m.level} />
              </div>

              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ fontSize: 10, color: 'var(--t2)' }}>สต็อกคงเหลือ</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: barColor }}>{m.days} <span style={{ fontSize: 11, fontWeight: 500 }}>วัน</span></span>
                </div>
                <ProgressBar value={m.days} max={m.safe} color={barColor} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 9, color: 'var(--t3)' }}>
                  <span>0</span>
                  <span>เป้าหมาย {m.safe} วัน</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: 'var(--card2)', borderRadius: 7, padding: '6px 10px' }}>
                  <div style={{ fontSize: 9, color: 'var(--t3)', marginBottom: 2 }}>ราคาปัจจุบัน</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--t1)' }}>{m.price}</div>
                </div>
                <div style={{ background: 'var(--card2)', borderRadius: 7, padding: '6px 10px' }}>
                  <div style={{ fontSize: 9, color: 'var(--t3)', marginBottom: 2 }}>การเปลี่ยนแปลง</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: m.up ? '#ef4444' : '#22c55e' }}>{m.change}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Region Impact */}
      <div className="cc">
        <div className="cc-title">🌏 Impact by Region</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {[
            { region: 'ไทย (Thailand)', score: 82, materials: ['น้ำตาล','CO₂','น้ำสะอาด'], level: 'Critical' },
            { region: 'SEA (อาเซียน)',  score: 70, materials: ['อลูมิเนียม','ขวดแก้ว','CO₂'], level: 'High' },
            { region: 'Global',          score: 55, materials: ['PET Resin','ฉลาก','เคมีภัณฑ์'], level: 'Medium' },
          ].map(r => (
            <div key={r.region} style={{ padding: '12px 14px', borderRadius: 10, background: RISK_BG[r.level], border: `1px solid ${RISK_BORDER[r.level]}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>{r.region}</span>
                <RiskBadge level={r.level} />
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: RISK_COLOR[r.level], marginBottom: 4 }}>{r.score}</div>
              <div style={{ fontSize: 9, color: 'var(--t3)', marginBottom: 6 }}>Regional Risk Score</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {r.materials.map(m => (
                  <span key={m} style={{ fontSize: 9, background: 'rgba(0,0,0,0.06)', color: 'var(--t2)', borderRadius: 4, padding: '2px 6px' }}>{m}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OTIFTab() {
  const threshold = 80;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { label: 'Average OTIF Score', val: `${Math.round(OTIF_DATA.reduce((s,x)=>s+x.otif,0)/OTIF_DATA.length)}%`, color: '#f59e0b', sub: 'ต่ำกว่าเป้า 80%' },
          { label: 'Suppliers At Risk',  val: `${OTIF_DATA.filter(x=>x.otif<threshold).length}`,      color: '#ef4444', sub: 'คะแนน OTIF <80%' },
          { label: 'Suppliers Passing',  val: `${OTIF_DATA.filter(x=>x.otif>=threshold).length}`,     color: '#22c55e', sub: 'คะแนน OTIF ≥80%' },
        ].map(s => (
          <div key={s.label} className="kpi-card" style={{ borderLeftColor: s.color }}>
            <div className="kpi-glow" style={{ background: s.color }} />
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--t2)', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 10, color: 'var(--t3)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 14 }}>
        {/* OTIF Bar Chart */}
        <div className="cc">
          <div className="cc-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Truck size={13} color="var(--cyan)" />
            OTIF Score per Supplier · On Time In Full (%)
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={OTIF_DATA} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 120 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--t3)' }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="supplier" tick={{ fontSize: 10, fill: 'var(--t2)' }} tickLine={false} axisLine={false} width={115} />
              <Tooltip {...TOOLTIP_STYLE} formatter={v => [`${v}%`, 'OTIF Score']} />
              <ReferenceLine x={threshold} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth={1.5} label={{ value: `Target ${threshold}%`, position: 'top', fontSize: 9, fill: '#f59e0b' }} />
              <Bar dataKey="otif" radius={4} maxBarSize={16}
                shape={(props) => {
                  const { x, y, width, height, value } = props;
                  const color = value < 60 ? '#ef4444' : value < 80 ? '#f59e0b' : '#22c55e';
                  return <rect x={x} y={y} width={width} height={height} fill={color} rx={4} />;
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* At-Risk List */}
        <div className="cc">
          <div className="cc-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldAlert size={13} color="#ef4444" />
            ซัพพลายเออร์เสี่ยง OTIF &lt;80%
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {OTIF_DATA.filter(x => x.otif < threshold).sort((a,b) => a.otif - b.otif).map(s => (
              <div key={s.supplier} style={{
                padding: '9px 12px', borderRadius: 9,
                background: RISK_BG[s.risk], border: `1px solid ${RISK_BORDER[s.risk]}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t1)' }}>{s.supplier}</span>
                  <RiskBadge level={s.risk} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, fontSize: 10 }}>
                  {[['OTIF',`${s.otif}%`,RISK_COLOR[s.risk]],['On-Time',`${s.onTime}%`,'var(--t2)'],['In-Full',`${s.inFull}%`,'var(--t2)']].map(([l,v,c]) => (
                    <div key={l} style={{ textAlign: 'center', background: 'rgba(0,0,0,0.04)', borderRadius: 5, padding: '3px 0' }}>
                      <div style={{ fontSize: 8.5, color: 'var(--t3)' }}>{l}</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: c }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Threshold note */}
          <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(245,158,11,0.08)', borderRadius: 8, border: '1px solid rgba(245,158,11,0.2)', fontSize: 10, color: '#b45309' }}>
            ⚠️ เป้าหมาย OTIF: <strong>≥80%</strong> · ซัพพลายเออร์ต่ำกว่าเกณฑ์ต้องส่งแผนปรับปรุง
          </div>
        </div>
      </div>
    </div>
  );
}

function SupplierTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 14 }}>
        {/* Radar */}
        <div className="cc">
          <div className="cc-title">🕸 Supplier Performance Radar</div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={SUPPLIER_RADAR}>
              <PolarGrid stroke="rgba(0,0,0,0.07)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: 'var(--t2)' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 8, fill: 'var(--t3)' }} tickCount={4} />
              <Radar name="Mitr Phol" dataKey="Mitr Phol"   stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.12} strokeWidth={2} />
              <Radar name="Air Liquide" dataKey="Air Liquide" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.12} strokeWidth={2} />
              <Radar name="Ball Pack." dataKey="Ball Pack."  stroke="#0891b2" fill="#0891b2" fillOpacity={0.12} strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Tooltip {...TOOLTIP_STYLE} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Score Bar */}
        <div className="cc">
          <div className="cc-title">📊 Performance Score by Supplier</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={SUPPLIER_PERF} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 120 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--t3)' }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="supplier" tick={{ fontSize: 10, fill: 'var(--t2)' }} tickLine={false} axisLine={false} width={115} />
              <Tooltip {...TOOLTIP_STYLE} formatter={v => [v, 'Performance Score']} />
              <ReferenceLine x={75} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth={1} />
              <Bar dataKey="score" radius={4} maxBarSize={14}
                shape={(props) => {
                  const { x, y, width, height, value } = props;
                  const color = value < 60 ? '#ef4444' : value < 75 ? '#f59e0b' : value < 85 ? '#3b82f6' : '#22c55e';
                  return <rect x={x} y={y} width={width} height={height} fill={color} rx={4} />;
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Supplier Table */}
      <div className="cc">
        <div className="cc-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Package size={14} color="var(--cyan)" />
          Supplier Performance Table
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid rgba(0,0,0,0.08)' }}>
                {['ซัพพลายเออร์', 'หมวดหมู่', 'Score', 'สถานะ', 'การดำเนินการ'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--t3)', letterSpacing: '.5px', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SUPPLIER_PERF.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--t1)' }}>{s.supplier}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--t2)' }}>{s.category}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'rgba(0,0,0,0.07)', overflow: 'hidden', maxWidth: 60 }}>
                        <div style={{ height: '100%', width: `${s.score}%`, background: s.score < 60 ? '#ef4444' : s.score < 75 ? '#f59e0b' : s.score < 85 ? '#3b82f6' : '#22c55e', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: s.score < 60 ? '#ef4444' : s.score < 75 ? '#f59e0b' : 'var(--t1)' }}>{s.score}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <RiskBadge level={s.status} />
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--t2)', fontSize: 11 }}>{s.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CategoryTab({ liveData }) {
  // Map liveData to override price/change for specific materials
  const liveOverride = {
    'น้ำตาลทราย': liveData?.materials?.sugar ? {
      price:       `${liveData.materials.sugar.price} ¢/lb`,
      priceChange: `${liveData.materials.sugar.change_pct > 0 ? '+' : ''}${liveData.materials.sugar.change_pct}% (3M)`,
      risk:        liveData.materials.sugar.risk_level,
    } : null,
    'อลูมิเนียมกระป๋อง': liveData?.materials?.aluminum ? {
      price:       `$${liveData.materials.aluminum.price}/ตัน`,
      priceChange: `${liveData.materials.aluminum.change_pct > 0 ? '+' : ''}${liveData.materials.aluminum.change_pct}% (3M)`,
      risk:        liveData.materials.aluminum.risk_level,
    } : null,
    'PET Resin': liveData?.materials?.crude_oil ? {
      priceChange: `Oil ${liveData.materials.crude_oil.change_pct > 0 ? '+' : ''}${liveData.materials.crude_oil.change_pct}% (3M proxy)`,
      risk:        liveData.materials.crude_oil.risk_level,
    } : null,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14 }}>
        {CATEGORY_CARDS.map(c => {
          const ov = liveOverride[c.material];
          const displayPrice  = ov?.price       ?? c.price;
          const displayChange = ov?.priceChange  ?? c.priceChange;
          const displayRisk   = ov?.risk         ?? c.risk;
          return (
          <div key={c.material} className="cc" style={{ border: `1.5px solid ${RISK_BORDER[displayRisk]}`, position: 'relative', overflow: 'hidden' }}>
            {/* Top accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: RISK_COLOR[displayRisk], borderRadius: '14px 14px 0 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, paddingTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ fontSize: 24 }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    {c.material}
                    {ov && <span style={{ fontSize: 8, fontWeight: 700, background: '#22c55e15', color: '#22c55e', border: '1px solid #22c55e40', borderRadius: 3, padding: '1px 4px' }}>🟢 Live</span>}
                  </div>
                  <div style={{ fontSize: 9.5, color: 'var(--t3)', marginTop: 1 }}>{c.days} วันของสต็อกคงเหลือ</div>
                </div>
              </div>
              <RiskBadge level={displayRisk} size="md" />
            </div>

            {/* Price + status row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
              <div style={{ background: 'var(--card2)', borderRadius: 8, padding: '8px 12px' }}>
                <div style={{ fontSize: 9, color: 'var(--t3)', marginBottom: 3 }}>ราคาปัจจุบัน</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)' }}>{displayPrice}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#ef4444', marginTop: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <TrendingUp size={10} />{displayChange}
                </div>
              </div>
              <div style={{ background: 'var(--card2)', borderRadius: 8, padding: '8px 12px' }}>
                <div style={{ fontSize: 9, color: 'var(--t3)', marginBottom: 3 }}>สถานะอุปทาน</div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: RISK_COLOR[displayRisk] }}>{c.status}</div>
                <div style={{ marginTop: 5 }}>
                  <ProgressBar value={c.days} max={60} color={RISK_COLOR[displayRisk]} />
                </div>
              </div>
            </div>

            {/* Trend mini sparkline */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 9.5, color: 'var(--t3)' }}>Risk Trend (6 เดือน)</span>
              <MiniSparkline data={c.trend} color={RISK_COLOR[c.risk]} />
            </div>

            {/* Suppliers */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 9.5, color: 'var(--t3)', marginBottom: 4 }}>🏭 Suppliers หลัก</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {c.suppliers.split(', ').map(sup => (
                  <span key={sup} style={{ fontSize: 9.5, background: 'rgba(0,0,0,0.05)', color: 'var(--t2)', borderRadius: 5, padding: '2px 7px', border: '1px solid rgba(0,0,0,0.07)' }}>
                    {sup}
                  </span>
                ))}
              </div>
            </div>

            {/* Action */}
            <div style={{ background: RISK_BG[displayRisk], borderRadius: 8, padding: '9px 12px', border: `1px solid ${RISK_BORDER[displayRisk]}` }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: RISK_COLOR[displayRisk], marginBottom: 4 }}>
                💡 การดำเนินการที่แนะนำ
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--t1)', lineHeight: 1.5 }}>{c.action}</div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tabs config ──────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',  label: 'Overview',        labelTH: 'ภาพรวม',          Icon: BarChart2,     Component: OverviewTabFixed },
  { id: 'events',    label: 'Global Events',   labelTH: 'เหตุการณ์โลก',    Icon: Globe,         Component: EventsTab        },
  { id: 'forecast',  label: 'Forecast',        labelTH: 'คาดการณ์',        Icon: TrendingUp,    Component: ForecastTab      },
  { id: 'inventory', label: 'Inventory',       labelTH: 'สินค้าคงคลัง',    Icon: Package,       Component: InventoryTab     },
  { id: 'otif',      label: 'OTIF Risk',       labelTH: 'ความเสี่ยง OTIF', Icon: Truck,         Component: OTIFTab          },
  { id: 'supplier',  label: 'Supplier Perf.',  labelTH: 'ซัพพลายเออร์',   Icon: Factory,       Component: SupplierTab      },
  { id: 'category',  label: 'By Category',     labelTH: 'แยกตามวัสดุ',     Icon: Droplets,      Component: CategoryTab      },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BeverageShock() {
  const [activeTab, setActiveTab] = useState('overview');
  const [liveData, setLiveData]   = useState(null);
  const ActiveComponent = TABS.find(t => t.id === activeTab)?.Component || OverviewTabFixed;

  useEffect(() => {
    fetch('/data/commodity_prices.json?t=' + Date.now())
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setLiveData(d); })
      .catch(() => {});
  }, []);

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Page Header */}
      <div style={{ padding: '0 0 12px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>🧃</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)' }}>
                Beverage Supply Shock Dashboard
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--t3)' }}>
                ติดตามภาวะ Supply Shock อุตสาหกรรมเครื่องดื่มไทย · อัปเดต เม.ย. 2569
              </div>
            </div>
          </div>
          {/* Overall risk badge */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            {(() => {
              const risk  = liveData?.overall_risk ?? 'Critical';
              const score = liveData?.composite_score ?? 72;
              const col   = RISK_COLOR[risk] ?? '#ef4444';
              return (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px',
                  background: col + '1a', border: `1px solid ${col}4d`,
                  borderRadius: 8, fontSize: 11, fontWeight: 700, color: col,
                }}>
                  <AlertTriangle size={13} />
                  Overall: {risk.toUpperCase()} · Score {score}/100
                  {liveData && <span style={{ fontSize: 9, background: '#22c55e15', color: '#22c55e', border: '1px solid #22c55e40', borderRadius: 3, padding: '1px 4px', marginLeft: 2 }}>🟢 Live</span>}
                </div>
              );
            })()}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
              background: 'rgba(8,145,178,0.08)', border: '1px solid rgba(8,145,178,0.2)',
              borderRadius: 8, fontSize: 10, color: 'var(--cyan)', fontWeight: 600,
            }}>
              <Activity size={11} />
              Live Monitor
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex', gap: 2, borderBottom: '1.5px solid rgba(0,0,0,0.07)',
        marginBottom: 14, flexShrink: 0, flexWrap: 'wrap',
      }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '7px 13px', border: 'none', cursor: 'pointer',
                fontSize: 11, fontWeight: active ? 700 : 500,
                color: active ? 'var(--cyan)' : 'var(--t2)',
                background: 'transparent',
                borderBottom: active ? '2px solid var(--cyan)' : '2px solid transparent',
                marginBottom: -1.5, transition: 'all 0.15s ease',
                borderRadius: '6px 6px 0 0',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--t1)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--t2)'; }}
            >
              <tab.Icon size={12} />
              <span>{tab.label}</span>
              <span style={{ fontSize: 9.5, color: active ? 'var(--cyan)' : 'var(--t3)' }}>{tab.labelTH}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="content-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <ActiveComponent liveData={liveData} />
      </div>
    </div>
  );
}
