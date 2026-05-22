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
from datetime import datetime, timezone
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


# ── cenapaliw.pl scraper ───────────────────────────────────────────────────────

def scrape_voivodeship_page(voiv: str, fuel_code: str, page: int, session: requests.Session) -> list:
    """Stáhne ceny z jedné stránky vojvodství + paliva.

    URL struktura cenapaliw.pl (od 2026-05):
    - /stationer/{fuel_code}/{voiv}/wszystko/{page}  → konkrétní vojvodství, paginace
    - /stationer/{fuel_code}/wszystko/wszystko/{page} → celá PL
    Bez `/wszystko/{page}` na konci server vrací 301 redirect na homepage (top14).
    """
    url = f'{CENAPALIW}/stationer/{fuel_code}/{voiv}/wszystko/{page}'
    # Retry s exponential backoff (max 3 pokusy) — robust vs network glitches
    last_err = None
    for attempt in range(3):
        try:
            r = session.get(url, headers=H, timeout=25)
            if r.status_code == 200:
                break
            if r.status_code in (429, 503):  # rate limit / overload
                time.sleep(2 ** attempt)  # 1s, 2s, 4s
                continue
            return []  # 404, 5xx — neopakovat
        except (requests.Timeout, requests.ConnectionError) as e:
            last_err = e
            time.sleep(2 ** attempt)
    else:
        print(f"  ✗ {voiv}/{fuel_code} page {page} 3× failed: {last_err}")
        return []
    try:
        soup = BeautifulSoup(r.text, 'html.parser')
        results = []

        for row in soup.select('#price_table tr.table-row'):
            tds = row.select('td')
            if len(tds) < 2:
                continue
            td_name = tds[0]

            # Extrahuj jméno bez textu ze small tagu
            small = td_name.select_one('small')
            city = small.get_text(strip=True) if small else ''
            if small:
                small.decompose()
            b_tag = td_name.select_one('b')
            name = b_tag.get_text(strip=True) if b_tag else ''

            # Adresa z textu v td po name
            addr_lines = [t.strip() for t in td_name.strings if t.strip() and t.strip() != name]
            address = addr_lines[0] if addr_lines else ''

            # Cena
            b_price = tds[1].select_one('b')
            price = parse_price_pln(b_price.get_text() if b_price else '')

            # data-href pro identifikaci (cenapaliw URL slug stanice)
            href = row.get('data-href', '')

            if name and price:
                results.append({
                    'name': name, 'city': city, 'address': address,
                    'fuel': fuel_code, 'price': price,
                    'href': href, 'voiv': voiv,
                })
        return results
    except Exception as e:
        print(f"  ✗ {voiv}/{fuel_code} page {page}: {e}")
        return []


# Backward compat alias (pokud někde voláno bez page)
def scrape_voivodeship(voiv: str, fuel_code: str, session: requests.Session) -> list:
    return scrape_voivodeship_page(voiv, fuel_code, 0, session)


# Maximum stránek per vojvodství × fuel (cenapaliw.pl má max ~15 stránek per vojvodství)
MAX_PAGES_PER_VOIV = 20

# Maximum stránek celostátně (cenapaliw.pl má max ~16 stránek pro `wszystko/wszystko`)
MAX_PAGES_NATIONAL = 25


def scrape_all_prices() -> dict:
    """
    Vrací slovník: href → {name, city, address, pb95, pb98, on, lpg}.

    Strategie 2026-05-22+:
    1. PRIMARY: celostátní endpoint /stationer/{fuel}/wszystko/wszystko/{page}
       → ~210 unikátních stanic per palivo × 4 paliva = ~800 stanic celkem
       → 4 paliva × ~20 stránek = ~80 requestů (rychlé)
    2. SECONDARY: per-vojvodství pro dodatečné regionální stanice
       → 4 × 16 × ~10 stránek = ~640 requestů
       → typicky přidá dalších 100-200 stanic

    Celkem: ~1000+ unikátních stanic s reálnou cenou.
    Doba běhu: ~5-7 minut s 0.3s pauzou mezi requesty.

    Historie bugů (opraveno):
    - 2026-05: Stará verze scrape_voivodeship('pb95', 'e95', ...) — bug,
      arg prohozeny, jen 3 stanice
    - 2026-05-20: www.cenapaliw.pl redirektoval na homepage, opraveno
    - 2026-05-22: Přidán celostátní endpoint (7× víc stanic)
    """
    print("Scrapuji ceny z cenapaliw.pl…")
    session = requests.Session()
    by_href: dict[str, dict] = {}
    counts = {'pb95': 0, 'pb98': 0, 'on': 0, 'lpg': 0}

    # cenapaliw fuel codes
    fuel_map = [
        ('pb95', 'e95'),  # 95 (E10)
        ('pb98', 'e98'),  # 98 (E5)
        ('on',   'on'),   # Diesel
        ('lpg',  'lpg'),  # LPG
    ]

    def absorb(rows: list, fuel_key: str, pmin: float, pmax: float) -> int:
        """Přidá řádky do by_href, vrátí počet nových cen."""
        new = 0
        for row_data in rows:
            href = row_data['href'] or f"{row_data['name']}|{row_data['city']}"
            if not (pmin <= row_data['price'] <= pmax):
                continue
            if href not in by_href:
                by_href[href] = {
                    'name': row_data['name'], 'city': row_data['city'],
                    'address': row_data['address'],
                    'pb95': None, 'pb98': None, 'on': None, 'lpg': None,
                }
            if by_href[href][fuel_key] is None:
                by_href[href][fuel_key] = row_data['price']
                counts[fuel_key] += 1
                new += 1
        return new

    # PHASE 1: Celostátní endpoint (víc unikátních stanic)
    print("  Phase 1: celostátní endpoint /wszystko/wszystko/...")
    for fuel_key, fuel_code in fuel_map:
        pmin, pmax = PRICE_RANGE[fuel_key]
        seen_in_fuel: set[str] = set()
        national_new = 0
        for page in range(MAX_PAGES_NATIONAL):
            rows = scrape_voivodeship_page('wszystko', fuel_code, page, session)
            if not rows:
                break
            new_hrefs = {(r['href'] or f"{r['name']}|{r['city']}") for r in rows} - seen_in_fuel
            if not new_hrefs and page > 1:
                break  # paginace vyčerpaná
            seen_in_fuel |= {(r['href'] or f"{r['name']}|{r['city']}") for r in rows}
            national_new += absorb(rows, fuel_key, pmin, pmax)
            time.sleep(0.3)
        print(f"    {fuel_key}: {national_new} cen z celostátního endpointu")

    # PHASE 2: Per-vojvodství (pro dodatečné regionální pokrytí)
    print("  Phase 2: per-vojvodství pro doplnění...")
    for fuel_key, fuel_code in fuel_map:
        pmin, pmax = PRICE_RANGE[fuel_key]
        voiv_total = 0
        for voiv in VOIVODESHIPS:
            seen_in_voiv: set[str] = set()
            for page in range(MAX_PAGES_PER_VOIV):
                rows = scrape_voivodeship_page(voiv, fuel_code, page, session)
                if not rows:
                    break
                new_hrefs = {(r['href'] or f"{r['name']}|{r['city']}") for r in rows} - seen_in_voiv
                if not new_hrefs and page > 0:
                    break
                seen_in_voiv |= {(r['href'] or f"{r['name']}|{r['city']}") for r in rows}
                voiv_total += absorb(rows, fuel_key, pmin, pmax)
                time.sleep(0.3)
        print(f"    {fuel_key}: +{voiv_total} cen z per-vojvodství")

    print(f"  → CELKEM {len(by_href)} unikátních stanic")
    print(f"    Pb95: {counts['pb95']}, Pb98: {counts['pb98']}, ON: {counts['on']}, LPG: {counts['lpg']}")
    return by_href


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


def match_prices_to_osm(scraped: dict, osm_nodes: list) -> dict:
    """
    Vrací price_map: osm_id → {pb95, pb98, on, lpg}.
    Matchuje přes:
      1. name+city (přesný)
      2. brand+city
      3. fuzzy name obsahuje / je obsažen v OSM name, stejné město
    """
    name_city_idx, brand_city_idx = build_osm_indexes(osm_nodes)
    price_map = {}
    matched = 0

    for href, sc in scraped.items():
        raw_name = sc['name']
        sc_city_norm = normalize(sc['city'])

        # Přeskaküj nesmyslné řádky
        if normalize(raw_name) in JUNK_NAMES or not sc_city_norm:
            continue
        if len(normalize(raw_name)) < 2:
            continue

        sc_name_norm = normalize(raw_name)
        sc_brand_norm = clean_brand_name(raw_name)  # e.g. 'circle k'
        key_name  = sc_name_norm  + '|' + sc_city_norm
        key_brand = sc_brand_norm + '|' + sc_city_norm

        # 1. Přesný match přes name
        candidates = name_city_idx.get(key_name, [])

        # 2. Match přes brand tag
        if not candidates:
            candidates = brand_city_idx.get(key_brand, [])

        # 3. Fuzzy — token overlap
        if not candidates:
            sc_tokens = set(sc_name_norm.split()) | set(sc_brand_norm.split())
            for nk, nodes in name_city_idx.items():
                nk_name, nk_city = nk.split('|', 1)
                if nk_city != sc_city_norm:
                    continue
                nk_tokens = set(nk_name.split())
                # alespoň 1 shodný token a minimální délka
                if sc_tokens & nk_tokens and len(sc_tokens & nk_tokens) >= 1:
                    if not any(t in {'stacja', 'paliw', 'benzyna', 'punkt'} for t in (sc_tokens & nk_tokens)):
                        candidates = nodes
                        break
            # Brand vs name
            if not candidates:
                for bk, nodes in brand_city_idx.items():
                    bk_name, bk_city = bk.split('|', 1)
                    if bk_city != sc_city_norm:
                        continue
                    if sc_brand_norm in bk_name or bk_name in sc_brand_norm:
                        candidates = nodes
                        break

        if candidates:
            osm_id = candidates[0]['id']
            if osm_id not in price_map:
                price_map[osm_id] = {'pb95': None, 'pb98': None, 'on': None, 'lpg': None}
            for fuel in ('pb95', 'pb98', 'on', 'lpg'):
                if sc.get(fuel) is not None:
                    price_map[osm_id][fuel] = sc[fuel]
            matched += 1

    print(f"  → Namatchováno {matched} cenapaliw záznamů → OSM")
    return price_map


# ── build records ──────────────────────────────────────────────────────────────

def detect_brand(tags: dict) -> str:
    for key in ('brand', 'operator', 'name'):
        v = tags.get(key, '').strip()
        if v:
            return v
    return 'Stacja paliw'


def build_station_record(node: dict, prices: dict | None, now_iso: str, fallback_avgs: dict):
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
        est = round_price(base + (offset if use_offset else 0.0))
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


# ── stats & history ────────────────────────────────────────────────────────────

def compute_stats(prices_list: list, stations_list: list, now_iso: str) -> dict:
    def real_vals(fuel):
        return [p[fuel] for p in prices_list if p.get(fuel) and p.get('source') == 'cenapaliw.pl']

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
        vals = [(p[fuel], p['station_id']) for p in prices_list if p.get(fuel) and p.get('source') == 'cenapaliw.pl']
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

    updated = sum(1 for p in prices_list if p.get('source') == 'cenapaliw.pl')

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
            src_short = 'r' if p['source'] == 'cenapaliw.pl' else 'e'
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

    # 2. Scrape cenapaliw.pl (reálné PB95 ceny)
    scraped = scrape_all_prices()

    # 3. e-petrol.pl průměry (lepší než historické fallbacky)
    epetrol_avgs = fetch_epetrol_averages()

    # 4. Match cenapaliw → OSM
    price_map = match_prices_to_osm(scraped, osm_nodes) if osm_nodes and scraped else {}

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
    # e-petrol regionální průměry pro lepší odhad per vojvodství
    regional_avgs = epetrol_avgs.get('regional', {}) if isinstance(epetrol_avgs, dict) else {}

    # 5. Sestavení výsledků
    stations_list, prices_list = [], []
    for node in osm_nodes:
        prices = price_map.get(node['id'])
        s, p = build_station_record(node, prices, now_iso, fallback)
        stations_list.append(s)
        prices_list.append(p)

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
