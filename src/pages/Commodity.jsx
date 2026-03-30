import React, { useState } from 'react';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { useCommodity, COMMODITY_DEFS } from '../hooks/useCommodity';

const CATS = [
  { id: 'energy',    label: '⚡ พลังงาน'  },
  { id: 'metals',    label: '🪙 โลหะ & ทองคำ' },
  { id: 'agri',      label: '🌾 เกษตร'    },
  { id: 'livestock', label: '🐄 ปศุสัตว์' },
];

function fmt(val, dec = 2) {
  if (val == null) return '—';
  return Number(val).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

// Convert commodity price to THB string
function toThb(price, unit, usdthb) {
  if (price == null || !usdthb) return null;
  const fx  = parseFloat(usdthb);
  const usd = unit.startsWith('USc') ? price / 100 : price; // USc → USD
  const thb = usd * fx;
  if (thb >= 1_000_000) return '฿' + (thb / 1_000_000).toFixed(2) + 'M/' + unit.split('/')[1];
  if (thb >= 1_000)     return '฿' + Math.round(thb).toLocaleString('th-TH') + '/' + unit.split('/')[1];
  return '฿' + thb.toFixed(2) + '/' + unit.split('/')[1];
}

function ChangeChip({ change, pct }) {
  if (change == null) return <span style={{ fontSize: 10, color: 'var(--t3)' }}>—</span>;
  const up = change >= 0;
  const color = up ? '#16a34a' : '#dc2626';
  const bg    = up ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)';
  const sign  = up ? '+' : '';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: bg, color, borderRadius: 6, padding: '2px 7px', fontSize: 10.5, fontWeight: 700 }}>
      {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {sign}{fmt(change)} ({sign}{fmt(pct)}%)
    </span>
  );
}

function CommodityCard({ def, q, usdthb }) {
  const { price, change, changePct } = q || {};
  const thbStr = toThb(price, def.unit, usdthb);
  const up = change != null && change >= 0;
  const borderColor = change == null
    ? 'rgba(0,0,0,0.08)'
    : up ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.2)';

  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${borderColor}`,
      borderRadius: 12,
      padding: '11px 13px',
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 20, lineHeight: 1 }}>{def.emoji}</span>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t1)', lineHeight: 1.3 }}>{def.labelTH}</div>
            <div style={{ fontSize: 10, color: 'var(--t3)', lineHeight: 1.3 }}>{def.labelEN}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', lineHeight: 1.2 }}>
            {price != null ? fmt(price) : '—'}
          </div>
          <div style={{ fontSize: 9.5, color: 'var(--t3)' }}>{def.unit}</div>
          {thbStr && (
            <div style={{ fontSize: 10.5, fontWeight: 600, color: '#b45309', marginTop: 1 }}>{thbStr}</div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ChangeChip change={change} pct={changePct} />
      </div>
    </div>
  );
}

function ThaiOilSection({ retail }) {
  if (!retail) return null;
  const rows = [
    { label: 'แก๊สโซฮอล 95', val: retail.d95      },
    { label: 'แก๊สโซฮอล 91', val: retail.d91      },
    { label: 'E20',           val: retail.de20     },
    { label: 'E85',           val: retail.de85     },
    { label: 'ดีเซล B7',     val: retail.dDiesel  },
    { label: 'ดีเซล B10',    val: retail.dDieselB10 },
  ].filter(r => r.val != null);

  return (
    <div style={{ background: 'rgba(8,145,178,0.04)', border: '1px solid rgba(8,145,178,0.15)', borderRadius: 12, padding: 14, marginTop: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--cyan)', marginBottom: 10 }}>⛽ ราคาน้ำมันไทย ณ วันนี้</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 7 }}>
        {rows.map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderRadius: 8, padding: '7px 10px' }}>
            <span style={{ fontSize: 11.5, color: 'var(--t2)' }}>{r.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>฿{r.val}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 8, textAlign: 'right' }}>{retail.src}</div>
    </div>
  );
}

function ThaiGoldSection({ goldBar, goldOrn, goldDate, usdthb }) {
  if (!goldBar) return null;
  const xau = goldBar.sell && usdthb ? (goldBar.sell / (parseFloat(usdthb) * 15.244)).toFixed(2) : null;
  const rows = [
    { label: 'ทองแท่ง รับซื้อ',    val: goldBar?.buy?.toLocaleString('th-TH')  },
    { label: 'ทองแท่ง ขายออก',     val: goldBar?.sell?.toLocaleString('th-TH') },
    { label: 'ทองรูปพรรณ รับซื้อ', val: goldOrn?.buy?.toLocaleString('th-TH')  },
    { label: 'ทองรูปพรรณ ขายออก',  val: goldOrn?.sell?.toLocaleString('th-TH') },
    ...(xau ? [{ label: 'XAU/USD (คำนวณ)', val: '$' + xau }] : []),
  ].filter(r => r.val);

  return (
    <div style={{ background: 'rgba(183,121,31,0.05)', border: '1px solid rgba(183,121,31,0.2)', borderRadius: 12, padding: 14, marginTop: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#b7791f', marginBottom: 10 }}>🥇 ราคาทองคำไทย (สมาคมค้าทองคำ)</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 7 }}>
        {rows.map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderRadius: 8, padding: '7px 10px' }}>
            <span style={{ fontSize: 11.5, color: 'var(--t2)' }}>{r.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>฿{r.val}</span>
          </div>
        ))}
      </div>
      {goldDate && <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 8, textAlign: 'right' }}>อัปเดต: {goldDate}</div>}
    </div>
  );
}

export default function Commodity({ data }) {
  const { quotes, loading, lastUpdate, refresh } = useCommodity();
  const [cat, setCat] = useState('energy');

  const visible  = COMMODITY_DEFS.filter(d => d.cat === cat);
  const retail   = data?.calcThaiRetail?.();
  const usdthb   = data?.usdthb;
  const timeStr = lastUpdate
    ? lastUpdate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>สินค้าโภคภัณฑ์</div>
          <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
            Commodity Prices · Yahoo Finance{timeStr ? ` · ${timeStr}` : ''}
          </div>
        </div>
        <button
          onClick={() => refresh(true)}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 12px', borderRadius: 8,
            border: '1px solid rgba(0,0,0,0.12)', background: '#fff',
            color: 'var(--t2)', fontSize: 12,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          <RefreshCw size={12} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          รีเฟรช
        </button>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {CATS.map(c => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 11.5, cursor: 'pointer',
              border:      cat === c.id ? '1px solid var(--cyan)' : '1px solid rgba(0,0,0,0.1)',
              background:  cat === c.id ? 'rgba(8,145,178,0.08)' : '#fff',
              color:       cat === c.id ? 'var(--cyan)' : 'var(--t3)',
              fontWeight:  cat === c.id ? 700 : 500,
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Commodity Cards */}
      {loading && Object.keys(quotes).length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--t3)', fontSize: 12 }}>
          กำลังโหลดราคา...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {visible.map(def => (
            <CommodityCard key={def.id} def={def} q={quotes[def.sym]} usdthb={usdthb} />
          ))}
        </div>
      )}

      {/* Thai-specific price sections */}
      {cat === 'energy' && <ThaiOilSection retail={retail} />}
      {cat === 'metals' && (
        <ThaiGoldSection
          goldBar={data?.goldBar}
          goldOrn={data?.goldOrn}
          goldDate={data?.goldDate}
          usdthb={data?.usdthb}
        />
      )}
    </div>
  );
}
