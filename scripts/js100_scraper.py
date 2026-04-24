#!/usr/bin/env python3
"""
Thailand Monitor — JS100 News Scraper
ดึงข่าวจาก js100.com/en/site/news/index → public/data/js100_news.json

วิธีรัน local:
  python3 scripts/js100_scraper.py
"""

import json, os, re, sys, time
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta, timezone

SCRIPT_DIR  = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
OUTPUT_FILE = os.path.join(PROJECT_DIR, 'public', 'data', 'js100_news.json')

BASE_URL  = 'https://www.js100.com'
LIST_URL  = f'{BASE_URL}/en/site/news/index'
HEADERS   = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
                  'AppleWebKit/537.36 (KHTML, like Gecko) '
                  'Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'th-TH,th;q=0.9,en;q=0.8',
}
TZ_BKK  = timezone(timedelta(hours=7))
MAX_ARTICLES = 30


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


def scrape_news() -> list:
    print(f'  📡 ดึง {LIST_URL}')
    try:
        r = requests.get(LIST_URL, headers=HEADERS, timeout=20)
        r.raise_for_status()
        r.encoding = 'utf-8'
    except Exception as e:
        print(f'  ❌ ดึงข้อมูลไม่ได้: {e}')
        return []

    soup = BeautifulSoup(r.text, 'html.parser')
    seen_ids, articles = set(), []

    # หา <a> ที่ลิงก์ไปหน้าข่าว (ไม่ใช่ลิงก์รูปภาพ)
    for a in soup.find_all('a', href=re.compile(r'/en/site/news/view/\d+')):
        if a.find('img'):
            continue  # ข้าม link ที่มีแค่รูป
        title = a.get_text(strip=True)
        if not title or len(title) < 5:
            continue

        href = a['href']
        id_m = re.search(r'/view/(\d+)', href)
        if not id_m:
            continue
        article_id = id_m.group(1)
        if article_id in seen_ids:
            continue
        seen_ids.add(article_id)

        full_url = BASE_URL + href if href.startswith('/') else href

        # ขยับขึ้นหา container (<li> หรือ <div>) ที่มี h4 อยู่ด้วย
        container = a.parent
        for _ in range(6):
            if container is None:
                break
            if container.find('h4'):
                break
            container = container.parent

        # ดึง timestamp
        timestamp_raw = ''
        if container:
            h4 = container.find('h4')
            if h4:
                timestamp_raw = h4.get_text(strip=True)

        # ดึงรูปภาพ
        image_url = None
        if container:
            img = container.find('img')
            if img:
                src = img.get('src') or img.get('data-src') or ''
                if src and not src.startswith('data:'):
                    image_url = src if src.startswith('http') else BASE_URL + src

        # ดึง category
        categories = []
        if container:
            for ca in container.find_all('a', href=re.compile(r'/infilter/')):
                ct = ca.get_text(strip=True)
                if ct:
                    categories.append(ct)

        ts_iso = parse_timestamp(timestamp_raw) if timestamp_raw else datetime.now(TZ_BKK).isoformat()

        articles.append({
            'id':            article_id,
            'title':         title,
            'url':           full_url,
            'image':         image_url,
            'category':      categories[0] if categories else 'ทั่วไป',
            'categories':    categories,
            'timestamp':     ts_iso,
            'timestamp_raw': timestamp_raw,
            'source':        'จส.100',
        })
        print(f'    [{article_id}] {title[:55]}')

        if len(articles) >= MAX_ARTICLES:
            break

    return articles


if __name__ == '__main__':
    print('=' * 55)
    print('Thailand Monitor — JS100 News Scraper')
    print('=' * 55)

    items = scrape_news()

    if not items:
        print('\n⚠️  ไม่พบข่าว — ไฟล์เดิมยังคงอยู่')
        sys.exit(0)

    items.sort(key=lambda x: x['timestamp'], reverse=True)

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    print(f'\n✅ บันทึก {len(items)} ข่าว → {OUTPUT_FILE}')
