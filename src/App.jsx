import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Network, Layers, Map, Newspaper,
  TrendingUp, Fuel, Coins, SlidersHorizontal, Brain,
  Landmark, Settings, PackageOpen, Share2,
} from 'lucide-react';

import { useData } from './hooks/useData';
import { useNews } from './hooks/useNews';

import Overview    from './pages/Overview';
import Graph       from './pages/Graph';
import Sectors     from './pages/Sectors';
import Provinces   from './pages/Provinces';
import News        from './pages/News';
import Capital     from './pages/Capital';
import Commodity   from './pages/Commodity';
import Simulator   from './pages/Simulator';
import Briefing    from './pages/Briefing';
import GovData     from './pages/GovData';
import SocialMedia  from './pages/SocialMedia';
import SettingsPage    from './pages/Settings';
import BeverageShock  from './pages/BeverageShock';

const NAV_CORE = [
  { id: 'news',       label: 'News Highlights', icon: Newspaper,       adv: false },
  { id: 'overview',   label: 'Overview',        icon: LayoutDashboard, adv: false },
  { id: 'sectors',    label: 'Sectors',          icon: Layers,          adv: false },
  { id: 'provinces',  label: 'ภูมิภาค',           icon: Map,             adv: false },
  { id: 'social',     label: 'Social Media',    icon: Share2,          adv: false },
];

const NAV_ADV = [
  { id: 'capital',    label: 'Capital Flows',   icon: TrendingUp,        adv: true },
  { id: 'commodity',  label: 'Commodities',     icon: PackageOpen,       adv: true },
  { id: 'simulator',  label: 'Simulator',       icon: SlidersHorizontal, adv: true },
  { id: 'briefing',   label: 'AI Briefing',     icon: Brain,             adv: true },
  { id: 'govdata',    label: 'Gov Data',        icon: Landmark,          adv: true },
  { id: 'beverage',  label: 'Beverage Shock',  icon: PackageOpen,       adv: true },
];

function Clock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      const p = v => String(v).padStart(2, '0');
      setTime(`BKK ${p(n.getHours())}:${p(n.getMinutes())}:${p(n.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-semibold tabular-nums text-sm" style={{ color: 'var(--t1)' }}>{time}</span>;
}

export default function App() {
  const [page, setPage] = useState('news');
  const data = useData();
  const newsHook = useNews();

  const apiOk    = data.apiConnected > 0;
  const apiCount = data.apiConnected;
  const apiTotal = data.totalApis;

  const renderPage = () => {
    const props = { data, newsHook };
    switch (page) {
      case 'overview':  return <Overview  {...props} />;
      case 'graph':     return <Graph     {...props} />;
      case 'sectors':   return <Sectors   {...props} />;
      case 'provinces': return <Provinces {...props} />;
      case 'news':      return <News      {...props} />;
      case 'capital':   return <Capital   {...props} />;
      case 'commodity': return <Commodity {...props} />;
      case 'simulator': return <Simulator {...props} />;
      case 'briefing':  return <Briefing  {...props} />;
      case 'govdata':   return <GovData   {...props} />;
      case 'social':    return <SocialMedia />;
      case 'beverage':  return <BeverageShock />;
      case 'settings':  return <SettingsPage {...props} />;
      default:          return <Overview  {...props} />;
    }
  };

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* HEADER */}
      <header style={{
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 28px',
        gap: '16px',
        flexShrink: 0,
        boxShadow: '0 1px 0 rgba(0,0,0,.04),0 4px 16px rgba(0,0,0,.04)',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'linear-gradient(135deg,#0369a1,#0891b2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: 14, color: '#fff', letterSpacing: '-1px',
          flexShrink: 0, boxShadow: '0 2px 8px rgba(8,145,178,0.35)',
        }}>TM</div>

        {/* Title */}
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '.2px', color: 'var(--t1)' }}>THAILAND MONITOR</div>
          <div className="header-title-sub" style={{ fontSize: 11, color: 'var(--t3)', letterSpacing: '.3px', marginTop: 2 }}>Macro-Economic Intelligence · Thailand</div>
        </div>

        {/* LIVE badge */}
        <div className="header-live" style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7,
          border: '1px solid rgba(5,150,105,.3)', borderRadius: 20,
          padding: '5px 14px', fontSize: 11.5, fontWeight: 700, color: '#059669',
          letterSpacing: '.5px', background: 'rgba(5,150,105,.05)',
        }}>
          <div className="animate-blink" style={{ width: 7, height: 7, background: '#059669', borderRadius: '50%' }} />
          LIVE
        </div>

        {/* API Status */}
        <div className="header-api-detail" style={{ fontSize: 10.5, color: 'var(--t3)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ color: apiOk ? '#059669' : '#dc2626', fontWeight: 600 }}>
            {data.fetching
              ? '● Fetching...'
              : apiOk
                ? `● APIs Connected (${apiCount}/${apiTotal})`
                : '● APIs Offline'}
          </span>
          {data.lastRefresh && (
            <span style={{ fontSize: 10, color: 'var(--t3)', marginLeft: 2 }}>
              · Updated {data.lastRefresh.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        {/* Clock */}
        <Clock />
      </header>

      {/* APP BODY */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* SIDEBAR */}
        <nav className="sidebar-nav" aria-label="Main navigation">
          <div className="sb-sec-lbl">CORE</div>
          {NAV_CORE.map(item => (
            <button
              key={item.id}
              className={`sb-tab${page === item.id ? ' active' : ''}`}
              onClick={() => setPage(item.id)}
              title={item.label}
            >
              <item.icon style={{ width: 17, height: 17, flexShrink: 0, opacity: page === item.id ? 1 : 0.7 }} />
              <span className="sb-lbl">{item.label}</span>
            </button>
          ))}

          <div className="sb-div" />
          <div className="sb-sec-lbl adv">ADV</div>

          {NAV_ADV.map(item => (
            <button
              key={item.id}
              className={`sb-tab adv${page === item.id ? ' active' : ''}${item.goldStyle ? '' : ''}`}
              onClick={() => setPage(item.id)}
              title={item.label}
              style={item.goldStyle && page !== item.id ? { color: '#b7791f' } : undefined}
            >
              <item.icon style={{ width: 17, height: 17, flexShrink: 0, opacity: page === item.id ? 1 : 0.7 }} />
              <span className="sb-lbl">{item.label}</span>
            </button>
          ))}

          <div style={{ flex: 1 }} />
          <div className="sb-div" />

          <button
            className={`sb-tab${page === 'settings' ? ' active' : ''}`}
            onClick={() => setPage('settings')}
            title="Settings"
          >
            <Settings style={{ width: 17, height: 17, flexShrink: 0, opacity: page === 'settings' ? 1 : 0.7 }} />
            <span className="sb-lbl">Settings</span>
          </button>
        </nav>

        {/* CONTENT */}
        <div
          className="content-scroll"
          style={{
            flex: 1, minHeight: 0,
            overflowY: 'auto', overflowX: 'hidden',
            padding: '20px 28px',
            containerType: 'inline-size',
          }}
        >
          <div className="page-enter" key={page}>
            {renderPage()}
          </div>
        </div>
      </div>

      {/* BOTTOM NAV (mobile only) */}
      <nav className="bottom-nav">
        {[
          { id: 'overview',  icon: LayoutDashboard, label: 'Overview' },
          { id: 'news',      icon: Newspaper,       label: 'News' },
          { id: 'oil',       icon: Fuel,            label: 'Oil', adv: true },
          { id: 'gold',      icon: Coins,           label: 'Gold', adv: true },
          { id: 'simulator', icon: SlidersHorizontal, label: 'Sim', adv: true },
          { id: 'settings',  icon: Settings,        label: 'Settings' },
        ].map(item => (
          <button
            key={item.id}
            className={`bn-tab${page === item.id ? ' active' : ''}${item.adv ? ' adv' : ''}`}
            onClick={() => setPage(item.id)}
          >
            <item.icon aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
