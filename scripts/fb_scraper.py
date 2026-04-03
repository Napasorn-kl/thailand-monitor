#!/usr/bin/env python3
"""
Thailand Monitor - Facebook Page Scraper
ดึงโพสต์จาก Facebook Page สาธารณะ แล้วบันทึกเป็น public/data/fb_news.json

วิธีรัน (local):
  python3 scripts/fb_scraper.py                    # ดึงข้อมูลไม่ใช้ cookies
  python3 scripts/fb_scraper.py --cookies          # ใช้ cookies จากไฟล์ fb_cookies.txt

วิธีรัน (GitHub Actions):
  ตั้ง Secret FB_COOKIES ใน GitHub repo Settings → Secrets

วิธีเอา cookies:
  1. เปิด Chrome → ไปที่ facebook.com (login ก่อน)
  2. กด F12 → Console → พิมพ์: document.cookie
  3. Copy ค่าทั้งหมด → วางในไฟล์ scripts/fb_cookies.txt
     หรือตั้งเป็น GitHub Secret ชื่อ FB_COOKIES
"""

import json
import os
import sys
from datetime import datetime, timezone

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
OUTPUT_FILE = os.path.join(PROJECT_DIR, 'public', 'data', 'fb_news.json')
COOKIES_FILE = os.path.join(SCRIPT_DIR, 'fb_cookies.txt')

try:
    from facebook_scraper import get_posts
except ImportError:
    print("กรุณาติดตั้ง: pip3 install facebook-scraper lxml_html_clean")
    sys.exit(1)

# รายชื่อ Facebook Page ที่ต้องการดึงข้อมูล
FACEBOOK_PAGES = [
    {"page": "DDPMNews",        "name": "กรมป้องกันและบรรเทาสาธารณภัย", "category": "สาธารณภัย"},
    {"page": "tmd.go.th",       "name": "กรมอุตุนิยมวิทยา",             "category": "สภาพอากาศ"},
    {"page": "PCD.go.th",       "name": "กรมควบคุมมลพิษ",               "category": "สิ่งแวดล้อม"},
    {"page": "longtunman",      "name": "ลงทุนแมน",                      "category": "การลงทุน"},
    {"page": "bangkokbiznews",  "name": "กรุงเทพธุรกิจ",                 "category": "ธุรกิจ"},
    {"page": "brandbuffet",     "name": "Brand Buffet",                  "category": "การตลาด"},
    {"page": "PositioningMag",  "name": "Positioning",                   "category": "ธุรกิจ"},
]

POSTS_PER_PAGE = 3


def parse_cookie_string(cookie_str):
    """แปลง cookie string เป็น dict"""
    cookies = {}
    for part in cookie_str.strip().split(';'):
        part = part.strip()
        if '=' in part:
            k, v = part.split('=', 1)
            cookies[k.strip()] = v.strip()
    return cookies


def load_cookies():
    """โหลด cookies จาก env var FB_COOKIES หรือไฟล์ fb_cookies.txt"""
    # 1. ลองจาก environment variable ก่อน (GitHub Actions)
    env_cookies = os.environ.get('FB_COOKIES', '').strip()
    if env_cookies:
        cookies = parse_cookie_string(env_cookies)
        print(f"✅ โหลด cookies จาก environment variable ({len(cookies)} items)")
        return cookies

    # 2. ลองจากไฟล์
    if os.path.exists(COOKIES_FILE):
        try:
            with open(COOKIES_FILE, 'r', encoding='utf-8') as f:
                cookie_str = f.read().strip()
            if cookie_str:
                cookies = parse_cookie_string(cookie_str)
                print(f"✅ โหลด cookies จากไฟล์ ({len(cookies)} items)")
                return cookies
        except Exception as e:
            print(f"⚠️  โหลด cookies จากไฟล์ไม่ได้: {e}")

    return None


def scrape_page(page_info, cookies=None):
    posts = []
    try:
        kwargs = {"pages": 2, "timeout": 30}
        if cookies:
            kwargs["cookies"] = cookies

        for post in get_posts(page_info["page"], **kwargs):
            post_text = (post.get('post_text') or post.get('text') or '').strip()
            if not post_text:
                continue

            timestamp = post.get('time')
            if timestamp and hasattr(timestamp, 'isoformat'):
                ts_str = timestamp.isoformat()
            elif timestamp:
                ts_str = str(timestamp)
            else:
                ts_str = datetime.now(timezone.utc).isoformat()

            posts.append({
                "source_name": page_info["name"],
                "page_id": page_info["page"],
                "post_text": post_text[:500],
                "post_url": post.get('post_url') or post.get('link') or f"https://facebook.com/{page_info['page']}",
                "timestamp": ts_str,
                "image_url": post.get('image'),
                "category": page_info["category"],
            })

            if len(posts) >= POSTS_PER_PAGE:
                break

    except Exception as e:
        print(f"  ❌ Error: {e}")

    return posts


def scrape_all(cookies=None):
    all_posts = []
    for page_info in FACEBOOK_PAGES:
        print(f"⏳ {page_info['name']} ({page_info['page']})")
        posts = scrape_page(page_info, cookies)
        print(f"  ✅ ดึงได้ {len(posts)} โพสต์")
        all_posts.extend(posts)

    all_posts.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
    return all_posts


def save(posts):
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
    print(f"\n✅ บันทึก {len(posts)} โพสต์ → {OUTPUT_FILE}")


if __name__ == "__main__":
    use_cookies = '--cookies' in sys.argv or os.environ.get('FB_COOKIES')

    print("=" * 55)
    print("Thailand Monitor - Facebook Scraper")
    print("=" * 55)

    cookies = load_cookies() if use_cookies else None
    posts = scrape_all(cookies=cookies)

    if posts:
        save(posts)
    else:
        print("\n⚠️  ไม่พบโพสต์จริง — ข้อมูลเดิมยังคงอยู่")
        print("แนะนำ: ตั้ง FB_COOKIES ใน GitHub Secrets")
        sys.exit(0)  # ไม่ fail workflow
