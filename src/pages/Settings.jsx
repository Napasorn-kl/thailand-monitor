import React, { useState } from 'react';
import {
  RefreshCw, CheckCircle, XCircle, Clock, Loader,
  ArrowLeftRight, TrendingUp, Activity, Ship, Briefcase,
  Plane, Droplets, Fuel, Coins, Circle,
} from 'lucide-react';

const ICON_MAP = {
  'arrow-left-right': ArrowLeftRight,
  'trending-up':      TrendingUp,
  'activity':         Activity,
  'ship':             Ship,
  'briefcase':        Briefcase,
  'plane':            Plane,
  'droplets':         Droplets,
  'fuel':             Fuel,
  'coins':            Coins,
};

export default function Settings({ data }) {
  const { apiStatus, apiConnected, totalApis, fetching, fetchAll, setEiaKey, lastRefresh } = data;
  const [eiaKey, setEiaKeyLocal] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSaveKey = () => {
    setEiaKey(eiaKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRefresh = () => fetchAll();

  const statusList = Object.values(apiStatus);
  const okCount    = statusList.filter(s => s.status === 'ok').length;
  const errCount   = statusList.filter(s => s.status === 'err').length;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Settings · API Configuration</div>
        <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>ตั้งค่า API keys และดูสถานะการเชื่อมต่อ</div>
      </div>

      {/* API Status summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 14 }}>
        {[
          { label: 'Connected',    val: okCount,   col: 'var(--green)' },
          { label: 'Error',        val: errCount,  col: 'var(--red)'   },
          { label: 'Total APIs',   val: totalApis, col: 'var(--cyan)'  },
        ].map((k, i) => (
          <div key={i} className="kpi-card" style={{ borderLeftColor: k.col }}>
            <div className="kpi-glow" style={{ background: k.col }} />
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: k.col }}>{k.val}</div>
          </div>
        ))}
      </div>

      <div className="g-rhs">
        {/* API Status list */}
        <div className="cc">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div className="cc-title">API Connection Status</div>
            <button
              onClick={handleRefresh}
              disabled={fetching}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(8,145,178,.3)',
                background: 'rgba(8,145,178,.05)', cursor: fetching ? 'not-allowed' : 'pointer',
                fontSize: 11, fontWeight: 600, color: 'var(--cyan)',
              }}
            >
              <RefreshCw size={12} className={fetching ? 'animate-spin-slow' : ''} />
              {fetching ? 'กำลังโหลด...' : 'Refresh All'}
            </button>
          </div>

          {lastRefresh && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: 'var(--t3)', marginBottom: 12 }}>
              <Clock size={10} />
              Updated: {lastRefresh.toLocaleString('th-TH')}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {statusList.map(api => {
              const isOk  = api.status === 'ok';
              const isErr = api.status === 'err';
              return (
                <div key={api.label} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 10,
                  background: isOk ? 'rgba(5,150,105,.04)' : isErr ? 'rgba(220,38,38,.04)' : 'rgba(0,0,0,.02)',
                  border: '1px solid ' + (isOk ? 'rgba(5,150,105,.15)' : isErr ? 'rgba(220,38,38,.15)' : 'rgba(0,0,0,.07)'),
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', color: 'var(--t3)' }}>
                    {(() => { const I = ICON_MAP[api.icon] || Circle; return <I size={16} />; })()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>{api.label}</div>
                    <div style={{ fontSize: 10, color: 'var(--t3)' }}>{api.source}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginBottom: 2 }}>
                      {isOk  ? <CheckCircle size={13} color="#059669" />
                       : isErr ? <XCircle size={13} color="#dc2626" />
                       : <Loader size={13} color="#94a3b8" />}
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: isOk ? 'var(--green)' : isErr ? 'var(--red)' : 'var(--t3)' }}>
                        {isOk ? 'Connected' : isErr ? 'Error' : 'Pending'}
                      </span>
                    </div>
                    {api.value !== '—' && (
                      <div style={{ fontSize: 9.5, color: 'var(--t3)' }}>{api.value}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Config panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* EIA Key */}
          <div className="cc">
            <div className="cc-title" style={{ marginBottom: 10 }}>EIA API Key (ไม่บังคับ)</div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 10, lineHeight: 1.5 }}>
              ใส่ EIA key เพื่อดึงราคา Brent จาก EIA (แม่นยำกว่า Yahoo Finance)
              <br />สมัครฟรีที่ <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>eia.gov</span>
            </div>
            <input
              type="text"
              placeholder="ใส่ EIA API Key..."
              value={eiaKey}
              onChange={e => setEiaKeyLocal(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: 8,
                border: '1px solid rgba(0,0,0,.15)', fontSize: 12,
                color: 'var(--t1)', background: '#f8fafc', outline: 'none',
                marginBottom: 8,
              }}
            />
            <button
              onClick={handleSaveKey}
              style={{
                width: '100%', padding: '8px', borderRadius: 8,
                border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                background: saved ? 'var(--green)' : 'var(--cyan)', color: '#fff',
                transition: 'background .2s',
              }}
            >
              {saved ? '✓ Saved!' : 'Save Key'}
            </button>
          </div>

          {/* Data sources info */}
          <div className="cc">
            <div className="cc-title" style={{ marginBottom: 10 }}>Data Sources</div>
            {[
              { src: 'open.er-api.com',             desc: 'Exchange rates · free tier' },
              { src: 'World Bank API',               desc: 'GDP, CPI, FDI, Tourism, Exports' },
              { src: 'api.chnwt.dev',                desc: 'Thai oil & gold prices (live)' },
              { src: 'Yahoo Finance / EIA',           desc: 'Brent crude price' },
              { src: 'allorigins.win (proxy)',        desc: 'RSS news feeds (CORS)' },
            ].map(item => (
              <div key={item.src} style={{
                padding: '7px 0', borderBottom: '1px solid rgba(0,0,0,.05)',
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t1)' }}>{item.src}</div>
                <div style={{ fontSize: 10.5, color: 'var(--t3)', marginTop: 1 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
