import { useState, useEffect, useCallback, useRef } from 'react';

// Environment detection
const IS_ELECTRON = typeof navigator !== 'undefined' && navigator.userAgent.includes('Electron');
const CORS_YAHOO = IS_ELECTRON ? '' : 'https://corsproxy.io/?';

const API_CONFIG = {
  EIA_KEY: '',
  ENDPOINTS: {
    EXCHANGE_RATE: 'https://open.er-api.com/v6/latest/USD',
    WORLD_BANK:    'https://api.worldbank.org/v2/country/TH/indicator',
    THAI_OIL:      'https://api.chnwt.dev/thai-oil-api/latest',
    THAI_GOLD:     'https://api.chnwt.dev/thai-gold-api/latest',
    EIA_BRENT:     'https://api.eia.gov/v2/petroleum/pri/spt/data',
    YAHOO_BRENT:   'https://query1.finance.yahoo.com/v8/finance/chart/BZ=F',
  },
  TIMEOUT_MS:           10000,
  REFRESH_INTERVAL_MS:  15 * 60 * 1000,
};

function sig() {
  return { signal: AbortSignal.timeout(API_CONFIG.TIMEOUT_MS) };
}

const initialApiStatus = {
  exchangeRate: { icon: 'arrow-left-right', label: 'Exchange Rate (USD/THB)', source: 'open.er-api.com',             status: 'pending', value: '—', updatedAt: null },
  gdp:          { icon: 'trending-up',      label: 'GDP Growth YoY',          source: 'World Bank',                  status: 'pending', value: '—', updatedAt: null },
  cpi:          { icon: 'activity',         label: 'CPI Inflation',            source: 'World Bank',                  status: 'pending', value: '—', updatedAt: null },
  exports:      { icon: 'ship',             label: 'Total Exports',            source: 'World Bank',                  status: 'pending', value: '—', updatedAt: null },
  fdi:          { icon: 'briefcase',        label: 'FDI Net Inflows',          source: 'World Bank',                  status: 'pending', value: '—', updatedAt: null },
  tourism:      { icon: 'plane',            label: 'Tourism Arrivals',         source: 'World Bank',                  status: 'pending', value: '—', updatedAt: null },
  brent:        { icon: 'droplets',         label: 'Brent Crude (ICE)',        source: 'Yahoo Finance / EIA',         status: 'pending', value: '—', updatedAt: null },
  thaiOil:      { icon: 'fuel',             label: 'Thai Oil Prices (PTT OR)', source: 'api.chnwt.dev/thai-oil-api', status: 'pending', value: '—', updatedAt: null },
  thaiGold:     { icon: 'coins',            label: 'Thai Gold (สมาคมทองคำ)',   source: 'api.chnwt.dev/thai-gold-api',status: 'pending', value: '—', updatedAt: null },
};

export function useData() {
  const [usdthb, setUsdthb]             = useState(null);
  const [gdp, setGdp]                   = useState(null);
  const [gdpYear, setGdpYear]           = useState(null);
  const [cpi, setCpi]                   = useState(null);
  const [cpiYear, setCpiYear]           = useState(null);
  const [exports_, setExports]          = useState(null);
  const [exportsYear, setExportsYear]   = useState(null);
  const [fdi, setFdi]                   = useState(null);
  const [fdiYear, setFdiYear]           = useState(null);
  const [tourism, setTourism]           = useState(null);
  const [tourismYear, setTourismYear]   = useState(null);
  const [brent, setBrent]               = useState(null);
  const [brentChange, setBrentChange]   = useState(null);
  const [brentChangePct, setBrentChangePct] = useState(null);
  const [thaiOil, setThaiOil]           = useState(null);
  const [goldBar, setGoldBar]           = useState(null);
  const [goldOrn, setGoldOrn]           = useState(null);
  const [goldDate, setGoldDate]         = useState(null);
  const [apiStatus, setApiStatus]       = useState(initialApiStatus);
  const [apiConnected, setApiConnected] = useState(0);
  const [lastRefresh, setLastRefresh]   = useState(null);
  const [fetching, setFetching]         = useState(false);
  const eiaKeyRef = useRef('');

  const markStatus = useCallback((key, ok, value = '—') => {
    setApiStatus(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        status: ok ? 'ok' : 'err',
        value,
        updatedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      },
    }));
  }, []);

  const fetchExchangeRate = useCallback(async () => {
    try {
      const r = await fetch(API_CONFIG.ENDPOINTS.EXCHANGE_RATE, sig());
      const d = await r.json();
      if (d.result === 'success' && d.rates?.THB) {
        setUsdthb(d.rates.THB.toFixed(2));
        markStatus('exchangeRate', true, '1 USD = ' + d.rates.THB.toFixed(2) + ' THB');
        return true;
      }
    } catch (e) { console.warn('[FX]', e.message); }
    markStatus('exchangeRate', false);
    return false;
  }, [markStatus]);

  const fetchWorldBank = useCallback(async (indicator, key, setter) => {
    try {
      const url = `${API_CONFIG.ENDPOINTS.WORLD_BANK}/${indicator}?format=json&mrv=2&per_page=2`;
      const r = await fetch(url, sig());
      const d = await r.json();
      if (d?.[1]?.[0]?.value != null) {
        setter(d[1][0]);
        markStatus(key, true, d[1][0].value.toFixed(2) + ' (' + d[1][0].date + ')');
        return true;
      }
    } catch (e) { console.warn('[WorldBank]', indicator, e.message); }
    markStatus(key, false);
    return false;
  }, [markStatus]);

  const fetchBrentCrude = useCallback(async () => {
    const eiaKey = eiaKeyRef.current || API_CONFIG.EIA_KEY;
    if (eiaKey) {
      try {
        const url = API_CONFIG.ENDPOINTS.EIA_BRENT
          + `?api_key=${eiaKey}`
          + '&frequency=daily&data[0]=value&facets[series][]=RBRTE'
          + '&sort[0][column]=period&sort[0][direction]=desc&length=2';
        const r = await fetch(url, sig());
        const d = await r.json();
        const rows = d?.response?.data;
        if (rows?.length >= 1 && rows[0].value != null) {
          const latest = parseFloat(rows[0].value);
          const prev = rows[1]?.value != null ? parseFloat(rows[1].value) : latest;
          setBrent(latest.toFixed(2));
          setBrentChange((latest - prev).toFixed(2));
          setBrentChangePct((((latest - prev) / prev) * 100).toFixed(2));
          markStatus('brent', true, '$' + latest.toFixed(2) + '/bbl (EIA)');
          return true;
        }
      } catch (e) { console.warn('[Brent EIA]', e.message); }
    }
    // Yahoo Finance fallback
    try {
      const r = await fetch(CORS_YAHOO + API_CONFIG.ENDPOINTS.YAHOO_BRENT + '?interval=1d&range=5d', {
        ...sig(),
        headers: IS_ELECTRON ? { 'User-Agent': 'Mozilla/5.0' } : {},
      });
      const d = await r.json();
      const meta = d?.chart?.result?.[0]?.meta;
      if (meta?.regularMarketPrice) {
        const latest = meta.regularMarketPrice;
        const prev = meta.chartPreviousClose || latest;
        setBrent(latest.toFixed(2));
        setBrentChange((latest - prev).toFixed(2));
        setBrentChangePct((((latest - prev) / prev) * 100).toFixed(2));
        markStatus('brent', true, '$' + latest.toFixed(2) + '/bbl (Yahoo)');
        return true;
      }
    } catch (e) { console.warn('[Brent Yahoo]', e.message); }
    markStatus('brent', false);
    return false;
  }, [markStatus]);

  const fetchThaiOilPrices = useCallback(async () => {
    try {
      const r = await fetch(API_CONFIG.ENDPOINTS.THAI_OIL, {
        ...sig(),
        headers: { 'Accept': 'application/json' },
      });
      const d = await r.json();
      const stations = d?.response?.stations;
      if (!stations) return false;
      const ptt = stations.PTT || stations.ptt || stations.ppt || {};
      const getP = f => {
        if (f == null) return null;
        if (typeof f === 'object' && f.price != null) return parseFloat(f.price);
        const n = parseFloat(f);
        return isNaN(n) ? null : n;
      };
      const oil = {
        gasohol95:   getP(ptt.gasohol_95)    ?? getP(ptt.gasoline_95)  ?? null,
        gasohol91:   getP(ptt.gasohol_91)    ?? null,
        e20:         getP(ptt.gasohol_e20)   ?? null,
        e85:         getP(ptt.gasohol_e85)   ?? null,
        diesel:      getP(ptt.premium_diesel) ?? getP(ptt.diesel)      ?? null,
        dieselPrem:  getP(ptt.diesel_b7)     ?? null,
        ngv:         getP(ptt.ngv)           ?? null,
        date:        d.response?.date        ?? d.response?.update_date ?? null,
        source:      'PTT OR · thai-oil-api',
      };
      setThaiOil(oil);
      markStatus('thaiOil', true, 'G95: ' + oil.gasohol95 + ' ฿ · B7: ' + oil.diesel + ' ฿');
      return true;
    } catch (e) { console.warn('[ThaiOil]', e.message); }
    markStatus('thaiOil', false);
    return false;
  }, [markStatus]);

  const fetchThaiGoldPrices = useCallback(async () => {
    try {
      const r = await fetch(API_CONFIG.ENDPOINTS.THAI_GOLD, {
        ...sig(),
        headers: { 'Accept': 'application/json' },
      });
      const d = await r.json();
      const price = d?.response?.price;
      if (!price) return false;
      const parseGold = s => s ? parseFloat(String(s).replace(/,/g, '')) : null;
      const bar = { buy: parseGold(price.gold_bar?.buy),  sell: parseGold(price.gold_bar?.sell)  };
      const orn = { buy: parseGold(price.gold?.buy),      sell: parseGold(price.gold?.sell)      };
      const dateStr = d.response?.update_date ?? d.response?.date ?? '';
      const timeStr = d.response?.update_time ?? '';
      const date = [dateStr, timeStr].filter(Boolean).join(' ').trim() || null;
      setGoldBar(bar);
      setGoldOrn(orn);
      setGoldDate(date);
      markStatus('thaiGold', true, 'แท่ง: ' + bar.sell?.toLocaleString('th-TH') + ' ฿');
      return true;
    } catch (e) { console.warn('[ThaiGold]', e.message); }
    markStatus('thaiGold', false);
    return false;
  }, [markStatus]);

  const fetchAll = useCallback(async () => {
    setFetching(true);
    const results = await Promise.allSettled([
      fetchExchangeRate(),
      fetchWorldBank('NY.GDP.MKTP.KD.ZG', 'gdp', d => { setGdp(d.value.toFixed(1)); setGdpYear(d.date); }),
      fetchWorldBank('FP.CPI.TOTL.ZG',    'cpi', d => { setCpi(d.value.toFixed(2)); setCpiYear(d.date); }),
      fetchWorldBank('NE.EXP.GNFS.CD',    'exports', d => { setExports((d.value/1e9).toFixed(1)); setExportsYear(d.date); }),
      fetchWorldBank('BX.KLT.DINV.CD.WD', 'fdi', d => { setFdi((d.value/1e9).toFixed(1)); setFdiYear(d.date); }),
      fetchWorldBank('ST.INT.ARVL',        'tourism', d => { setTourism((d.value/1e6).toFixed(1)); setTourismYear(d.date); }),
      fetchBrentCrude(),
      fetchThaiOilPrices(),
      fetchThaiGoldPrices(),
    ]);
    const connected = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
    setApiConnected(connected);
    setLastRefresh(new Date());
    setFetching(false);
    return connected;
  }, [fetchExchangeRate, fetchWorldBank, fetchBrentCrude, fetchThaiOilPrices, fetchThaiGoldPrices]);

  // Calculate Thai retail prices from live oil data or Brent+FX formula
  const calcThaiRetail = useCallback(() => {
    if (!thaiOil && (!brent || !usdthb)) return null;
    let d95, d91, de20, de85, dDiesel, dDieselB10, dDieselPrem, src, isReal = false;
    if (thaiOil?.gasohol95) {
      isReal = true;
      d95 = parseFloat(thaiOil.gasohol95).toFixed(2);
      d91 = thaiOil.gasohol91 ? parseFloat(thaiOil.gasohol91).toFixed(2) : (parseFloat(d95) - 3.89).toFixed(2);
      de20 = thaiOil.e20 ? parseFloat(thaiOil.e20).toFixed(2) : (parseFloat(d95) - 2.92).toFixed(2);
      de85 = thaiOil.e85 ? parseFloat(thaiOil.e85).toFixed(2) : (parseFloat(d95) - 12.23).toFixed(2);
      dDiesel = thaiOil.diesel ? parseFloat(thaiOil.diesel).toFixed(2) : null;
      dDieselB10 = dDiesel ? (parseFloat(dDiesel) - 0.60).toFixed(2) : null;
      dDieselPrem = thaiOil.dieselPrem ? parseFloat(thaiOil.dieselPrem).toFixed(2) : null;
      src = thaiOil.date ? `PTT OR · ${thaiOil.date}` : 'PTT OR · ข้อมูลจริง';
    } else if (brent && usdthb) {
      const brentF = parseFloat(brent);
      const usdthbF = parseFloat(usdthb);
      const dubai = brentF - 1.5;
      const rawL = (dubai * usdthbF) / 158.987;
      d95 = Math.max(25, (rawL * 1.08) + 18.5).toFixed(2);
      d91 = Math.max(22, (rawL * 1.08) + 15.3).toFixed(2);
      de20 = Math.max(22, (rawL * 1.08) + 16.0).toFixed(2);
      de85 = Math.max(15, (rawL * 0.95) + 6.2).toFixed(2);
      dDiesel = Math.max(20, rawL + 13.45).toFixed(2);
      dDieselB10 = Math.max(19, rawL + 12.7).toFixed(2);
      dDieselPrem = null;
      src = `คำนวณ · Brent $${brentF} · ฿${usdthbF}`;
    } else {
      return null;
    }
    return { d95, d91, de20, de85, dDiesel, dDieselB10, dDieselPrem, src, isReal };
  }, [thaiOil, brent, usdthb]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, API_CONFIG.REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const setEiaKey = useCallback((key) => {
    eiaKeyRef.current = key;
    API_CONFIG.EIA_KEY = key;
  }, []);

  return {
    usdthb, gdp, gdpYear, cpi, cpiYear,
    exports: exports_, exportsYear,
    fdi, fdiYear, tourism, tourismYear,
    brent, brentChange, brentChangePct,
    thaiOil, goldBar, goldOrn, goldDate,
    apiStatus, apiConnected, lastRefresh, fetching,
    fetchAll, calcThaiRetail, setEiaKey,
    totalApis: Object.keys(initialApiStatus).length,
  };
}
