# BenzynaMAPA.pl — Status vývoje

## Aktuální stav: 2026-10-22 — dokončení větve `feat/community-gamification`

### Výsledky analýzy
- **Produkce (master) jela od června se starým, rozbitým scraperem.** cenapaliw.pl změnil web
  (~2026-05-29), opravený scraper ležel jen ve větvi. Na webu: `stations_updated_today: 0`,
  všech ~8 700 cen byly odhady, průměry = natvrdo zadané `FALLBACK_AVG` (PB95 6,25 / ON 7,10).
- **Historie 95 dní byla falešná** — každý den stejné konstanty → plochý graf v `/historia-cen/`
  a nesmyslný „trend 7d".
- Trh mezitím šel nahoru: e-petrol 2026-10-21 PB95 6,70 / ON 7,94 / LPG 3,55 zł.

### Co bylo uděláno
1. Merge `origin/master` (446 datových commitů) do větve — konflikty jen v datových JSON.
2. Nový scraper ověřen živě: **101 reálných cen** (z 6 101 stanic cenapaliw), 9 676 stanic,
   PB95 medián 6,59 zł (e-petrol 6,70 ✓).
3. Scraper — historie a průměry:
   - `compute_stats` bere referenční úroveň z e-petrolu (ne zastaralou konstantu) pro sanity
     check i pro den bez reálných cen. `FALLBACK_AVG` aktualizován na 2026-10-21.
   - e-petrol týdenní národní průměry (3 týdny) se automaticky doplňují do dnů bez vlastního záznamu.
   - Dnešní záznam se přepisuje každým během (dřív platil jen první běh dne).
   - Den bez reálných cen i bez e-petrolu se do historie nezapíše (žádné další ploché kopie).
   - Trend 7d se počítá podle data, ne podle indexu (historie může mít mezery).
   - Falešných 95 záznamů smazáno → historie: 7./14./21. 10. (e-petrol) + 22. 10. (vlastní).
4. Web — sanity check lokálních průměrů (otevřený bug Warszawa 9,15 zł z 2026-05-26):
   `getSaneRealStations/getSaneRealPrices` v `lib/data.ts` (reálné ceny v pásmu 85–125 %
   národního průměru) použito v `miasto`, `wojewodztwo`, `autostrada`, `ceny-paliw-dzisiaj`,
   `llms-full.txt`. Zároveň se tam započítávají i komunitní ceny (dřív jen `cenapaliw.pl`).
5. `/historia-cen/` graf zvládá krátkou řadu (popisky osy, body u < 20 záznamů).
6. Supabase: kód čte i `SUPABASE_SERVICE_ROLE_KEY` (název z Vercel Marketplace integrace).

### ⚠ KRITICKÉ — web je offline (zjištěno 2026-10-22)
- `benzynamapa.pl` vrací **HTTP 402 Payment required / DEPLOYMENT_DISABLED** (Vercel).
- Vercel u commitů hlásí „Account is blocked." od ~2026-07-14; poslední úspěšný deploy ~2026-07-04.
- Oprava výše je zmergovaná do `master` (42a5939) a pushnutá, ale nasadí se až po odblokování účtu.
- Řešení: Vercel dashboard účtu, kde projekt běží → Usage / Billing (Hobby limity, příp. Pro),
  nebo přesun hostingu (benzinmapa.cz běží na Cloudflare).

### Zbývá (musí udělat uživatel)
- Odblokovat Vercel účet (viz výše) — bez toho je vše ostatní neviditelné.
- Supabase projekt + SQL tabulka + env (Vercel) + secrets (GitHub) dle `SUPABASE_SETUP.md`.
  Bez toho komunitní hlášení nepřežijí cold start na Vercelu.
- GSC / Bing Webmaster dle `NEXT_STEPS_GSC.md` (pokud ještě není hotové).

---

## Historie: 2026-05-06 — BUILD ✅ + SCRAPER ✅ + DATA ✅

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
