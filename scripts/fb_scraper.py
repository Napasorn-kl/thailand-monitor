#!/usr/bin/env python3
"""
Thailand Monitor - Facebook Page Scraper
ดึงโพสต์จาก Facebook Page → บันทึกเป็น public/data/fb_news.json

Sources:
  - Apify Facebook Posts Scraper: ลงทุนแมน, THE STANDARD, Brand Buffet
  - facebook-scraper library: เพจอื่น ๆ (ถ้ามี FB_COOKIES)

GitHub Secrets ที่ต้องตั้ง:
  APIFY_TOKEN  — Apify API token (https://console.apify.com/account/integrations)
  FB_COOKIES   — (optional) Facebook cookie สำหรับ facebook-scraper

วิธีรัน local:
  python3 scripts/fb_scraper.py
"""

import json, os, sys, time, requests
from datetime import datetime, timezone

SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR  = os.path.dirname(SCRIPT_DIR)
OUTPUT_FILE  = os.path.join(PROJECT_DIR, 'public', 'data', 'fb_news.json')
COOKIES_FILE = os.path.join(SCRIPT_DIR, 'fb_cookies.txt')

APIFY_TOKEN = os.environ.get('APIFY_TOKEN', '').strip()
APIFY_ACTOR = 'apify~facebook-posts-scraper'

# เพจที่ใช้ Apify (ตรงกับที่ตั้งค่าใน Apify Console)
APIFY_PAGES = [
    {"url": "https://www.facebook.com/longtunman",       "name": "ลงทุนแมน",           "category": "การลงทุน"},
    {"url": "https://www.facebook.com/thestandardwealth","name": "THE STANDARD Wealth", "category": "การลงทุน"},
    {"url": "https://www.facebook.com/bangkokbiznews",   "name": "กรุงเทพธุรกิจ",       "category": "ธุรกิจ"},
    {"url": "https://www.facebook.com/brandbuffet",      "name": "Brand Buffet",        "category": "การตลาด"},
    {"url": "https://www.facebook.com/theadaddict",      "name": "The Addict Guide",    "category": "ท่องเที่ยว"},
    {"url": "https://www.facebook.com/bloombergnews",    "name": "Bloomberg",           "category": "การลงทุน"},
    {"url": "https://www.facebook.com/forbesthailand",   "name": "Forbes Thailand",     "category": "ธุรกิจ"},
]

# เพจที่ใช้ facebook-scraper (หน่วยงานรัฐ ต้องการ FB_COOKIES)
FB_SCRAPER_PAGES = [
    {"page": "DDPMNews",  "name": "กรมป้องกันและบรรเทาสาธารณภัย", "category": "สาธารณภัย"},
    {"page": "tmd.go.th", "name": "กรมอุตุนิยมวิทยา",             "category": "สภาพอากาศ"},
    {"page": "PCD.go.th", "name": "กรมควบคุมมลพิษ",               "category": "สิ่งแวดล้อม"},
]

POSTS_PER_PAGE = 3


# ─── Apify ───────────────────────────────────────────────────────────────────

def scrape_with_apify(pages):
    """ดึงโพสต์จาก Apify Facebook Posts Scraper"""
    if not APIFY_TOKEN:
        print("⚠️  ไม่พบ APIFY_TOKEN — ข้าม Apify")
        return []

    print(f"\n📡 Apify: ดึงข้อมูล {len(pages)} เพจ...")

    run_url = f"https://api.apify.com/v2/acts/{APIFY_ACTOR}/runs?token={APIFY_TOKEN}"
    run_input = {
        "startUrls": [{"url": p["url"]} for p in pages],
        "maxPosts":  POSTS_PER_PAGE,
        "maxPostDate": None,
    }

    try:
        resp = requests.post(run_url, json=run_input, timeout=30)
        resp.raise_for_status()
        run_data    = resp.json()["data"]
        run_id      = run_data["id"]
        dataset_id  = run_data["defaultDatasetId"]
        print(f"  ▶ Run ID: {run_id}")
    except Exception as e:
        print(f"  ❌ เริ่ม Apify run ไม่ได้: {e}")
        return []

    # รอให้ run เสร็จ (polling สูงสุด 8 นาที)
    status_url = f"https://api.apify.com/v2/actor-runs/{run_id}?token={APIFY_TOKEN}"
    status = "RUNNING"
    for attempt in range(48):
        time.sleep(10)
        try:
            s = requests.get(status_url, timeout=15).json()["data"]["status"]
            status = s
            print(f"  ⏳ [{attempt*10}s] status: {status}")
            if status in ("SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"):
                break
        except Exception:
            pass

    if status != "SUCCEEDED":
        print(f"  ❌ Apify run สิ้นสุดด้วย status: {status}")
        return []

    # ดึงผลลัพธ์จาก dataset
    items_url = f"https://api.apify.com/v2/datasets/{dataset_id}/items?token={APIFY_TOKEN}&format=json"
    try:
        items = requests.get(items_url, timeout=30).json()
    except Exception as e:
        print(f"  ❌ ดึง dataset ไม่ได้: {e}")
        return []

    # แปลงเป็น format มาตรฐาน
    page_meta = {p["url"].rstrip("/"): p for p in pages}
    posts = []
    for item in items:
        page_url  = (item.get("pageUrl") or "").rstrip("/")
        page_info = page_meta.get(page_url, {})
        text      = (item.get("text") or item.get("postText") or "").strip()
        if not text:
            continue

        ts_raw = item.get("time") or item.get("timestamp")
        try:
            ts_str = datetime.fromisoformat(str(ts_raw)).isoformat() if ts_raw else datetime.now(timezone.utc).isoformat()
        except Exception:
            ts_str = datetime.now(timezone.utc).isoformat()

        posts.append({
            "source_name": page_info.get("name", item.get("pageName", page_url)),
            "page_id":     page_url.split("/")[-1],
            "post_text":   text[:500],
            "post_url":    item.get("url") or item.get("postUrl") or page_url,
            "timestamp":   ts_str,
            "image_url":   item.get("media", [{}])[0].get("url") if item.get("media") else None,
            "category":    page_info.get("category", "ธุรกิจ"),
        })

    print(f"  ✅ Apify ดึงได้ {len(posts)} โพสต์")
    return posts


# ─── facebook-scraper ─────────────────────────────────────────────────────────

def load_cookies():
    env = os.environ.get('FB_COOKIES', '').strip()
    if env:
        cookies = {}
        for part in env.split(';'):
            part = part.strip()
            if '=' in part:
                k, v = part.split('=', 1)
                cookies[k.strip()] = v.strip()
        print(f"✅ โหลด cookies จาก env ({len(cookies)} items)")
        return cookies

    if os.path.exists(COOKIES_FILE):
        try:
            raw = open(COOKIES_FILE, encoding='utf-8').read().strip()
            if raw:
                cookies = {}
                for part in raw.split(';'):
                    part = part.strip()
                    if '=' in part:
                        k, v = part.split('=', 1)
                        cookies[k.strip()] = v.strip()
                print(f"✅ โหลด cookies จากไฟล์ ({len(cookies)} items)")
                return cookies
        except Exception as e:
            print(f"⚠️  โหลด cookies ไม่ได้: {e}")
    return None


def scrape_with_fb_scraper(pages, cookies):
    try:
        from facebook_scraper import get_posts
    except ImportError:
        print("⚠️  ไม่พบ facebook-scraper — ข้าม")
        return []

    if not cookies:
        print("⚠️  ไม่พบ FB_COOKIES — ข้าม facebook-scraper pages")
        return []

    all_posts = []
    print(f"\n🔧 facebook-scraper: ดึง {len(pages)} เพจ...")
    for page_info in pages:
        print(f"  ⏳ {page_info['name']} ({page_info['page']})")
        posts = []
        try:
            for post in get_posts(page_info["page"], pages=2, timeout=30, cookies=cookies):
                text = (post.get('post_text') or post.get('text') or '').strip()
                if not text:
                    continue
                ts = post.get('time')
                ts_str = ts.isoformat() if (ts and hasattr(ts, 'isoformat')) else datetime.now(timezone.utc).isoformat()
                posts.append({
                    "source_name": page_info["name"],
                    "page_id":     page_info["page"],
                    "post_text":   text[:500],
                    "post_url":    post.get('post_url') or post.get('link') or f"https://facebook.com/{page_info['page']}",
                    "timestamp":   ts_str,
                    "image_url":   post.get('image'),
                    "category":    page_info["category"],
                })
                if len(posts) >= POSTS_PER_PAGE:
                    break
        except Exception as e:
            print(f"    ❌ {e}")
        print(f"    ✅ {len(posts)} โพสต์")
        all_posts.extend(posts)

    return all_posts


# ─── Main ─────────────────────────────────────────────────────────────────────

def save(posts):
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
    print(f"\n✅ บันทึก {len(posts)} โพสต์ → {OUTPUT_FILE}")


if __name__ == "__main__":
    print("=" * 55)
    print("Thailand Monitor - Facebook Scraper")
    print("=" * 55)

    all_posts = []

    # 1. Apify (ลงทุนแมน, THE STANDARD, Brand Buffet)
    all_posts += scrape_with_apify(APIFY_PAGES)

    # 2. facebook-scraper (เพจอื่น ๆ ถ้ามี FB_COOKIES)
    cookies = load_cookies()
    all_posts += scrape_with_fb_scraper(FB_SCRAPER_PAGES, cookies)

    if all_posts:
        all_posts.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        save(all_posts)
    else:
        print("\n⚠️  ไม่พบโพสต์จริง — ข้อมูลเดิมยังคงอยู่")
        print("ตรวจสอบ: APIFY_TOKEN ใน GitHub Secrets")
        sys.exit(0)
