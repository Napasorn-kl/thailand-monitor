#!/usr/bin/env python3
"""
Thailand Monitor - Commodity Price Scraper
ดึงราคาสินค้าโภคภัณฑ์จริงสำหรับ Beverage Supply Shock Dashboard
Sources: Alpha Vantage (Sugar, Aluminum, Crude Oil), OpenWeatherMap (Bangkok)

GitHub Secrets ที่ต้องตั้ง:
  ALPHA_VANTAGE_KEY — https://www.alphavantage.co/support/#api-key
  OPENWEATHER_KEY   — https://openweathermap.org/api (My API Keys)

วิธีรัน local:
  python3 scripts/commodity_scraper.py
"""

import json, os, time, requests
from datetime import datetime, timezone

SCRIPT_DIR  = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
OUTPUT_FILE = os.path.join(PROJECT_DIR, 'public', 'data', 'commodity_prices.json')

ALPHA_KEY = os.environ.get('ALPHA_VANTAGE_KEY', '').strip()
OWM_KEY   = os.environ.get('OPENWEATHER_KEY', '').strip()


def risk_from_pct(pct):
    """คำนวณ risk level และ score จาก % price change"""
    a = abs(pct)
    if a >= 20: return 'Critical', 85
    if a >= 10: return 'High',     70
    if a >= 5:  return 'Medium',   55
    return 'Low', 30


def fetch_alpha(function, label, retries=2):
    """ดึงราคา commodity รายเดือนจาก Alpha Vantage (retry on rate limit)"""
    url = (f"https://www.alphavantage.co/query"
           f"?function={function}&interval=monthly&apikey={ALPHA_KEY}")
    for attempt in range(retries):
        try:
            resp = requests.get(url, timeout=20)
            body = resp.json()

            # Rate limit — wait 65s then retry
            if 'Note' in body or 'Information' in body:
                msg = body.get('Note') or body.get('Information', '')
                if attempt < retries - 1:
                    print(f"  ⏳ {label}: rate limit — รอ 65s แล้ว retry...")
                    time.sleep(65)
                    continue
                print(f"  ⚠️  {label}: rate limit หมด retry — {msg[:60]}")
                return None

            items = body.get('data', [])
            if len(items) < 3:
                print(f"  ⚠️  {label}: ข้อมูลไม่เพียงพอ ({len(items)} records)")
                return None

            cur  = float(items[0]['value'])
            prev = float(items[2]['value'])
            pct  = (cur - prev) / prev * 100
            level, score = risk_from_pct(pct)

            print(f"  ✅ {label}: {cur:.2f} {body.get('unit','')} "
                  f"({pct:+.1f}% / 3M) → {level} (score {score})")

            return {
                'price':      round(cur, 2),
                'unit':       body.get('unit', ''),
                'change_pct': round(pct, 1),
                'risk_level': level,
                'risk_score': score,
                'history': [
                    {'date': x['date'], 'value': float(x['value'])}
                    for x in items[:12]
                ],
            }
        except Exception as e:
            print(f"  ❌ {label}: {e}")
            return None
    return None


def fetch_weather():
    """ดึงสภาพอากาศกรุงเทพจาก OpenWeatherMap"""
    if not OWM_KEY:
        print("  ⚠️  ไม่พบ OPENWEATHER_KEY — ข้าม weather")
        return None
    url = (f"https://api.openweathermap.org/data/2.5/weather"
           f"?q=Bangkok,th&appid={OWM_KEY}&units=metric")
    try:
        d    = requests.get(url, timeout=10).json()
        if d.get('cod') != 200:
            print(f"  ⚠️  Weather API error: {d.get('message', d)}")
            return None
        temp = d['main']['temp']
        hum  = d['main']['humidity']
        cond = d['weather'][0]['main']
        # drought risk heuristic
        drought = ('High'   if temp > 35 and hum < 50
                   else 'Medium' if temp > 32
                   else 'Low')
        print(f"  ✅ Bangkok: {temp}°C  {hum}%RH  {cond}  drought={drought}")
        return {
            'temp':        temp,
            'humidity':    hum,
            'condition':   cond,
            'drought_risk': drought,
        }
    except Exception as e:
        print(f"  ❌ Weather: {e}")
        return None


if __name__ == '__main__':
    print('=' * 55)
    print('Thailand Monitor - Commodity Scraper')
    print('=' * 55)

    if not ALPHA_KEY:
        print('⚠️  ไม่พบ ALPHA_VANTAGE_KEY — ออกจาก script')
        raise SystemExit(1)

    print('\n📊 ดึงราคา Commodity...')
    sugar = fetch_alpha('SUGAR',         'น้ำตาลทราย (ICE No.11)')
    time.sleep(15)  # Alpha Vantage free tier: max 5 calls/min
    alum  = fetch_alpha('ALUMINUM',      'อลูมิเนียม (LME)')
    time.sleep(15)
    crude = fetch_alpha('CRUDE_OIL_WTI', 'น้ำมันดิบ WTI')

    print('\n🌤  ดึงสภาพอากาศ...')
    weather = fetch_weather()

    # Composite score (sugar & aluminum weighted 2x, crude 1x)
    weighted = [(m['risk_score'], w)
                for m, w in [(sugar, 2), (alum, 2), (crude, 1)]
                if m]
    if weighted:
        composite = round(sum(s * w for s, w in weighted) / sum(w for _, w in weighted))
    else:
        composite = 50

    overall = ('Critical' if composite >= 80
               else 'High'   if composite >= 65
               else 'Medium' if composite >= 50
               else 'Low')

    result = {
        'updated_at':      datetime.now(timezone.utc).isoformat(),
        'composite_score': composite,
        'overall_risk':    overall,
        'materials': {
            'sugar':     sugar,
            'aluminum':  alum,
            'crude_oil': crude,
        },
        'weather': weather,
    }

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f'\n✅ บันทึก {composite} composite score ({overall}) → {OUTPUT_FILE}')
