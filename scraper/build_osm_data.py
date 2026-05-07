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
CENAPALIW    = 'https://www.cenapaliw.pl'
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

FALLBACK_AVG = {'pb95': 6.38, 'on': 6.21, 'pb98': 6.82, 'lpg': 2.89}


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
    """Stáhne národní průměrné ceny z e-petrol.pl (přesné průměry ON/LPG/PB98)."""
    try:
        r = requests.get(f'{EPETROL}/ceny-paliw/srednie-ceny-paliw-w-polsce', headers=H, timeout=20)
        soup = BeautifulSoup(r.text, 'html.parser')
        avgs = {}
        # e-petrol.pl má tabulku nebo sekci s průměrnými cenami
        for row in soup.select('table tr, .fuel-price-row, [class*=price-row]'):
            text = row.get_text(' ', strip=True).lower()
            for fuel, keywords in [
                ('pb95', ['pb 95', 'e10', 'benzyna 95']),
                ('pb98', ['pb 98', 'e5', 'benzyna 98']),
                ('on',   ['olej nap', 'diesel', 'on ']),
                ('lpg',  ['lpg', 'autogaz']),
            ]:
                if any(kw in text for kw in keywords):
                    # Najdi číslo v řádku — cena PLN
                    prices = re.findall(r'\b(\d+[.,]\d{2})\b', text)
                    for p in prices:
                        v = parse_price_pln(p)
                        pmin, pmax = PRICE_RANGE.get(fuel, (1.0, 15.0))
                        if v and pmin <= v <= pmax:
                            avgs[fuel] = v
                            break
        if avgs:
            print(f"  → e-petrol.pl průměry: {avgs}")
        return avgs
    except Exception as e:
        print(f"  ✗ e-petrol.pl: {e}")
        return {}


# ── cenapaliw.pl scraper ───────────────────────────────────────────────────────

def scrape_voivodeship(voiv: str, fuel_code: str, session: requests.Session) -> list:
    """Stáhne ceny z jednoho województva a jednoho paliva."""
    url = f'{CENAPALIW}/stationer/{fuel_code}/{voiv}/'
    try:
        r = session.get(url, headers=H, timeout=25)
        if r.status_code != 200:
            return []
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

            # data-href pro identifikaci
            href = row.get('data-href', '')

            if name and price:
                results.append({
                    'name': name, 'city': city, 'address': address,
                    'fuel': fuel_code, 'price': price,
                    'href': href, 'voiv': voiv,
                })
        return results
    except Exception as e:
        print(f"  ✗ {voiv}/{fuel_code}: {e}")
        return []


def scrape_all_prices() -> dict:
    """
    Vrací slovník: href → {name, city, address, pb95, pb98, on, lpg}.
    Scrape pb95 z cenapaliw.pl per każde województwo (server vrací národní top14
    pro /alla endpoint, tedy scrapujem po województwach pro lepší pokrytí).
    """
    print("Scrapuji ceny PB95 z cenapaliw.pl (16 województw)…")
    session = requests.Session()
    by_href: dict[str, dict] = {}
    total = 0

    for voiv in VOIVODESHIPS:
        rows = scrape_voivodeship('pb95', 'e95', session)
        for row_data in rows:
            href = row_data['href'] or f"{row_data['name']}|{row_data['city']}"
            # Validuj cenu pro pb95
            pmin, pmax = PRICE_RANGE['pb95']
            if not (pmin <= row_data['price'] <= pmax):
                continue
            if href not in by_href:
                by_href[href] = {
                    'name': row_data['name'], 'city': row_data['city'],
                    'address': row_data['address'],
                    'pb95': None, 'pb98': None, 'on': None, 'lpg': None,
                }
            if by_href[href]['pb95'] is None:
                by_href[href]['pb95'] = row_data['price']
                total += 1
        time.sleep(0.5)

    print(f"  → Celkem {len(by_href)} unikátních stanic, {total} pb95 záznamů")
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
        # Odhad
        est = round_price(base + (offset if use_offset else 0.0))
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

    avgs = {fuel: avg(real_vals(fuel)) or FALLBACK_AVG[fuel] for fuel in ('pb95', 'pb98', 'on', 'lpg')}

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
    price_map = {p['station_id']: p for p in prices_list}
    result = []
    for s in stations:
        p = price_map.get(s['id'])
        entry = dict(s)
        if p:
            entry['p'] = {
                'n95': p['pb95'], 'n98': p['pb98'],
                'on': p['on'],    'lpg': p['lpg'],
                'src': p['source'], 'at': p['reported_at'],
            }
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
    # e-petrol přebije historické průměry
    for k, v in epetrol_avgs.items():
        if v:
            fallback[k] = v

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
