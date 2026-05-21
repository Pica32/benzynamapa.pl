"""
IndexNow ping skript pro BenzynaMAPA.pl

Po každé aktualizaci cen pinguje vyhledávače (Bing, Yandex, Naver, Seznam)
o změněných URL. Bing přímo zásobuje ChatGPT/Copilot — kritické pro AI viditelnost.

Spouští se v GitHub Actions po commitu nových cen. Pinguje:
- Homepage (vždy se mění)
- Sitemap (signál pro re-crawl)
- Top 50 stanic s reálnou cenou (kde se cena změnila)
- 16 region pages
- 165 city pages

Reference: https://www.indexnow.org/documentation
"""
from __future__ import annotations

import json
import sys
import urllib.request
import urllib.error
from pathlib import Path

INDEXNOW_KEY = "0191df93d1b02a6c00fdb8d67042bdd3"
HOST = "benzynamapa.pl"
ENDPOINT = "https://api.indexnow.org/indexnow"
KEY_LOCATION = f"https://{HOST}/{INDEXNOW_KEY}.txt"

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "web" / "public" / "data"


def collect_urls() -> list[str]:
    """Sestavi seznam URL k ping. Limit IndexNow je 10 000 URL na jeden request."""
    urls: list[str] = []
    base = f"https://{HOST}"

    # Static high-priority
    urls.extend([
        f"{base}/",
        f"{base}/sitemap.xml",
        f"{base}/najtansze-benzyna/",
        f"{base}/najtansze-diesel/",
        f"{base}/najtansze-lpg/",
        f"{base}/historia-cen/",
        f"{base}/marka/",
        f"{base}/wojewodztwo/",
        f"{base}/maksymalne-ceny-paliw/",
        # Stránky pro paliva (P1.5) — průměrné ceny se mění s každým updatem
        f"{base}/benzyna-95/",
        f"{base}/benzyna-98/",
        f"{base}/olej-napedowy/",
        f"{base}/lpg/",
    ])

    # Stations s reálnou cenou (top priority — ceny se změnily)
    try:
        prices = json.loads((DATA_DIR / "prices_latest.json").read_text(encoding="utf-8"))
        real = [p for p in prices.get("prices", []) if p.get("source") == "cenapaliw.pl"]
        # IndexNow doporučuje pouze stránky kde došlo ke změně — všechny real stanice
        for p in real[:500]:  # bezpečnostní limit
            urls.append(f"{base}/stacja/{p['station_id']}/")
    except Exception as e:
        print(f"⚠ Nelze načíst prices_latest.json: {e}", file=sys.stderr)

    # Top 50 měst (capital + populační)
    top_cities = [
        "warszawa", "krakow", "lodz", "wroclaw", "poznan", "gdansk", "szczecin",
        "bydgoszcz", "lublin", "katowice", "bialystok", "gdynia", "czestochowa",
        "radom", "torun", "sosnowiec", "rzeszow", "kielce", "gliwice", "olsztyn",
        "bielsko-biala", "zabrze", "bytom", "zielona-gora", "rybnik", "ruda-slaska",
        "tychy", "opole", "gorzow-wielkopolski", "dabrowa-gornicza", "plock",
        "elblag", "walbrzych", "wloclawek", "tarnow", "chorzow", "koszalin",
        "kalisz", "legnica", "grudziadz", "slupsk", "jaworzno", "jastrzebie-zdroj",
        "nowy-sacz", "jelenia-gora", "siedlce", "myslowice", "konin", "pila",
        "piotrkow-trybunalski",
    ]
    urls.extend(f"{base}/miasto/{slug}/" for slug in top_cities)

    # Wszystkie województwa (16)
    regions = [
        "mazowieckie", "slaskie", "malopolskie", "wielkopolskie", "dolnoslaskie",
        "lodzkie", "lubelskie", "pomorskie", "kujawsko-pomorskie", "podkarpackie",
        "zachodniopomorskie", "warminsko-mazurskie", "swietokrzyskie", "podlaskie",
        "lubuskie", "opolskie",
    ]
    urls.extend(f"{base}/wojewodztwo/{slug}/" for slug in regions)

    # Wszystkie marki (6)
    brands = ["orlen", "shell", "bp", "circle-k", "moya", "huzar"]
    urls.extend(f"{base}/marka/{slug}/" for slug in brands)

    return urls


def ping_indexnow(urls: list[str]) -> bool:
    """POST URL listu na IndexNow API. Endpoint pinguje Bing + sdílí s partnery (Yandex, Seznam, Naver)."""
    if not urls:
        print("⚠ Žádné URL k ping.", file=sys.stderr)
        return False

    payload = {
        "host": HOST,
        "key": INDEXNOW_KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls,
    }

    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT,
        data=body,
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "Host": "api.indexnow.org",
            "User-Agent": "BenzynaMAPA-IndexNow/1.0",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            status = resp.getcode()
            print(f"✓ IndexNow: HTTP {status}, {len(urls)} URLs zpinguto")
            # 200 OK, 202 Accepted, 422 = neplatné URL (ale 200/202 = úspěch)
            return status in (200, 202)
    except urllib.error.HTTPError as e:
        # 429 = rate limit, 422 = bad URL
        print(f"⚠ IndexNow HTTP error {e.code}: {e.reason}", file=sys.stderr)
        if e.code == 422:
            try:
                err_body = e.read().decode("utf-8")
                print(f"  Detail: {err_body[:500]}", file=sys.stderr)
            except Exception:
                pass
        return False
    except Exception as e:
        print(f"⚠ IndexNow request failed: {e}", file=sys.stderr)
        return False


def main() -> int:
    urls = collect_urls()
    # Deduplikace, zachováme pořadí
    seen = set()
    unique_urls = []
    for u in urls:
        if u not in seen:
            seen.add(u)
            unique_urls.append(u)

    print(f"→ Pinguju IndexNow s {len(unique_urls)} unikátními URL")

    # IndexNow doporučuje max 10k URL/request
    BATCH = 10000
    all_ok = True
    for i in range(0, len(unique_urls), BATCH):
        batch = unique_urls[i : i + BATCH]
        ok = ping_indexnow(batch)
        all_ok = all_ok and ok

    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main())
