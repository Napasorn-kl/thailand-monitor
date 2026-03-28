import React, { useRef, useEffect, useState } from 'react';
import { GRAPH_NODES_DATA, GRAPH_EDGES, SECTORS, GOLD_EXPOSURE } from '../data/staticData';

const GP_SECTOR_DATA = {
  Tourism:       { reg:28500,  cap:'฿892B',  avg:'฿31.3M', gv:'+12.4%', share:'5.2%',  col:'#22d3ee', provs:[{n:'ภูเก็ต',v:3800},{n:'กรุงเทพมหานคร',v:3200},{n:'เชียงใหม่',v:2800},{n:'สุราษฎร์ธานี',v:2100},{n:'ชลบุรี',v:1900}] },
  Retail:        { reg:125400, cap:'฿962B',  avg:'฿7.7M',  gv:'+5.1%',  share:'22.9%', col:'#3b82f6', provs:[{n:'กรุงเทพมหานคร',v:28400},{n:'นนทบุรี',v:8200},{n:'เชียงใหม่',v:6800},{n:'ชลบุรี',v:6400},{n:'ขอนแก่น',v:4900}] },
  Hospitality:   { reg:24200,  cap:'฿1.1T',  avg:'฿45.5M', gv:'+8.2%',  share:'4.4%',  col:'#f97316', provs:[{n:'กรุงเทพมหานคร',v:6200},{n:'ภูเก็ต',v:4100},{n:'เชียงใหม่',v:3200},{n:'สุราษฎร์ธานี',v:2400},{n:'ชลบุรี',v:2100}] },
  Manufacturing: { reg:45200,  cap:'฿1.8T',  avg:'฿39.8M', gv:'+3.2%',  share:'8.2%',  col:'#8b5cf6', provs:[{n:'ชลบุรี',v:9800},{n:'ระยอง',v:7600},{n:'พระนครศรีอยุธยา',v:5200},{n:'สมุทรปราการ',v:4800},{n:'สมุทรสาคร',v:3900}] },
  Construction:  { reg:35600,  cap:'฿720B',  avg:'฿20.2M', gv:'+8.7%',  share:'6.5%',  col:'#22c55e', provs:[{n:'กรุงเทพมหานคร',v:8400},{n:'ชลบุรี',v:4200},{n:'นนทบุรี',v:3100},{n:'เชียงใหม่',v:2600},{n:'ระยอง',v:2200}] },
  Wholesale:     { reg:45800,  cap:'฿780B',  avg:'฿17.0M', gv:'+3.8%',  share:'8.3%',  col:'#f59e0b', provs:[{n:'กรุงเทพมหานคร',v:14200},{n:'สมุทรปราการ',v:4800},{n:'ชลบุรี',v:3900},{n:'เชียงใหม่',v:3200},{n:'ระยอง',v:2600}] },
  'Real Estate': { reg:18900,  cap:'฿1.2T',  avg:'฿63.5M', gv:'-1.2%',  share:'3.4%',  col:'#ec4899', provs:[{n:'กรุงเทพมหานคร',v:6200},{n:'นนทบุรี',v:2100},{n:'ปทุมธานี',v:1800},{n:'ภูเก็ต',v:1500},{n:'ชลบุรี',v:1400}] },
  Finance:       { reg:15200,  cap:'฿2.4T',  avg:'฿157.9M',gv:'+4.8%',  share:'2.8%',  col:'#0ea5e9', provs:[{n:'กรุงเทพมหานคร',v:12800},{n:'นนทบุรี',v:980},{n:'เชียงใหม่',v:620},{n:'ชลบุรี',v:480},{n:'ขอนแก่น',v:320}] },
};

const GP_PROV_DATA = {
  Bangkok:    { th:'กรุงเทพมหานคร', reg:4820, cap:'฿4.2T', dens:8200, pop:'10.8M', secs:[{n:'Tourism',v:89,col:'#22d3ee'},{n:'Retail',v:72,col:'#3b82f6'},{n:'Hospitality',v:61,col:'#f97316'},{n:'Finance',v:55,col:'#3b82f6'},{n:'Construction',v:48,col:'#22c55e'}] },
  'Chiang Mai':{ th:'เชียงใหม่', reg:1420, cap:'฿38B', dens:2800, pop:'1.8M', secs:[{n:'Tourism',v:65,col:'#22d3ee'},{n:'Retail',v:43,col:'#3b82f6'},{n:'Hospitality',v:38,col:'#f97316'},{n:'Construction',v:30,col:'#22c55e'},{n:'Healthcare',v:22,col:'#ef4444'}] },
  Phuket:     { th:'ภูเก็ต', reg:986, cap:'฿52B', dens:3100, pop:'0.4M', secs:[{n:'Tourism',v:80,col:'#22d3ee'},{n:'Hospitality',v:72,col:'#f97316'},{n:'Real Estate',v:45,col:'#ec4899'},{n:'Retail',v:38,col:'#3b82f6'},{n:'Construction',v:28,col:'#22c55e'}] },
  Chonburi:   { th:'ชลบุรี', reg:1280, cap:'฿68B', dens:2400, pop:'1.5M', secs:[{n:'Manufacturing',v:75,col:'#8b5cf6'},{n:'Construction',v:60,col:'#22c55e'},{n:'Tourism',v:45,col:'#22d3ee'},{n:'Wholesale',v:38,col:'#f59e0b'},{n:'Retail',v:32,col:'#3b82f6'}] },
};

function SectorDetail({ node, brent, goldBar }) {
  const d = GP_SECTOR_DATA[node.id] || { reg: 'N/A', cap: 'N/A', avg: 'N/A', gv: 'N/A', share: 'N/A', col: node.col, provs: [] };
  const sec = SECTORS.find(s => s.name === node.id);
  const ge = GOLD_EXPOSURE[node.id];
  const oilSens = sec?.oilSens || 'L';
  const oilBadgeMap = {
    H: { text: '▲ High Impact', bg: 'rgba(239,68,68,.1)', color: '#ef4444', border: 'rgba(239,68,68,.2)' },
    M: { text: '— Medium Impact', bg: 'rgba(245,158,11,.1)', color: '#f59e0b', border: 'rgba(245,158,11,.2)' },
    L: { text: 'Low Impact', bg: 'rgba(148,163,184,.1)', color: '#94a3b8', border: 'rgba(148,163,184,.2)' },
    '+': { text: '★ Benefits', bg: 'rgba(5,150,105,.1)', color: '#059669', border: 'rgba(5,150,105,.2)' },
  };
  const ob = oilBadgeMap[oilSens] || oilBadgeMap.L;
  const brentF = parseFloat(brent) || 74.2;
  const impactPct = sec ? +((brentF - 70) / 10 * { H: 1.2, M: 0.5, L: 0.08, '+': -1.5 }[oilSens]).toFixed(2) : 0;

  return (
    <div>
      <div style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 6, fontSize: 9.5, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: 10, background: d.col + '22', color: d.col, border: '1px solid ' + d.col + '44' }}>SECTOR</div>
      <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--t1)', lineHeight: 1.25, marginBottom: 14, borderBottom: '1px solid rgba(0,0,0,.07)', paddingBottom: 12 }}>{node.id}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        {[['Registrations', d.reg?.toLocaleString?.() || d.reg], ['Capital', d.cap], ['Avg Capital', d.avg], ['YoY Growth', d.gv]].map(([l, v]) => (
          <div key={l} style={{ background: 'var(--bg)', borderRadius: 8, padding: '10px 12px', border: '1px solid rgba(0,0,0,.06)' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 5 }}>{l}</div>
            <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1 }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.7px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 10, marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
        Oil Sensitivity
        <span style={{ flex: 1, height: 1, background: 'rgba(0,0,0,.07)' }} />
      </div>
      <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: ob.bg, color: ob.color, border: '1px solid ' + ob.border }}>{ob.text}</span>
        <span style={{ fontSize: 11.5, color: impactPct < 0 ? '#22c55e' : Math.abs(impactPct) < 0.2 ? '#94a3b8' : '#ef4444', fontWeight: 600 }}>
          Brent ${brentF} → {impactPct >= 0 ? '+' : ''}{impactPct}% impact
        </span>
      </div>

      {ge && (
        <>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.7px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            Gold Exposure <span style={{ flex: 1, height: 1, background: 'rgba(0,0,0,.07)' }} />
          </div>
          <div style={{ background: 'rgba(183,121,31,.06)', border: '1px solid rgba(183,121,31,.15)', borderRadius: 8, padding: '10px 12px', marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--t2)' }}>{ge.th}</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#b7791f' }}>{ge.score}<span style={{ fontSize: 11, color: 'var(--t3)' }}>/100</span></span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--t3)' }}>{ge.note}</div>
          </div>
        </>
      )}

      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.7px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        Top Provinces <span style={{ flex: 1, height: 1, background: 'rgba(0,0,0,.07)' }} />
      </div>
      {d.provs.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
          <span style={{ fontSize: 11.5, color: 'var(--t2)', width: 100, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.n}</span>
          <div style={{ flex: 1, height: 5, background: 'rgba(0,0,0,.07)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: (p.v / d.provs[0].v * 100) + '%', height: '100%', background: d.col, borderRadius: 3 }} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--t3)', width: 36, textAlign: 'right' }}>{p.v.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

function ProvDetail({ node }) {
  const d = GP_PROV_DATA[node.id] || { th: node.id, reg: 'N/A', cap: 'N/A', dens: 'N/A', pop: 'N/A', secs: [] };
  return (
    <div>
      <div style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 6, fontSize: 9.5, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: 10, background: '#22c55e22', color: '#22c55e', border: '1px solid #22c55e44' }}>PROVINCE</div>
      <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--t1)', lineHeight: 1.25, marginBottom: 4 }}>{node.id}</div>
      <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 14, borderBottom: '1px solid rgba(0,0,0,.07)', paddingBottom: 12 }}>{d.th}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        {[['Registrations', d.reg?.toLocaleString?.() || d.reg], ['Capital', d.cap], ['Biz Density', d.dens + '/100k'], ['Population', d.pop]].map(([l, v]) => (
          <div key={l} style={{ background: 'var(--bg)', borderRadius: 8, padding: '10px 12px', border: '1px solid rgba(0,0,0,.06)' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 5 }}>{l}</div>
            <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.7px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 10 }}>Key Sectors</div>
      {d.secs.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', flexShrink: 0, background: s.col }} />
          <span style={{ flex: 1, fontSize: 12, color: 'var(--t1)' }}>{s.n}</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--t3)', background: 'var(--bg)', padding: '1px 7px', borderRadius: 10, border: '1px solid rgba(0,0,0,.06)' }}>{s.v}</span>
        </div>
      ))}
    </div>
  );
}

export default function Graph({ data }) {
  const canvasRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [overlay, setOverlay] = useState('normal');
  const posRef = useRef(null);
  const animRef = useRef(null);
  const { brent, goldBar } = data;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    const nodes = GRAPH_NODES_DATA.map(n => ({
      ...n,
      px: n.x * canvas.width,
      py: n.y * canvas.height,
      vx: 0, vy: 0,
    }));
    posRef.current = nodes;

    let dragging = null;
    let hovNode = null;

    function getOverlayColor(node) {
      if (overlay === 'oil') {
        const sec = SECTORS.find(s => s.name === node.id);
        if (!sec) return node.col;
        const map = { H: '#ef4444', M: '#f59e0b', L: '#22c55e', '+': '#6366f1' };
        return map[sec.oilSens] || node.col;
      }
      if (overlay === 'gold') {
        const ge = GOLD_EXPOSURE[node.id];
        if (!ge) return node.col;
        const score = ge.score;
        if (score >= 70) return '#b7791f';
        if (score >= 40) return '#d97706';
        return '#94a3b8';
      }
      return node.col;
    }

    function draw() {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw edges
      GRAPH_EDGES.forEach(([a, b]) => {
        const na = nodes[a], nb = nodes[b];
        if (!na || !nb) return;
        ctx.beginPath();
        ctx.moveTo(na.px, na.py);
        ctx.lineTo(nb.px, nb.py);
        ctx.strokeStyle = 'rgba(148,163,184,0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach(n => {
        const col = getOverlayColor(n);
        const isHov = hovNode === n;
        const isSel = selected?.id === n.id;
        const r = n.size / 2;

        ctx.beginPath();
        ctx.arc(n.px, n.py, r + (isHov || isSel ? 3 : 0), 0, Math.PI * 2);
        ctx.fillStyle = col + (isSel ? 'ff' : '33');
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.px, n.py, r, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();

        if (isSel) {
          ctx.beginPath();
          ctx.arc(n.px, n.py, r + 5, 0, Math.PI * 2);
          ctx.strokeStyle = col;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        const shape = n.type === 'province' ? '⬡' : n.type === 'size' ? '◆' : '';
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.max(8, r * 0.55)}px Inter`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const label = n.id.length > 8 ? n.id.slice(0, 7) + '…' : n.id;
        ctx.fillText(label, n.px, n.py);
      });
    }

    function nodeAt(x, y) {
      return nodes.find(n => Math.hypot(n.px - x, n.py - y) < n.size / 2 + 4);
    }

    canvas.onmousedown = e => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      dragging = nodeAt(x, y);
      if (dragging) { setSelected(dragging); draw(); }
    };
    canvas.onmousemove = e => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      hovNode = nodeAt(x, y);
      canvas.style.cursor = hovNode ? 'pointer' : 'default';
      if (dragging) { dragging.px = x; dragging.py = y; }
      draw();
    };
    canvas.onmouseup = () => { dragging = null; };
    canvas.onmouseleave = () => { hovNode = null; dragging = null; draw(); };

    draw();

    const ro = new ResizeObserver(() => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      draw();
    });
    ro.observe(container);

    return () => { ro.disconnect(); canvas.onmousedown = canvas.onmousemove = canvas.onmouseup = canvas.onmouseleave = null; };
  }, [overlay, selected]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 270px', gap: 14, height: 'calc(100dvh - 100px)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, gap: 8 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <canvas ref={canvasRef} style={{ borderRadius: 10, border: '1px solid rgba(0,0,0,.07)', display: 'block', width: '100%', height: '100%', boxShadow: '0 1px 3px rgba(0,0,0,.05)' }} />
        </div>
        <div style={{ display: 'flex', gap: 20, padding: '0 4px', alignItems: 'center', flexShrink: 0 }}>
          {[{ col: 'var(--cyan)', shape: 'circle', label: 'Sector' }, { col: 'var(--green)', shape: 'square', label: 'Province' }].map(({ col, shape, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--t2)' }}>
              <div style={{ width: 12, height: 12, borderRadius: shape === 'circle' ? '50%' : 3, background: col }} />
              {label}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
            {[['normal','Normal'],['oil','Oil Risk'],['gold','Gold']].map(([k, l]) => (
              <button key={k} onClick={() => setOverlay(k)}
                style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid', fontSize: 11, fontWeight: overlay === k ? 700 : 500, cursor: 'pointer', transition: 'all .15s', fontFamily: 'Inter,sans-serif',
                  background: overlay === k ? (k === 'oil' ? '#ef4444' : k === 'gold' ? '#d97706' : 'var(--cyan)') : 'var(--card)',
                  color: overlay === k ? '#fff' : 'var(--t2)',
                  borderColor: overlay === k ? (k === 'oil' ? '#ef4444' : k === 'gold' ? '#d97706' : 'var(--cyan)') : 'rgba(0,0,0,.1)',
                }}>{l}</button>
            ))}
          </div>
          <span style={{ fontSize: 11, color: 'var(--t3)', marginLeft: 6 }}>คลิก node · ลาก</span>
        </div>
      </div>

      {/* Detail panel */}
      <div style={{ background: 'var(--card)', border: '1px solid rgba(0,0,0,.07)', borderRadius: 14, overflowY: 'auto', padding: 20, boxShadow: '0 1px 2px rgba(0,0,0,.04),0 4px 12px rgba(0,0,0,.04)' }}>
        {!selected ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--t3)', textAlign: 'center' }}>
            <div style={{ marginBottom: 12, opacity: 0.2, fontSize: 32 }}>⬡</div>
            <div style={{ fontSize: 12, lineHeight: 1.7 }}>คลิก node บน graph<br />เพื่อดูรายละเอียด</div>
          </div>
        ) : selected.type === 'sector' ? (
          <SectorDetail node={selected} brent={brent} goldBar={goldBar} />
        ) : (
          <ProvDetail node={selected} />
        )}
      </div>
    </div>
  );
}
