# BenzynaMAPA.pl — Status vývoje

## Poslední aktualizace: 2026-05-06 — BUILD ✅ + SCRAPER ✅ + DATA ✅

---

## ✅ HOTOVO

### Web (Next.js 16 + React 19 + Tailwind CSS v4, statický export)
- `web/app/layout.tsx` — root layout, metadata PL, JSON-LD WebSite + Organization
- `web/app/globals.css` — Tailwind CSS v4
- `web/app/page.tsx` — hlavní stránka: mapa, FAQ (JSON-LD FAQPage), tabulky, SEO
- `web/app/HomeClient.tsx` — client: MapLibre GL mapa, filtry, geolokace GPS+IP, Web Worker
- `web/app/najtansze-benzyna/page.tsx` — ranking PB95
- `web/app/najtansze-diesel/page.tsx` — ranking ON
- `web/app/najtansze-lpg/page.tsx` — ranking LPG
- `web/app/stacja/[id]/page.tsx` — detail stanice (GasStation JSON-LD)
- `web/app/miasto/[nazev]/page.tsx` — 48 polských měst
- `web/app/marka/page.tsx` + `[brand]/page.tsx` — 6 sítí (Orlen, Shell, BP, Circle K, Moya, Huzar)
- `web/app/historia-cen/page.tsx` — grafy 90 dní (Recharts)
- `web/app/kalkulator/page.tsx` — kalkulačka spotřeby v PLN
- `web/app/aktualnosci/page.tsx` — statické aktuality
- `web/app/robots.ts` + `sitemap.ts`
- `web/app/polityka-prywatnosci/page.tsx`, `kontakt/page.tsx`

### Komponenty
- `Header.tsx` — navigace PL
- `Footer.tsx` — CZ/PL copyright
- `MapView.tsx` — MapLibre GL, center Polska [19.15, 52.10], clustering, pop-upy v PLN (zł)
- `FilterBar.tsx` — filtry PB95/PB98/ON/LPG, slider max cena, rychlá navigace měst
- `StatsBar.tsx` — průměrné ceny + 7d trend v zł
- `CheapestTable.tsx` — tabulka nejlevnějších
- `Top4Cheapest.tsx` — top bannery pro každé palivo
- `NearbyPanel.tsx` — stanice v okolí (geolokace)
- `WebVitals.tsx`

### Datová vrstva
- `web/types/index.ts` — FuelType: pb95/pb98/on/lpg (ne natural_95/nafta!), CITIES (48 PL), BRANDS, REGIONS
- `web/lib/data.ts` — datové funkce + slugify pro polštinu (ł→l, ą→a, ę→e, ó→o atd.)

### Data (aktuální stav)
- **4417 stanic** z OSM Polsko s GPS
- **6 stanic** s reálnou cenou PB95 z cenapaliw.pl
- **~4411 stanic** s odhadovanými cenami (brand offset v PLN)
- Průměry: **PB95=6.47 zł, ON=6.59 zł, LPG=2.89 zł**
- `web/public/data/stations_latest.json` — 754 KB
- `web/public/data/prices_latest.json` — 595 KB
- `web/public/data/map_data.json` — 1181 KB

### Scraper
- `scraper/build_osm_data.py` — OSM (Polsko, Overpass API s retry na 3 endpoints) + cenapaliw.pl PB95
- `scraper/requirements.txt` — requests, beautifulsoup4, lxml
- **DŮLEŽITÉ**: cenapaliw.pl vrací fuel-filter přes JS → server bez JS vždy vrátí PB95 data.
  Scraper proto bere jako reálná POUZE PB95 ceny. ON/LPG/PB98 jsou odhady z brand offsetů.
- Matching: name+city normalizovaně (ł→l atd.) + brand tag OSM + fuzzy token overlap
- Brand offsets v PLN: Shell +0.35, BP +0.30, Circle K +0.25, Orlen +0.05, Moya -0.15, Huzar -0.20

### GitHub Actions
- `.github/workflows/scraper.yml` — 3× denně (06:00, 10:00, 15:00 CET) + workflow_dispatch
- `.github/workflows/deploy.yml` — build + GitHub Pages deploy při push

### Build
- ✅ `npm run build` prochází čistě
- 70 stránek vygenerováno (statický export)
- `web/out/` obsahuje kompletní statický web

---

## 🔧 CO JE POTŘEBA DÁLE

### Priorita 1 — Hosting
1. Vytvořit GitHub repo a pushnout kód (`git push`)
2. Zapnout GitHub Pages v nastavení repozitáře
3. Doménu `benzynamapa.pl` nasměrovat na GitHub Pages (CNAME)

### Priorita 2 — Branding
4. Logo/favicon — nakopírovat nebo vytvořit do `web/public/`:
   - `logo.png`, `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`
5. OG obrázek — `web/public/og-image.jpg` (1200×630)
6. Map preview — `web/public/map-preview.png` (screenshot mapy Polska)

### Priorita 3 — Lepší datový zdroj
7. **e-petrol.pl scraping** pro ON a LPG ceny:
   - e-petrol.pl je polský ekvivalent mbenzin.cz, pokrývá ON/LPG
   - Přidat do `build_osm_data.py` jako doplňkový zdroj
8. Zlepšit matching cenapaliw.pl → OSM:
   - Hypermarkety (Auchan, Makro, Carrefour) nemají city v OSM → matching selže
   - Možné řešení: geocoding adresy z cenapaliw → GPS → match do OSM

### Priorita 4 — SEO
9. Google Search Console — přidat web, odeslat sitemap.xml
10. Plausible Analytics — přidat do `web/app/layout.tsx`

---

## 📊 Zdroj dat — cenapaliw.pl

| Dotaz | Vrací |
|-------|-------|
| `/stationer/e95/alla` | PB95, národní top 14 ✅ |
| `/stationer/on/alla` | STEJNÁ PB95 data (JS filter) ❌ |
| `/stationer/lpg/alla` | STEJNÁ PB95 data ❌ |
| `/stationer/e95/mazowieckie/` | PB95 Mazowieckie (stále stejný národní top 14) |

→ **Závěr**: cenapaliw.pl funguje jako zdroj pouze pro PB95 nejlevnějších stanic. Pro ON/LPG nutno najít jiný zdroj nebo nechat odhady.

---

## 🏗 Architektura

```
benzynamapa.pl/
├── web/                    # Next.js 16 statický export
│   ├── app/                # App Router stránky (polsky)
│   ├── components/         # React komponenty
│   ├── lib/data.ts         # čte JSON data
│   ├── types/index.ts      # pb95/pb98/on/lpg, ceny v PLN
│   └── public/data/        # JSON data (scraper sem zapisuje)
│       ├── map_data.json   # 1181 KB — komprimovaná data pro mapu
│       ├── stations_latest.json  # 4417 stanic
│       ├── prices_latest.json    # 4417 cen
│       ├── stats_latest.json     # průměry, trendy
│       └── history_90d.json      # 90 dní historie
├── scraper/
│   ├── build_osm_data.py   # OSM + cenapaliw.pl → JSON
│   ├── gps_cache_pl.json   # GPS cache (prázdná, pro budoucí geocoding)
│   └── history_pl.json     # 90d histori pro výpočet trendů
└── .github/workflows/      # scraper 3×/den + CI/CD
```

---

## 🎯 Srovnání s benzinmapa.cz

| Feature | benzinmapa.cz | benzynamapa.pl | Stav |
|---------|--------------|----------------|------|
| Interaktivní mapa MapLibre GL | ✅ | ✅ | ✅ |
| Clustering | ✅ | ✅ | ✅ |
| Geolokace GPS + IP | ✅ | ✅ | ✅ |
| Stánky v okolí | ✅ | ✅ | ✅ |
| Filtry paliva + max cena | ✅ | ✅ | ✅ |
| Vyhledávání | ✅ | ✅ | ✅ |
| Ranking nejlevnějších | ✅ | ✅ | ✅ |
| Detail stanice | ✅ | ✅ | ✅ |
| Stránky měst | ✅ ~100 | ✅ 48 | ✅ |
| Stránky značek | ✅ | ✅ 6 | ✅ |
| Historia cen 90 dní | ✅ | ✅ | ✅ |
| Kalkulačka | ✅ | ✅ | ✅ |
| Aktuality | ✅ AI | ⏳ Statické | Rozšiřit |
| SEO (metadata, FAQ, JSON-LD) | ✅ | ✅ | ✅ |
| Jazyk | CS | PL | ✅ |
| Měna | Kč | zł | ✅ |
| Počet stanic | ~2400 | **4417** | ✅ VÍCEJ |
| Reálné ceny | ~2400 mbenzin.cz | 6 cenapaliw.pl | ⚠️ Zlepšit |
| Build ✅ | ✅ | ✅ | ✅ |
