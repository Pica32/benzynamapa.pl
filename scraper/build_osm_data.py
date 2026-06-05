#!/usr/bin/env python3
"""
build_osm_data.py — OSM stacje + realne ceny z cenapaliw.pl (Polsko)

Strategie:
  1. Z OSM Overpass stáhne všechny čerpací stanice v Polsku.
  2. Ze cenapaliw.pl scrapuje najtańsze stacje dla każdego paliva
     a każdego województwa (16 woj. × 4 paliva = 64 requesty).
  3. Páruje OSM stanice ↔ cenapaliw.pl přes jméno+město nebo GPS (<500 m).
  4. Nenamatchované OSM stanice dostanou průměr + brand-offset.
  5. Zapisuje JSON do web/public/data/.
"""
import sys, requests, json, os, math, re, time, unicodedata
sys.stdout.reconfigure(encoding='utf-8')
from datetime import datetime, timezone, timedelta
import statistics
from bs4 import BeautifulSoup

OVERPASS_ENDPOINTS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
]
# Nodes + ways (čerpačky jako polygon) — víc stanic
QUERY_PL = '''[out:json][timeout:150];
area["ISO3166-1"="PL"]->.pl;
(
  node["amenity"="fuel"](area.pl);
  way["amenity"="fuel"](area.pl);
);
out center;'''
GPS_CACHE    = os.path.join(os.path.dirname(__file__), 'gps_cache_pl.json')
OUT_DIR      = os.path.join(os.path.dirname(__file__), '..', 'web', 'public', 'data')
HISTORY_FILE = os.path.join(os.path.dirname(__file__), 'history_pl.json')
CENAPALIW    = 'https://cenapaliw.pl'  # POZOR: NE www.cenapaliw.pl — www redirektuje na homepage a ztrácí cestu
EPETROL      = 'https://www.e-petrol.pl'

H = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36',
    'Accept-Language': 'pl-PL,pl;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
}

OSM_HEADERS = {
    'User-Agent': 'BenzynaMAPA/1.0 (benzynamapa.pl; fuel price tracker)',
    'Accept': '*/*',
}

VOIVODESHIPS = [
    'dolno-slaskie', 'kujawsko-pomorskie', 'lubelskie', 'lubuskie',
    'lodzkie', 'malopolskie', 'mazowieckie', 'opolskie', 'podkarpackie',
    'podlaskie', 'pomorskie', 'slaskie', 'swietokrzyskie',
    'warminsko-mazurskie', 'wielkopolskie', 'zachodniopomorskie',
]

# cenapaliw.pl vrací stejná data pro všechna paliva bez JS
# → spolehlivě scrapeujeme jen e95 (default), ostatní jsou odhady
FUEL_ENDPOINTS = {
    'pb95': 'e95',
}

# Validační rozsahy cen v PLN/l
PRICE_RANGE: dict[str, tuple[float, float]] = {
    'pb95': (5.0, 10.0),
    'pb98': (5.5, 11.0),
    'on':   (5.0, 10.0),
    'lpg':  (2.0,  4.5),
}

BRAND_OFFSET = {
    'shell':     +0.35, 'bp':        +0.30,
    'circle k':  +0.25, 'circlek':   +0.25, 'statoil': +0.25,
    'orlen':     +0.05, 'lotos':     +0.05,
    'moya':      -0.15, 'huzar':     -0.20,
    'amic':      -0.10, 'neste':     +0.10,
    'total':     +0.10, 'auchan':    -0.25,
    'makro':     -0.20, 'leroy merlin': -0.15,
    'biedronka': -0.20, 'lidl':      -0.20,
}

LPG_BRANDS = {'orlen', 'lotos', 'bp', 'moya', 'huzar', 'amic', 'circle k'}
PREMIUM_BRANDS = {'shell', 'bp', 'circle k', 'orlen', 'neste'}

FALLBACK_AVG = {'pb95': 6.25, 'on': 7.10, 'pb98': 7.10, 'lpg': 3.30}  # aktualizováno 2026-05-21

# Zdroje považované za "reálné" (ne odhad) — pro statistiky, mapu, řazení.
# 'community' = ceny nahlášené uživateli benzynamapa.pl (nejaktuálnější, ověřené potvrzením).
REAL_SOURCES = ('cenapaliw.pl', 'community')


# ── helpers ────────────────────────────────────────────────────────────────────

def haversine_m(lat1, lon1, lat2, lon2) -> float:
    R = 6371000
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = math.radians(lat2 - lat1), math.radians(lon2 - lon1)
    a = math.sin(dp/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2 * R * math.asin(math.sqrt(a))


def normalize(text: str) -> str:
    """Normalize text for fuzzy matching: lowercase, strip diacritics."""
    nfkd = unicodedata.normalize('NFKD', text)
    ascii_text = ''.join(c for c in nfkd if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9 ]+', ' ', ascii_text.lower()).strip()


def parse_price_pln(text: str):
    if not text:
        return None
    cleaned = re.sub(r'[^\d,.]', '', str(text)).replace(',', '.')
    if not cleaned or cleaned in ('.', ','):
        return None
    try:
        v = float(cleaned)
        return round(v, 2) if 2.0 <= v <= 14.0 else None
    except ValueError:
        return None


def round_price(v: float) -> float:
    return round(round(v / 0.01) * 0.01, 2)


def load_json(path: str) -> dict:
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def save_json(path: str, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))


# ── OSM ────────────────────────────────────────────────────────────────────────

def fetch_osm_stations() -> list:
    print("Stahuji stanice z OSM (Polsko, nodes+ways)…")
    for endpoint in OVERPASS_ENDPOINTS:
        for attempt in range(2):
            try:
                r = requests.post(endpoint, data={'data': QUERY_PL}, headers=OSM_HEADERS, timeout=200)
                r.raise_for_status()
                elements = r.json().get('elements', [])
                # Ways mají center místo lat/lon — normalizuj
                nodes = []
                for el in elements:
                    if el.get('type') == 'way':
                        center = el.get('center', {})
                        if center.get('lat') and center.get('lon'):
                            el['lat'] = center['lat']
                            el['lon'] = center['lon']
                            nodes.append(el)
                    elif el.get('lat') and el.get('lon'):
                        nodes.append(el)
                print(f"  → {len(nodes)} stanic z OSM ({endpoint.split('/')[2]})")
                return nodes
            except Exception as e:
                print(f"  ✗ {endpoint.split('/')[2]} attempt {attempt+1}: {e}")
                if attempt == 0:
                    time.sleep(15)
    return []


# ── e-petrol.pl — národní průměrné ceny ────────────────────────────────────────

def fetch_epetrol_averages() -> dict:
    """Stáhne **národní + regionální** průměry z e-petrol.pl/notowania/rynek-krajowy/ceny-stacje-paliw.

    Vrací: {
      'national': {'pb95': 6.42, 'pb98': 6.97, 'on': 6.82, 'lpg': 3.68},
      'regional': {'mazowieckie': {'pb95': 6.45, 'on': 6.80, 'lpg': 3.70}, ...}
    }

    e-petrol.pl aktualizuje národní průměry **denně** (lepší než nás 3×/den).
    Regionální průměry **týdně** — perfektní pro brand-offset výpočty per region.
    """
    try:
        r = requests.get(f'{EPETROL}/notowania/rynek-krajowy/ceny-stacje-paliw', headers=H, timeout=20)
        soup = BeautifulSoup(r.text, 'html.parser')
        result: dict = {'national': {}, 'regional': {}}

        tables = soup.find_all('table')
        if not tables:
            return result

        # PRIMARY (table 0): Pb98 Pb95 ON LPG headers, latest row je aktuální
        for t in tables:
            rows = t.find_all('tr')
            if not rows:
                continue
            headers = [c.get_text(strip=True).lower() for c in rows[0].find_all(['th', 'td'])]
            # Národní průměry: pb98 + pb95 + on + lpg
            if all(h in headers for h in ['pb98', 'pb95', 'on', 'lpg']) and len(headers) <= 6:
                if len(rows) >= 2:
                    cells = [c.get_text(strip=True) for c in rows[1].find_all(['th', 'td'])]
                    h2c = dict(zip(headers, cells))
                    for fuel in ('pb95', 'pb98', 'on', 'lpg'):
                        v = parse_price_pln(h2c.get(fuel, ''))
                        pmin, pmax = PRICE_RANGE.get(fuel, (1.0, 15.0))
                        if v and pmin <= v <= pmax:
                            result['national'][fuel] = v
            # Regionální průměry: po sloupcích Aktualizacja|Województwo|Pb95|ON|LPG
            elif 'województwo' in headers:
                fuel_cols = {}
                for i, h in enumerate(headers):
                    if h in ('pb95', 'pb98', 'on', 'lpg'):
                        fuel_cols[h] = i
                voiv_col = headers.index('województwo') if 'województwo' in headers else None
                if voiv_col is None:
                    continue
                for row in rows[1:]:
                    cells = [c.get_text(strip=True) for c in row.find_all(['th', 'td'])]
                    if len(cells) <= voiv_col:
                        continue
                    voiv_name = cells[voiv_col].lower()
                    if voiv_name not in result['regional']:
                        result['regional'][voiv_name] = {}
                    for fuel, idx in fuel_cols.items():
                        if idx < len(cells):
                            v = parse_price_pln(cells[idx])
                            pmin, pmax = PRICE_RANGE.get(fuel, (1.0, 15.0))
                            if v and pmin <= v <= pmax:
                                result['regional'][voiv_name][fuel] = v

        if result['national']:
            print(f"  → e-petrol.pl národní: {result['national']}")
        if result['regional']:
            print(f"  → e-petrol.pl regionální: {len(result['regional'])} vojvodství")
        return result
    except Exception as e:
        print(f"  ✗ e-petrol.pl: {e}")
        return {'national': {}, 'regional': {}}


# ── komunitní ceny (Supabase) — hlášení od uživatelů benzynamapa.pl ─────────────

def fetch_community_prices() -> dict:
    """Načte komunitní hlášení cen ze Supabase (posledních 24h) a agreguje
    MEDIÁN per station_id + palivo (medián odolá jednomu chybnému hlášení).

    Vrací {station_id: {pb95?, pb98?, on?, lpg?}} — klíč je NAŠE station_id
    (pl_* / cp_*), takže merge je přímý, bez GPS párování.
    Vyžaduje env SUPABASE_URL + SUPABASE_SERVICE_KEY; jinak {} (graceful skip).
    """
    url = os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_KEY')
    if not url or not key:
        print("  → komunitní ceny: SUPABASE env nenastaveno (přeskočeno)")
        return {}

    cutoff = (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat()
    try:
        r = requests.get(
            f"{url.rstrip('/')}/rest/v1/price_submissions",
            params={
                'select': 'station_id,fuel_type,price,confirmations',
                'submitted_at': f'gt.{cutoff}',
            },
            headers={'apikey': key, 'Authorization': f'Bearer {key}'},
            timeout=20,
        )
        if r.status_code != 200:
            print(f"  ✗ komunitní ceny HTTP {r.status_code}")
            return {}
        rows = r.json()
    except (requests.RequestException, ValueError) as e:
        print(f"  ✗ komunitní ceny: {e}")
        return {}

    valid_fuels = ('pb95', 'pb98', 'on', 'lpg')
    groups: dict = {}
    for row in rows:
        sid = row.get('station_id')
        ft = row.get('fuel_type')
        pr = row.get('price')
        if not sid or ft not in valid_fuels or pr is None:
            continue
        try:
            pr = float(pr)
        except (TypeError, ValueError):
            continue
        pmin, pmax = PRICE_RANGE.get(ft, (1.0, 15.0))
        if not (pmin <= pr <= pmax):
            continue
        groups.setdefault((sid, ft), []).append(pr)

    out: dict = {}
    for (sid, ft), vals in groups.items():
        out.setdefault(sid, {})[ft] = round(statistics.median(vals), 2)
    print(f"  → komunitní ceny: {len(out)} stanic z {len(rows)} hlášení (24h)")
    return out


# ── cenapaliw.pl scraper — /mapa/data (kompletní databáze, 1 request) ───────────

def fetch_mapa_data(session: requests.Session) -> list:
    """Stáhne KOMPLETNÍ databázi stanic cenapaliw.pl přes /mapa/data (1 POST).

    Od redesignu 2026-05-29 je cenapaliw JS mapa, která načítá všechna data
    z /mapa/data (POST, vyžaduje CSRF token + cookie ze stránky /mapa).
    Vrací ~5980 stanic; každá: {id, lat, lng, company, address, commune, county,
    link, price95, price98, priceDiesel, priceLpg, ...}. Cena = null, pokud
    stanice nemá aktuální hlášení (jen ~140 stanic má cenu).

    Mnohem robustnější než stará paginace: 1 request místo ~700 + GPS inline
    (žádné per-stanice detail fetche). Diagnostika při rozbití:
      curl -s URL/mapa | grep csrf-token   →  POST URL/mapa/data s tím tokenem.
    """
    # 1) GET /mapa — získej CSRF token + session cookie (PHPSESSID drží jar)
    try:
        rm = session.get(f'{CENAPALIW}/mapa', headers=H, timeout=25)
        m = re.search(r'name="csrf-token"\s+content="([^"]+)"', rm.text)
        csrf = m.group(1) if m else ''
    except (requests.Timeout, requests.ConnectionError) as e:
        print(f"  ✗ /mapa GET selhal: {e}")
        return []
    if not csrf:
        print("  ✗ /mapa: CSRF token nenalezen (změna struktury?)")
        return []

    # 2) POST /mapa/data — kompletní JSON pole stanic
    headers = dict(H)
    headers.update({
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': csrf,
        'Referer': f'{CENAPALIW}/mapa',
    })
    for attempt in range(3):
        try:
            r = session.post(f'{CENAPALIW}/mapa/data', headers=headers, timeout=40)
            if r.status_code == 200:
                data = r.json()
                return data if isinstance(data, list) else []
            if r.status_code in (429, 503):
                time.sleep(2 ** attempt)
                continue
            print(f"  ✗ /mapa/data HTTP {r.status_code}")
            return []
        except (requests.Timeout, requests.ConnectionError, ValueError) as e:
            print(f"  ✗ /mapa/data pokus {attempt+1}: {e}")
            time.sleep(2 ** attempt)
    return []


def fetch_cenapaliw_directory() -> list:
    """Normalizovaný seznam VŠECH stanic z /mapa/data (s validní GPS v PL).
    Každá: {cp_id, name, city, address, county, lat, lng, pb95, pb98, on, lpg}
    (ceny = None, pokud cenapaliw nehlásí). Použito pro dvě věci:
      1. reálné ceny → prices_from_directory()  (stanice s ≥1 cenou)
      2. doplnění metadat OSM → enrich_osm_metadata()  (OSM má ~57 % stanic bez města)

    Zdroj: 1 POST request. Historie: do 2026-05 paginovaný HTML scrape
    /stationer/... (rozbil se redesignem), od 2026-06-04 /mapa/data.
    """
    print("Scrapuji cenapaliw.pl /mapa/data…")
    session = requests.Session()
    raw = fetch_mapa_data(session)
    print(f"  → /mapa/data: {len(raw)} stanic v databázi cenapaliw")

    fuel_fields = [('pb95', 'price95'), ('pb98', 'price98'),
                   ('on', 'priceDiesel'), ('lpg', 'priceLpg')]
    out: list = []
    for st in raw:
        cp_id = st.get('id')
        lat, lng = st.get('lat'), st.get('lng')
        if cp_id is None or lat is None or lng is None:
            continue
        try:
            latf, lngf = float(lat), float(lng)
        except (TypeError, ValueError):
            continue
        if not (48.5 <= latf <= 55.5 and 13.5 <= lngf <= 24.5):  # PL bbox sanity
            continue

        rec = {
            'cp_id': str(cp_id),
            'name': (st.get('company') or '').strip(),
            'city': (st.get('commune') or '').strip(),
            'address': (st.get('address') or '').strip(),
            'county': (st.get('county') or '').strip(),
            'lat': latf, 'lng': lngf,
            'pb95': None, 'pb98': None, 'on': None, 'lpg': None,
        }
        for our_key, cp_key in fuel_fields:
            v = st.get(cp_key)
            if v is None:
                continue
            try:
                v = round(float(v), 2)
            except (TypeError, ValueError):
                continue
            pmin, pmax = PRICE_RANGE[our_key]
            if pmin <= v <= pmax:
                rec[our_key] = v
        out.append(rec)
    return out


def prices_from_directory(directory: list) -> dict:
    """Z directory vybere stanice s ALESPOŇ JEDNOU cenou → {cp_id: rec}."""
    by_id: dict = {}
    counts = {'pb95': 0, 'pb98': 0, 'on': 0, 'lpg': 0}
    for rec in directory:
        has = False
        for f in ('pb95', 'pb98', 'on', 'lpg'):
            if rec.get(f) is not None:
                counts[f] += 1
                has = True
        if has:
            by_id[rec['cp_id']] = rec
    print(f"  → {len(by_id)} stanic s reálnou cenou "
          f"(pb95={counts['pb95']}, pb98={counts['pb98']}, on={counts['on']}, lpg={counts['lpg']})")
    return by_id


def scrape_all_prices() -> dict:
    """Zpětně kompatibilní obal: fetch + filtr na stanice s cenou."""
    return prices_from_directory(fetch_cenapaliw_directory())


# ── matching ───────────────────────────────────────────────────────────────────

def build_osm_indexes(osm_nodes: list):
    """Vybuildi dva indexy OSM pro rychlé vyhledávání."""
    by_name_city = {}
    for node in osm_nodes:
        tags = node.get('tags', {})
        name = tags.get('name', '')
        city = tags.get('addr:city', tags.get('addr:place', ''))
        if name and city:
            key = normalize(name) + '|' + normalize(city)
            by_name_city.setdefault(key, []).append(node)
    return by_name_city


JUNK_NAMES = {'inne', 'aby zaktualizowac cene', 'kliknij na stacje', 'pp', ''}

def clean_brand_name(name: str) -> str:
    """Normalizuj značku: 'Circle K (Statoil)' → 'circle k'"""
    n = normalize(name)
    n = re.sub(r'\(.*?\)', '', n).strip()
    return n


def build_osm_indexes(osm_nodes: list):
    """Vybuildi indexy OSM: name+city a brand+city."""
    by_name_city = {}
    by_brand_city = {}
    for node in osm_nodes:
        tags = node.get('tags', {})
        name = tags.get('name', '')
        city = tags.get('addr:city', tags.get('addr:place', ''))
        brand = tags.get('brand', tags.get('operator', ''))

        if name and city:
            key = normalize(name) + '|' + normalize(city)
            by_name_city.setdefault(key, []).append(node)

        if brand and city:
            key = normalize(brand) + '|' + normalize(city)
            by_brand_city.setdefault(key, []).append(node)

    return by_name_city, by_brand_city


GPS_MATCH_RADIUS_M = 200  # max vzdálenost cenapaliw GPS ↔ OSM uzel (shoda / dedup)


def _build_gps_grid(osm_nodes: list, cell: float = 0.02):
    """Prostorová mřížka OSM uzlů (buňka ~2 km) pro rychlý nearest-neighbor."""
    grid: dict = {}
    for n in osm_nodes:
        la, lo = n.get('lat'), n.get('lon')
        if la is None or lo is None:
            continue
        grid.setdefault((round(la / cell), round(lo / cell)), []).append(n)
    return grid, cell


def _nearest_osm(lat: float, lng: float, grid: dict, cell: float, radius_m: float):
    """Najde nejbližší OSM uzel do radius_m (prohledá 3×3 buňky kolem bodu)."""
    kla, klo = round(lat / cell), round(lng / cell)
    best, best_d = None, float(radius_m)
    for dla in (-1, 0, 1):
        for dlo in (-1, 0, 1):
            for n in grid.get((kla + dla, klo + dlo), ()):
                d = haversine_m(lat, lng, n['lat'], n['lon'])
                if d < best_d:
                    best_d, best = d, n
    return best


def match_prices_to_osm(directory: list, osm_nodes: list):
    """Sloučí CELOU cenapaliw /mapa/data databázi s OSM přes GPS (≤ GPS_MATCH_RADIUS_M).

    Pro každou cenapaliw stanici:
      - má OSM partnera (volného) + reálnou cenu → cena se přiřadí OSM (price_map)
      - má OSM partnera, bez ceny → metadata řeší enrich_osm_metadata(), nepřidává se
      - NEMÁ OSM partnera (díra v OSM) → standalone (přidá se jako NOVÁ stanice):
          * s reálnou cenou → zobrazí reálnou cenu
          * bez ceny → dostane odhad (jako OSM stanice bez reálné ceny)
    Standalone se deduplikují i mezi sebou (žádné dvojí markery).

    Vrací (price_map, standalone).
    """
    FUELS = ('pb95', 'pb98', 'on', 'lpg')
    grid, cell = _build_gps_grid(osm_nodes)
    price_map: dict = {}
    used_osm: set = set()
    standalone: list = []
    added_grid: dict = {}  # GPS index už přidaných standalone (dedup mezi sebou)

    def near_added(lat: float, lng: float) -> bool:
        kla, klo = round(lat / cell), round(lng / cell)
        for dla in (-1, 0, 1):
            for dlo in (-1, 0, 1):
                for (la, lo) in added_grid.get((kla + dla, klo + dlo), ()):
                    if haversine_m(lat, lng, la, lo) < GPS_MATCH_RADIUS_M:
                        return True
        return False

    # Stanice s cenou zpracuj PRVNÍ — aby reálná cena nikdy nepadla na dedup s odhadovou
    ordered = sorted(directory, key=lambda r: not any(r.get(f) is not None for f in FUELS))
    for rec in ordered:
        has_price = any(rec.get(f) is not None for f in FUELS)
        node = _nearest_osm(rec['lat'], rec['lng'], grid, cell, GPS_MATCH_RADIUS_M)

        if node is not None:
            # OSM stanice je blízko
            if has_price and node['id'] not in used_osm:
                used_osm.add(node['id'])
                price_map[node['id']] = {f: rec.get(f) for f in FUELS}
                continue
            if not has_price:
                continue  # bez ceny → jen enrichment metadat, nepřidávat (dup s OSM)
            # má cenu, ale OSM partner už obsazený jinou stanicí → spadne do standalone
        # node is None (díra v OSM) NEBO obsazený OSM + reálná cena → standalone
        if near_added(rec['lat'], rec['lng']):
            continue
        standalone.append(dict(rec))
        added_grid.setdefault((round(rec['lat'] / cell), round(rec['lng'] / cell)), []).append(
            (rec['lat'], rec['lng']))

    priced_sa = sum(1 for s in standalone if any(s.get(f) is not None for f in FUELS))
    print(f"  → GPS match: {len(price_map)} cen → OSM; "
          f"standalone {len(standalone)} ({priced_sa} s cenou + {len(standalone) - priced_sa} odhad)")
    return price_map, standalone


ENRICH_RADIUS_M = 200  # doplnění města/regionu z cenapaliw na OSM uzel do 200 m

def enrich_osm_metadata(osm_nodes: list, directory: list) -> dict:
    """GPS-matchuje VŠECHNY cenapaliw stanice (i bez ceny) → OSM a vrací doplňky
    metadat (city, region) pro OSM uzly. Cíl: doplnit chybějící město — OSM má
    ~57 % stanic bez addr:city, což láme stránky měst i lokální vyhledávání.

    Doplňuje JEN geografická pole (město/region), která sdílí každá stanice
    v okolí do 200 m. Brand/adresu záměrně NE (riziko špatného přiřazení)."""
    grid, cell = _build_gps_grid(osm_nodes)
    enrich: dict = {}
    for rec in directory:
        if not rec.get('city'):
            continue
        node = _nearest_osm(rec['lat'], rec['lng'], grid, cell, ENRICH_RADIUS_M)
        if node is None:
            continue
        enrich.setdefault(node['id'], {'city': rec['city'], 'region': rec.get('county', '')})
    print(f"  → Doplněno metadat (město/region) pro {len(enrich)} OSM stanic")
    return enrich


# ── build records ──────────────────────────────────────────────────────────────

def detect_brand(tags: dict) -> str:
    for key in ('brand', 'operator', 'name'):
        v = tags.get(key, '').strip()
        if v:
            return v
    return 'Stacja paliw'


def compute_regional_offsets(regional_avgs: dict) -> dict:
    """Z e-petrol regionálních průměrů spočítá RELATIVNÍ odchylku regionu od
    průměru všech regionů (per palivo).

    Proč relativní: e-petrol regionální tabulka má absolutní hladinu nekonzistentní
    s národní (~+0,8 zł výš — jiná metrika), ALE rozdíly MEZI regiony jsou reálný
    signál (Mazowieckie dráž, Łódzkie levněji). Aplikujeme tedy jen odchylku od
    regionálního průměru na národní základ → reálná regionální variace bez inflace.

    Vrací {region_normalized: {fuel: offset}}, offset capnutý na ±0,30 zł.
    """
    if not regional_avgs:
        return {}
    fuels = ('pb95', 'pb98', 'on', 'lpg')
    means = {}
    for f in fuels:
        vals = [v[f] for v in regional_avgs.values() if v.get(f)]
        if vals:
            means[f] = sum(vals) / len(vals)
    out: dict = {}
    for region, v in regional_avgs.items():
        rn = normalize(region)
        ro: dict = {}
        for f in fuels:
            if v.get(f) and f in means:
                ro[f] = round(max(-0.30, min(0.30, v[f] - means[f])), 2)
        if ro:
            out[rn] = ro
    return out


def build_station_record(node: dict, prices: dict | None, now_iso: str, fallback_avgs: dict,
                         regional_offsets: dict | None = None, region_name: str = ''):
    tags = node.get('tags', {})
    osm_id = str(node['id'])
    brand = detect_brand(tags)
    brand_key = brand.lower()

    offset = 0.0
    for k, v in BRAND_OFFSET.items():
        if k in brand_key:
            offset = v
            break

    if not prices:
        prices = {}
        source = 'estimate'
    else:
        source = 'cenapaliw.pl'

    # Regionální odchylka (relativní, na národní základ) — reálná regionální variace
    reg_off = {}
    if regional_offsets and region_name:
        reg_off = regional_offsets.get(normalize(region_name), {})

    # Doplň chybějící paliva odhadem — validuj rozsah ceny
    def fill(fuel: str, base: float, use_offset: bool = True) -> float | None:
        p = prices.get(fuel)
        pmin, pmax = PRICE_RANGE[fuel]
        if p is not None and pmin <= p <= pmax:
            return p  # reálná cena z cenapaliw
        # Odhad — pokud base je nesmyslná (mimo range), použij FALLBACK_AVG
        # Why: pokud scraper zachytí 1 corrupted real cenu (např. LPG 6.38 zł),
        # avgs[fuel] se rovná té hodnotě a propíše se do všech 8 600 stanic.
        if not (pmin <= base <= pmax):
            base = FALLBACK_AVG[fuel]
        # Regionální posun základu (Mazowieckie +, Łódzkie − …)
        regional_base = base + reg_off.get(fuel, 0.0)
        if not (pmin <= regional_base <= pmax):
            regional_base = base
        est = round_price(regional_base + (offset if use_offset else 0.0))
        # Sanity check estimate — pokud i s offsetem je mimo range, použij FALLBACK
        if not (pmin <= est <= pmax):
            est = FALLBACK_AVG[fuel]
        return est

    prices['pb95'] = fill('pb95', fallback_avgs['pb95'])
    prices['on']   = fill('on',   fallback_avgs['on'],  use_offset=True)
    prices['pb98'] = fill('pb98', fallback_avgs['pb98']) if any(b in brand_key for b in PREMIUM_BRANDS) else None
    prices['lpg']  = fill('lpg',  fallback_avgs['lpg'], use_offset=False) if any(b in brand_key for b in LPG_BRANDS) else None

    name = tags.get('name', brand)
    city = tags.get('addr:city', tags.get('addr:place', ''))
    region = tags.get('addr:province', tags.get('is_in:region', ''))
    street = tags.get('addr:street', '')
    housenumber = tags.get('addr:housenumber', '')
    address = f"{street} {housenumber}".strip() or city

    services = []
    if tags.get('fuel:lpg') == 'yes': services.append('lpg')
    if tags.get('fuel:adblue') == 'yes': services.append('adblue')
    if tags.get('car_wash') == 'yes': services.append('car_wash')

    station = {
        'id': f'pl_{osm_id}',
        'name': name,
        'brand': brand,
        'lat': node['lat'],
        'lng': node['lon'],
        'address': address,
        'city': city,
        'region': region,
        'services': services,
        'opening_hours': tags.get('opening_hours', ''),
    }

    price_rec = {
        'station_id': f'pl_{osm_id}',
        'pb95': prices.get('pb95'),
        'pb98': prices.get('pb98'),
        'on':   prices.get('on'),
        'lpg':  prices.get('lpg'),
        'source': source,
        'reported_at': now_iso,
    }

    return station, price_rec


def build_standalone_record(sc: dict, now_iso: str, fallback_avgs: dict,
                            regional_offsets: dict | None = None):
    """Stanice z cenapaliw, která nemá partnera v OSM → přidá se jako samostatná.
    id má prefix 'cp_' (vs 'pl_' u OSM).
      - má reálnou cenu → source='cenapaliw.pl', zobrazí reálné ceny
      - bez ceny → source='estimate', dopočítá odhad (značka + národní průměr +
        regionální odchylka) — STEJNOU metodikou jako OSM stanice."""
    brand = sc.get('name') or 'Stacja paliw'
    brand_key = brand.lower()
    sid = f"cp_{sc['cp_id']}"
    has_real = any(sc.get(f) is not None for f in ('pb95', 'pb98', 'on', 'lpg'))

    avgs = dict(fallback_avgs)  # národní průměry (jako OSM odhady)
    reg_off = {}
    if regional_offsets and sc.get('county'):
        reg_off = regional_offsets.get(normalize(sc['county']), {})

    offset = 0.0
    for k, v in BRAND_OFFSET.items():
        if k in brand_key:
            offset = v
            break

    def est(fuel: str, use_offset: bool = True) -> float:
        pmin, pmax = PRICE_RANGE[fuel]
        base = avgs.get(fuel, FALLBACK_AVG[fuel])
        if not (pmin <= base <= pmax):
            base = FALLBACK_AVG[fuel]
        base += reg_off.get(fuel, 0.0)  # regionální posun
        if not (pmin <= base <= pmax):
            base = avgs.get(fuel, FALLBACK_AVG[fuel])
        v = round_price(base + (offset if use_offset else 0.0))
        return v if pmin <= v <= pmax else FALLBACK_AVG[fuel]

    if has_real:
        source = 'cenapaliw.pl'
        pb95, pb98, on, lpg = sc.get('pb95'), sc.get('pb98'), sc.get('on'), sc.get('lpg')
    else:
        source = 'estimate'
        pb95 = est('pb95')
        on   = est('on')
        pb98 = est('pb98') if any(b in brand_key for b in PREMIUM_BRANDS) else None
        lpg  = est('lpg', use_offset=False) if any(b in brand_key for b in LPG_BRANDS) else None

    services = []
    if lpg is not None:
        services.append('lpg')

    station = {
        'id': sid,
        'name': brand,
        'brand': brand,
        'lat': sc['lat'],
        'lng': sc['lng'],
        'address': sc.get('address') or sc.get('city', ''),
        'city': sc.get('city', ''),
        'region': sc.get('county', ''),
        'services': services,
        'opening_hours': '',
    }
    price_rec = {
        'station_id': sid,
        'pb95': pb95,
        'pb98': pb98,
        'on':   on,
        'lpg':  lpg,
        'source': source,
        'reported_at': now_iso,
    }
    return station, price_rec


# ── stats & history ────────────────────────────────────────────────────────────

def compute_stats(prices_list: list, stations_list: list, now_iso: str) -> dict:
    def real_vals(fuel):
        return [p[fuel] for p in prices_list if p.get(fuel) and p.get('source') in REAL_SOURCES]

    def avg(lst):
        return round(sum(lst) / len(lst), 2) if lst else FALLBACK_AVG.get('pb95', 6.38)

    def median(lst):
        """Median je odolnější vůči outlierům než průměr.
        Why: 1 corrupted scrape (např. 6.38 zł LPG místo 2.89) by zkreslil průměr.
        Median ignoruje extrémní hodnoty."""
        if not lst:
            return 0
        s = sorted(lst)
        n = len(s)
        return round((s[n // 2] if n % 2 else (s[n // 2 - 1] + s[n // 2]) / 2), 2)

    def robust_avg(fuel):
        """Median místo průměru + sanity check vs FALLBACK_AVG (max ±35% odchylka)."""
        vals = real_vals(fuel)
        if not vals:
            return FALLBACK_AVG[fuel]
        med = median(vals)
        fb = FALLBACK_AVG[fuel]
        # Sanity check — pokud median >35% odchylka od fallback, máme bug nebo crash trhu
        if abs(med - fb) / fb > 0.35:
            print(f"  ⚠ Anomaly: {fuel} median {med:.2f} zł je >35% od fallback {fb:.2f} — používám fallback")
            return fb
        return med

    avgs = {fuel: robust_avg(fuel) for fuel in ('pb95', 'pb98', 'on', 'lpg')}

    def cheapest(fuel):
        # Sanity: odmítni ceny <85 % průměru — extrémní outliery (např. cenapaliw chyba
        # s PB95==ON==5.19 zł). Reálné akce/slevy nikdy nejdou pod ~15 % národního průměru.
        avg_val = avgs.get(fuel) or FALLBACK_AVG.get(fuel, 0)
        min_ok = avg_val * 0.85 if avg_val else 0
        vals = [(p[fuel], p['station_id']) for p in prices_list
                if p.get(fuel) and p.get('source') in REAL_SOURCES and p[fuel] >= min_ok]
        if not vals:
            return {'price': FALLBACK_AVG.get(fuel, 0), 'station_id': '', 'city': ''}
        best = min(vals, key=lambda x: x[0])
        city = next((s['city'] for s in stations_list if s['id'] == best[1]), '')
        return {'price': best[0], 'station_id': best[1], 'city': city}

    # Historie
    history = load_json(HISTORY_FILE).get('history', [])
    trend = {'pb95': 0.0, 'on': 0.0, 'lpg': 0.0}
    if len(history) >= 7:
        old = history[-7]
        for f in trend:
            trend[f] = round(avgs[f] - old.get(f, avgs[f]), 2)

    today = now_iso[:10]
    if not history or history[-1].get('date') != today:
        history.append({'date': today, 'pb95': avgs['pb95'], 'on': avgs['on'], 'lpg': avgs['lpg'], 'pb98': avgs['pb98']})
    history = history[-95:]
    save_json(HISTORY_FILE, {'history': history})

    updated = sum(1 for p in prices_list if p.get('source') in REAL_SOURCES)

    return {
        'last_updated': now_iso,
        'averages': avgs,
        'cheapest_today': {f: cheapest(f) for f in ('pb95', 'on', 'lpg')},
        'trend_7d': trend,
        'total_stations': len(stations_list),
        'stations_updated_today': updated,
    }


def build_map_data(stations: list, prices_list: list) -> dict:
    """
    Ultra-komprimovaný formát pro mapu.

    Optimalizace oproti naivnímu JSON:
    - Vynechají se null hodnoty v p (n98, lpg)
    - Estimates nemají 'at' timestamp (zbytečné, vždy stale)
    - region se vynechá (v PL OSM datech skoro vždy prázdné)
    - opening_hours se vynechá pokud prázdné
    - services se vynechá pokud prázdné
    - src zkráceno: 'cenapaliw.pl' → 'r', 'estimate' → 'e'
    - lat/lng 5 des. míst (přesnost 1 m)
    - 'at' jen datum+čas bez timezone (zkrátí ~6 znaků na záznam)

    Cíl: ~1.0-1.2 MB místo 2.6 MB (úspora ~55%)
    """
    price_map = {p['station_id']: p for p in prices_list}
    result = []

    for s in stations:
        p = price_map.get(s['id'])

        entry = {
            'id': s['id'],
            'name': s['name'],
            'brand': s['brand'],
            'lat': round(s['lat'], 5),
            'lng': round(s['lng'], 5),
        }

        # Vynech prázdné řetězce — šetří místo
        if s.get('address'): entry['address'] = s['address']
        if s.get('city'):    entry['city']    = s['city']
        if s.get('services'): entry['services'] = s['services']
        if s.get('opening_hours'): entry['opening_hours'] = s['opening_hours']

        if p:
            src_short = 'r' if p['source'] in REAL_SOURCES else 'e'
            price_entry: dict = {'src': src_short}

            # Vynech null hodnoty
            if p.get('pb95') is not None: price_entry['n95'] = p['pb95']
            if p.get('on')   is not None: price_entry['on']  = p['on']
            if p.get('lpg')  is not None: price_entry['lpg'] = p['lpg']
            if p.get('pb98') is not None: price_entry['n98'] = p['pb98']

            # Timestamp jen pro reálné ceny (odhady jsou vždy 'stale')
            if src_short == 'r' and p.get('reported_at'):
                # Zkrátit: '2026-05-07T05:56:05+00:00' → '2026-05-07T05:56'
                price_entry['at'] = p['reported_at'][:16]

            entry['p'] = price_entry

        result.append(entry)

    return {'stations': result}


# ── main ───────────────────────────────────────────────────────────────────────

def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    now_iso = datetime.now(timezone.utc).isoformat(timespec='seconds')
    print(f"=== BenzynaMAPA scraper — {now_iso} ===")

    # 1. OSM
    osm_nodes = fetch_osm_stations()
    if not osm_nodes:
        print("VAROVÁNÍ: Žádné OSM stanice. Používám data z cache pokud existují.")

    # 2. cenapaliw.pl /mapa/data — kompletní databáze (ceny + metadata) 1 requestem
    directory = fetch_cenapaliw_directory()
    scraped = prices_from_directory(directory)

    # 2b. ROBUSTNOST: když klíčový zdroj úplně selže (OSM down NEBO cenapaliw
    # /mapa/data prázdné) a už existují vygenerovaná data, NEPŘEPISUJ je
    # all-estimaty / torzem — zachovej poslední dobrá data a skonči.
    have_prev = os.path.exists(os.path.join(OUT_DIR, 'prices_latest.json'))
    if have_prev and (not osm_nodes or not directory):
        why = 'OSM nedostupné' if not osm_nodes else 'cenapaliw /mapa/data prázdné'
        print(f"VAROVÁNÍ: {why} — zachovávám předchozí data (nepřepisuji). Konec.")
        return

    # 3. e-petrol.pl průměry (lepší než historické fallbacky)
    epetrol_avgs = fetch_epetrol_averages()

    # 4. Sloučení celé cenapaliw databáze → OSM (GPS): ceny na OSM + standalone
    #    (cenapaliw stanice, které v OSM chybí — přidáme je jako nové stanice)
    price_map, standalone_cp = match_prices_to_osm(directory, osm_nodes) if osm_nodes and directory else ({}, [])

    # 4b. Doplnění metadat (město/region) na OSM stanice z celé cenapaliw databáze
    enrich_map = enrich_osm_metadata(osm_nodes, directory) if osm_nodes and directory else {}

    # 5. Fallback průměry: e-petrol > historie > FALLBACK_AVG
    hist = load_json(HISTORY_FILE).get('history', [])
    fallback = FALLBACK_AVG.copy()
    if hist:
        last = hist[-1]
        for k in fallback:
            if last.get(k):
                fallback[k] = last[k]
    # e-petrol národní průměry přebijou historické (denní aktualizace > naše)
    nat = epetrol_avgs.get('national', {}) if isinstance(epetrol_avgs, dict) else {}
    for k, v in nat.items():
        if v:
            fallback[k] = v
    # e-petrol regionální průměry → relativní regionální odchylky (přesnější odhady)
    regional_avgs = epetrol_avgs.get('regional', {}) if isinstance(epetrol_avgs, dict) else {}
    regional_offsets = compute_regional_offsets(regional_avgs)
    if regional_offsets:
        print(f"  → Regionální odchylky pro {len(regional_offsets)} vojvodství (přesnější odhady)")

    # 5. Sestavení výsledků
    stations_list, prices_list = [], []
    enriched_count = 0
    for node in osm_nodes:
        prices = price_map.get(node['id'])
        # Region pro regionální odhad: OSM tag → enrichment z cenapaliw
        enr = enrich_map.get(node['id']) or {}
        tags = node.get('tags', {})
        region_name = tags.get('addr:province') or tags.get('is_in:region') or enr.get('region', '')
        s, p = build_station_record(node, prices, now_iso, fallback, regional_offsets, region_name)
        # Doplň chybějící město/region z cenapaliw (OSM má ~57 % stanic bez města)
        if enr:
            if not s['city'] and enr.get('city'):
                s['city'] = enr['city']
                enriched_count += 1
            if not s.get('region') and enr.get('region'):
                s['region'] = enr['region']
        stations_list.append(s)
        prices_list.append(p)
    if enriched_count:
        print(f"  → Doplněno město u {enriched_count} OSM stanic (dříve prázdné)")

    # 5b. Standalone cenapaliw stanice (chybí v OSM) → přidáme jako nové stanice.
    #     S reálnou cenou ji zobrazíme, bez ceny dostane odhad (jako OSM stanice).
    real_sa = 0
    for sc in standalone_cp:
        s, p = build_standalone_record(sc, now_iso, fallback, regional_offsets)
        if p['source'] == 'cenapaliw.pl':
            real_sa += 1
        stations_list.append(s)
        prices_list.append(p)
    if standalone_cp:
        print(f"  → +{len(standalone_cp)} standalone cenapaliw stanic mimo OSM "
              f"({real_sa} s reálnou cenou, {len(standalone_cp) - real_sa} s odhadem)")

    # 5c. Komunitní ceny (hlášení uživatelů) — NEJVYŠŠÍ priorita (nejaktuálnější,
    #     ověřené). Klíč = naše station_id → přímý merge, přebije odhad i cenapaliw.
    community = fetch_community_prices()
    if community:
        pr_index = {p['station_id']: p for p in prices_list}
        applied = 0
        for sid, fuels in community.items():
            p = pr_index.get(sid)
            if not p:
                continue
            for f, val in fuels.items():
                p[f] = val
            p['source'] = 'community'
            p['reported_at'] = now_iso
            applied += 1
        print(f"  → Komunitní ceny aplikovány na {applied} stanic (přebily odhad/cenapaliw)")

    print(f"  → Celkem {len(stations_list)} stanic")

    # 6. Stats
    stats = compute_stats(prices_list, stations_list, now_iso)
    print(f"  → Průměr PB95: {stats['averages']['pb95']:.2f} zł, ON: {stats['averages']['on']:.2f} zł")
    print(f"  → Stanic s reálnou cenou: {stats['stations_updated_today']}")

    # 7. Zápis JSON
    def write_json(fname, data):
        p = os.path.join(OUT_DIR, fname)
        with open(p, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
        print(f"  ✓ {fname} ({os.path.getsize(p) // 1024} KB)")

    write_json('stations_latest.json', {'stations': stations_list})
    write_json('prices_latest.json',   {'prices': prices_list})
    write_json('stats_latest.json',    stats)
    write_json('map_data.json',        build_map_data(stations_list, prices_list))
    write_json('history_90d.json',     load_json(HISTORY_FILE))

    print(f"=== Hotovo v {datetime.now(timezone.utc).isoformat(timespec='seconds')} ===")


if __name__ == '__main__':
    main()
