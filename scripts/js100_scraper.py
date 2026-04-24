#!/usr/bin/env python3
"""
Thailand Monitor — JS100 Traffic Scraper
ดึงสถานการณ์จราจรจาก js100.com/en/site/traffic → public/data/js100_news.json

วิธีรัน local:
  python3 scripts/js100_scraper.py
"""

import json, os, re, sys
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta, timezone

SCRIPT_DIR  = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
OUTPUT_FILE = os.path.join(PROJECT_DIR, 'public', 'data', 'js100_news.json')

BASE_URL     = 'https://www.js100.com'
TRAFFIC_URL  = f'{BASE_URL}/en/site/traffic'
HEADERS      = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
                  'AppleWebKit/537.36 (KHTML, like Gecko) '
                  'Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'th-TH,th;q=0.9,en;q=0.8',
}
TZ_BKK       = timezone(timedelta(hours=7))
MAX_ARTICLES = 40


def parse_timestamp(raw: str) -> str:
    """แปลง 'วันนี้, 07:15น.' / 'เมื่อวาน, 14:30น.' / '24-04-2026, 07:15น.' → ISO 8601"""
    raw = raw.strip()
    now = datetime.now(TZ_BKK)

    m = re.search(r'(\d{1,2}):(\d{2})', raw)
    if not m:
        return now.isoformat()
    h, mn = int(m.group(1)), int(m.group(2))

    if 'วันนี้' in raw:
        d = now.replace(hour=h, minute=mn, second=0, microsecond=0)
    elif 'เมื่อวาน' in raw:
        d = (now - timedelta(days=1)).replace(hour=h, minute=mn, second=0, microsecond=0)
    else:
        dm = re.search(r'(\d{2})-(\d{2})-(\d{4})', raw)
        if dm:
            day, mon, year = int(dm.group(1)), int(dm.group(2)), int(dm.group(3))
            if year > 2500:
                year -= 543  # พ.ศ. → ค.ศ.
            try:
                d = datetime(year, mon, day, h, mn, 0, tzinfo=TZ_BKK)
            except ValueError:
                d = now.replace(hour=h, minute=mn, second=0, microsecond=0)
        else:
            d = now.replace(hour=h, minute=mn, second=0, microsecond=0)
    return d.isoformat()


def detect_traffic_type(text: str) -> str:
    """ตรวจสอบประเภทของรายงานจราจร"""
    t = text.lower()
    if 'อุบัติเหตุ' in t:
        return 'อุบัติเหตุ'
    if 'ติดขัดสะสม' in t or 'ติดขัดมาก' in t:
        return 'ติดขัดสะสม'
    if 'ติดขัด' in t:
        return 'ติดขัด'
    if 'เคลื่อนตัวได้' in t or 'คล่องตัว' in t or 'ไหลลื่น' in t:
        return 'ปกติ'
    if 'ปิดช่องทาง' in t or 'ปิดถนน' in t:
        return 'ปิดช่องทาง'
    if 'ก่อสร้าง' in t or 'ซ่อมแซม' in t:
        return 'ก่อสร้าง'
    return 'รายงานจราจร'


def scrape_traffic() -> list:
    print(f'  📡 ดึง {TRAFFIC_URL}')
    try:
        r = requests.get(TRAFFIC_URL, headers=HEADERS, timeout=20)
        r.raise_for_status()
        r.encoding = 'utf-8'
    except Exception as e:
        print(f'  ❌ ดึงข้อมูลไม่ได้: {e}')
        return []

    soup = BeautifulSoup(r.text, 'html.parser')
    seen, articles = set(), []

    # แต่ละรายการจราจรอยู่ใน <li> ที่มี <h4> timestamp
    for li in soup.find_all('li'):
        h4 = li.find('h4')
        if not h4:
            continue
        timestamp_raw = h4.get_text(strip=True)
        if not re.search(r'\d{1,2}:\d{2}', timestamp_raw):
            continue

        # ดึงข้อความรายงาน (ทั้งหมดใน <li> ยกเว้น h4)
        h4.extract()
        desc = li.get_text(separator=' ', strip=True)
        # คืน h4 กลับ (ป้องกัน side-effect ถ้ามีการวนซ้ำ)
        li.insert(0, h4)

        desc = re.sub(r'\s+', ' ', desc).strip()
        if not desc or len(desc) < 8:
            continue

        key = timestamp_raw + desc[:40]
        if key in seen:
            continue
        seen.add(key)

        ts_iso      = parse_timestamp(timestamp_raw)
        traffic_type = detect_traffic_type(desc)
        article_id  = str(abs(hash(key)) % 10**9)

        articles.append({
            'id':            article_id,
            'title':         desc,
            'url':           TRAFFIC_URL,
            'image':         None,
            'category':      traffic_type,
            'categories':    [traffic_type],
            'timestamp':     ts_iso,
            'timestamp_raw': timestamp_raw,
            'source':        'จส.100',
        })
        print(f'    [{traffic_type}] {desc[:60]}')

        if len(articles) >= MAX_ARTICLES:
            break

    return articles


if __name__ == '__main__':
    print('=' * 55)
    print('Thailand Monitor — JS100 Traffic Scraper')
    print('=' * 55)

    items = scrape_traffic()

    if not items:
        print('\n⚠️  ไม่พบข้อมูลจราจร — ไฟล์เดิมยังคงอยู่')
        sys.exit(0)

    items.sort(key=lambda x: x['timestamp'], reverse=True)

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    print(f'\n✅ บันทึก {len(items)} รายการ → {OUTPUT_FILE}')
