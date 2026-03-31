import { useState, useEffect, useCallback } from 'react';

const IS_LOCAL = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const CORS     = IS_LOCAL ? 'https://corsproxy.io/?' : '/api/rss?url=';
const CACHE_MS = 10 * 60 * 1000;

async function fetchOneSymbol(sym) {
  const target = `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1d&range=5d`;
  try {
    const r = await fetch(CORS + encodeURIComponent(target), { signal: AbortSignal.timeout(8000) });
    if (!r.ok) return null;
    const d = await r.json();
    const meta = d?.chart?.result?.[0]?.meta;
    if (!meta?.regularMarketPrice) return null;
    const latest = meta.regularMarketPrice;
    const prev   = meta.chartPreviousClose || latest;
    return {
      price:     latest,
      change:    latest - prev,
      changePct: prev ? ((latest - prev) / prev) * 100 : 0,
    };
  } catch { return null; }
}

export const COMMODITY_DEFS = [
  // Energy
  { id: 'brent',    sym: 'BZ=F',  labelTH: 'น้ำมันดิบ Brent',  labelEN: 'Brent Crude',  unit: 'USD/bbl',   cat: 'energy',    iconKey: 'fuel'   },
  { id: 'wti',      sym: 'CL=F',  labelTH: 'น้ำมันดิบ WTI',    labelEN: 'WTI Crude',    unit: 'USD/bbl',   cat: 'energy',    iconKey: 'fuel'   },
  { id: 'natgas',   sym: 'NG=F',  labelTH: 'ก๊าซธรรมชาติ',     labelEN: 'Natural Gas',  unit: 'USD/MMBtu', cat: 'energy',    iconKey: 'wind'   },
  // Metals
  { id: 'gold',     sym: 'GC=F',  labelTH: 'ทองคำ',             labelEN: 'Gold',         unit: 'USD/oz',    cat: 'metals',    iconKey: 'trophy' },
  { id: 'silver',   sym: 'SI=F',  labelTH: 'เงิน (Silver)',     labelEN: 'Silver',       unit: 'USD/oz',    cat: 'metals',    iconKey: 'gem'    },
  { id: 'platinum', sym: 'PL=F',  labelTH: 'แพลทินัม',          labelEN: 'Platinum',     unit: 'USD/oz',    cat: 'metals',    iconKey: 'disc'   },
  { id: 'copper',   sym: 'HG=F',  labelTH: 'ทองแดง',            labelEN: 'Copper',       unit: 'USD/lb',    cat: 'metals',    iconKey: 'wrench' },
  // Agricultural
  { id: 'corn',     sym: 'ZC=F',  labelTH: 'ข้าวโพด',           labelEN: 'Corn',         unit: 'USc/bu',    cat: 'agri',      iconKey: 'wheat'  },
  { id: 'wheat',    sym: 'ZW=F',  labelTH: 'ข้าวสาลี',          labelEN: 'Wheat',        unit: 'USc/bu',    cat: 'agri',      iconKey: 'wheat'  },
  { id: 'soy',      sym: 'ZS=F',  labelTH: 'ถั่วเหลือง',         labelEN: 'Soybeans',     unit: 'USc/bu',    cat: 'agri',      iconKey: 'leaf'   },
  { id: 'rice',     sym: 'ZR=F',  labelTH: 'ข้าว (Rough Rice)', labelEN: 'Rice',         unit: 'USD/cwt',   cat: 'agri',      iconKey: 'wheat'  },
  { id: 'coffee',   sym: 'KC=F',  labelTH: 'กาแฟ',              labelEN: 'Coffee',       unit: 'USc/lb',    cat: 'agri',      iconKey: 'coffee' },
  { id: 'cocoa',    sym: 'CC=F',  labelTH: 'โกโก้',             labelEN: 'Cocoa',        unit: 'USD/MT',    cat: 'agri',      iconKey: 'leaf'   },
  { id: 'sugar',    sym: 'SB=F',  labelTH: 'น้ำตาล',            labelEN: 'Sugar #11',    unit: 'USc/lb',    cat: 'agri',      iconKey: 'leaf'   },
  { id: 'cotton',   sym: 'CT=F',  labelTH: 'ฝ้าย',              labelEN: 'Cotton',       unit: 'USc/lb',    cat: 'agri',      iconKey: 'leaf'   },
  // Livestock
  { id: 'cattle',   sym: 'LE=F',  labelTH: 'เนื้อวัว',          labelEN: 'Live Cattle',  unit: 'USc/lb',    cat: 'livestock', iconKey: 'beef'   },
  { id: 'hogs',     sym: 'HE=F',  labelTH: 'เนื้อหมู',          labelEN: 'Lean Hogs',    unit: 'USc/lb',    cat: 'livestock', iconKey: 'beef'   },
];

let cache = null;
let cacheTime = 0;

async function fetchAllQuotes() {
  const results = await Promise.allSettled(
    COMMODITY_DEFS.map(def => fetchOneSymbol(def.sym))
  );
  const map = {};
  results.forEach((r, i) => {
    if (r.status === 'fulfilled' && r.value) {
      map[COMMODITY_DEFS[i].sym] = r.value;
    }
  });
  return map;
}

export function useCommodity() {
  const [quotes, setQuotes]         = useState({});
  const [loading, setLoading]       = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const refresh = useCallback(async (force = false) => {
    if (!force && cache && Date.now() - cacheTime < CACHE_MS) {
      setQuotes(cache);
      return;
    }
    setLoading(true);
    const data = await fetchAllQuotes();
    if (data) {
      cache = data;
      cacheTime = Date.now();
      setQuotes(data);
      setLastUpdate(new Date());
    }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { quotes, loading, lastUpdate, refresh };
}
