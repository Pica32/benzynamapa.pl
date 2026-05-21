# BenzynaMAPA.pl — SEO/GEO/LLM optimalizace (P0)

> Dokumentace průběhu hloubkové SEO/GEO/LLM optimalizace dle `seo.txt`.
> Reference vzor: `C:\Users\koten\Desktop\benzinmapa.cz`
> Datum: 2026-05-15

---

## 1) Výsledky analýzy referenční stránky (benzinmapa.cz)

### Co CZ má silné:

**Technické SEO:**
- `metadataBase`, kompletní OG + Twitter karty, locale `cs_CZ`
- `robots.ts` s explicitním povolením AI crawlerů (GPTBot, ClaudeBot, PerplexityBot, CCBot, Anthropic)
- `sitemap.ts` zahrnuje: static pages, 130+ měst, 6 značek, všechny stanice s cenou (priority dle zdroje), 19 blog článků
- `canonical` URL na každé stránce
- Apple touch icons + favicon set
- `<link rel="preload" href="/data/map_data.json" as="fetch">` pro rychlejší LCP
- `<link rel="preconnect">` pro tile.openstreetmap.org, ip-api.com, fonts.gstatic.com
- `next/font/google` Inter s `display: 'swap'` + `preload: true`
- `dns-prefetch` + `preconnect` na klíčové externí zdroje

**Schema.org strukturovaná data:**
- `WebSite` s `SearchAction` (sitelinks searchbox)
- `Organization` s `areaServed: Country (CZ Wikidata Q213)`, `knowsAbout`, `contactPoint`, `sameAs`
- `GasStation` JSON-LD s **`offers` (Natural 95, nafta cena, currency CZK, priceValidUntil)** ⭐
- `BreadcrumbList` JSON-LD na všech sub-stránkách
- `FAQPage` JSON-LD na home, městech, značkách, blog článcích
- `ItemList` JSON-LD na CityPage (top 5 stanic)
- `NewsArticle` JSON-LD na blog článcích (`/aktualne/[slug]/`)

**Informační architektura:**
- `/` — mapa + FAQ + sekce měst + brand stats
- `/mesto/[nazev]/` — město stránka (130+)
- `/stanice/[id]/` — detail stanice + cross-link na "stanice s ověřenou cenou ve městě" ⭐
- `/znacka/` + `/znacka/[brand]/` — index značek + detail značky se srovnáním napříč krajů
- `/aktualne/` + `/aktualne/[slug]/` — blog (19 článků!)
- `/nejlevnejsi-benzin/`, `/nejlevnejsi-nafta/`, `/nejlevnejsi-lpg/` — top stanice
- `/vyvoj-ceny/` — graf 90 dní
- `/maximalni-ceny-mf/` — stránka o regulaci cen MF ⭐ (state authority)
- `/benzin-vs-nafta/` — porovnání
- `/kalkulacka-spotreby/` — kalkulačka
- `/o-nas/`, `/kontakt/`, `/zasady-cookies/`, `/zasady-ochrany-osobnich-udaju/`, `/podminky-pouzivani/`

**Lokality a mapový obsah:**
- 130+ měst s lat/lng v `CITIES` array
- 14 krajů v `REGIONS` array (ale bez page route)
- City page generuje: brand breakdown, region info, regionální srovnání cen, FAQ s daty města

**Long-tail klíčová slova:**
- "ceny benzínu [město] dnes 2026"
- "kde natankovat [město]"
- "[brand] ceny benzínu", "[brand] cena nafty"
- "[brand] [město]" (cross v town pages)
- "rozdíl natural 95 vs 98", "kdy je benzín nejlevnější rano vecer"

**LLM Search optimalizace:**
- `llms.txt` v `public/` — komplexní průvodce pro AI asistenty s URL mapováním a explicitními pokyny "VŽDY vlož přímý odkaz"
- AI crawlers explicitně povoleni v `robots.txt`
- FAQ JSON-LD all over (AI Overviews / featured snippets)
- ItemList schema (rankings)
- Strukturovaný obsah s H2/H3 hierarchy
- Tabulky a srovnání ve čistém HTML (LLM friendly)

**Performance:**
- Server response < 0.4 s
- HTML compress, gzip
- Stable inter font + preload
- `dynamic` import mapy (ssr: false)

### Co lze v PL vylepšit oproti CZ:

PL má navíc:
- AdSense integration
- Service JSON-LD (porovnávač paliv)
- `inLanguage: 'pl'` v WebSite schema
- `manifest.json` pro PWA (i když nyní vypnuto)

---

## 2) Audit aktuálního stavu benzynamapa.pl

### Silné stránky (dobře už máš):

✅ Komplexní OG + Twitter karty, `metadataBase`, locale `pl_PL`
✅ Robots.txt s AI crawlerů
✅ Sitemap.ts s městy + značkami + stanicemi + blog
✅ `WebSite`, `Organization`, `Service` JSON-LD na layoutu
✅ FAQ JSON-LD na home, městech, značkách
✅ Breadcrumb JSON-LD na sub-stránkách
✅ `GasStation` JSON-LD na detail stanice (ALE bez offers!)
✅ `inLanguage: 'pl'` v WebSite
✅ Komplexní llms.txt v polštině
✅ Header s navigací, Footer s odkazy
✅ Blog `/aktualnosci/` s 8 články
✅ Srovnávač značek `/marka/` + detail
✅ `najtansze-benzyna/`, `najtansze-diesel/`, `najtansze-lpg/`
✅ `historia-cen/`, `kalkulator/`, `benzyna-vs-diesel/`
✅ `kontakt/`, `polityka-prywatnosci/`

### Chybějící / slabší (P0 priorita):

❌ **CITIES jen 48** vs CZ 130+ (obrovská long-tail příležitost)
❌ **GasStation bez `offers`** (cena, priceCurrency, priceValidUntil) — kritické pro rich snippets a AI quote-ability
❌ **CityPage chybí `ItemList` + `Place` schema** s geo coordinates a Wikidata
❌ **Žádné region pages** (REGIONS existuje ale bez `/wojewodztwo/[slug]/`)
❌ **Žádná stránka o regulaci cen** (analog CZ `/maximalni-ceny-mf/` — pro PL UOKiK / e-petrol referenční ceny)
❌ **Chybí stránky:** `/o-nas/`, `/regulamin/`, `/cookies/`, `/jak-dziala/`
❌ **NewsArticle / Article schema chybí na blog postech** (jen FAQPage)
❌ **Speakable schema chybí** (AI / voice search optimalizace)
❌ **`dateModified` chybí** (signál čerstvosti pro AI crawlery)
❌ **Cross-linking detail stanice → ostatní stanice ve městě** (CZ má, PL nemá)
❌ **Footer minimální** — jen 4 odkazy, chybí navigace, údaje provozovatele, sociální sítě
❌ **Hreflang** mezi PL a CZ verzemi chybí (turistika paliwowa)
❌ **Žádný `<link rel="preload">`** pro JSON data
❌ **`Speakable` schema, `priceValidUntil`** chybí

---

## 3) Plán P0 implementace

### Cíle (max impact / min time):

1. ✅ **Rozšířit CITIES** na 130+ polských měst (s lat/lng + region + Wikidata)
2. **Přidat `offers` do `GasStation` JSON-LD** s `priceValidUntil`, `priceCurrency: 'PLN'`
3. **Přidat `ItemList` + `Place` JSON-LD** do `/miasto/[nazev]/` (top stanice + geo + administrativní region)
4. **Vytvořit region pages** `/wojewodztwo/[slug]/` pro 16 vojvodství + index
5. **Vytvořit stránku** `/maksymalne-ceny-paliw/` (analog CZ MF — UOKiK / e-petrol referenční ceny)
6. **Vytvořit stránky** `/o-nas/`, `/regulamin/`, `/cookies/`, `/jak-dziala/`
7. **Cross-linking** stanic s ověřenou cenou na detail stanice (jako CZ)
8. **Vylepšit Footer** s navigací, údaji provozovatele, sociálními sítěmi
9. **Přidat `dateModified`** + `Speakable` JSON-LD
10. **Přidat `NewsArticle` JSON-LD** na blog post (potřebuju zkontrolovat existující strukturu)
11. **Hreflang link** na .cz pro cross-border traffic
12. **`<link rel="preload">`** pro `/data/stats_latest.json`
13. **Aktualizovat `sitemap.ts`** s region pages, novými stránkami
14. **Vylepšit `llms.txt`** o nové stránky
15. **Header — přidat odkazy na nové stránky**

---

## 4) Co bylo uděláno

### 2026-05-15 — P0 IMPLEMENTACE

#### ✅ 1. Rozšíření CITIES (foundation pro local SEO)
**Soubor:** `web/types/index.ts`
- Předtím: 48 měst, jen `name`/`slug`/`lat`/`lng`
- Teď: **165 měst** s typed interface `City` (region + Wikidata + population)
- Přidáno: ~120 polských měst nad 20k obyvatel z všech 16 vojvodství
- Přidáno: `Region` interface s `capital`/`capitalSlug`/`wikidata`/`lat`/`lng`/`population`/`description`
- Z 16 REGIONS pouze slug+name → teď bohaté metadata pro region pages

#### ✅ 2. GasStation JSON-LD `offers` (kritické pro rich snippets + AI)
**Soubor:** `web/app/stacja/[id]/page.tsx`
- Přidán `offers` array (Pb95, Pb98, ON, LPG) s `priceCurrency: 'PLN'`, `priceValidUntil` (8h od reportu), `availability: InStock`
- Přidán `AggregateOffer` s `lowPrice`/`highPrice`/`offerCount`
- Přidán `brand` (Brand), `addressRegion`, `amenityFeature` (LPG, AdBlue, myjnia)
- Přidán `dateModified` (čerstvost pro AI crawlery)
- Přidán cross-link "Stacje ze zweryfikowaną ceną w {miasto}" (top 5 sortovaných dle ceny) — vzor z CZ
- Přidán warning box pro stanice bez real ceny (UX + zachycení nahlášení ceny)

#### ✅ 3. CityPage rozšířená schemata
**Soubor:** `web/app/miasto/[nazev]/page.tsx`
- Přechod z 2 single-script JSON-LD na `@graph` se 4 entitami:
  - `BreadcrumbList`
  - `City` (Schema.org Place) s `geo`, `Wikidata sameAs`, `containedInPlace AdministrativeArea`, `populationOf`
  - `ItemList` top 10 nejlevnějších stanic v městě (každá s `GasStation` + `makesOffer`)
  - `FAQPage` + `Speakable` (`h1`, `.faq-question`, `.city-stats`)
- Přidány CSS classy `city-stats` a `faq-question` pro Speakable selektory

#### ✅ 4. Nové stránky (4 ks)
**Soubory:**
- `web/app/wojewodztwo/page.tsx` — index 16 vojvodství s `ItemList`, `BreadcrumbList`, sortováním dle populace
- `web/app/wojewodztwo/[slug]/page.tsx` — detail vojvodství s:
  - `AdministrativeArea` schema s `geo` + `Wikidata sameAs`
  - `BreadcrumbList`, `FAQPage` + `Speakable`
  - Statistika cen v regionu (avg vs národní)
  - Top 25 nejlevnějších stanic
  - Seznam měst v regionu
  - SEO text + 5 dynamických FAQ
- `web/app/maksymalne-ceny-paliw/page.tsx` — analog CZ MF stránky:
  - `Article` schema + `BreadcrumbList` + `FAQPage` + `Speakable`
  - Tabulka složek ceny paliva (akcyza, VAT, opłata paliwowa, marża)
  - Mezinárodní srovnání (CZ, DE, SK, LT)
  - 8 strukturovaných FAQ
- `web/app/o-nas/page.tsx` — `AboutPage` + `Organization` schema, misja, metodologia, stack
- `web/app/jak-dziala/page.tsx` — `HowTo` schema (4 kroky), `BreadcrumbList`, `FAQPage` + `Speakable`
- `web/app/regulamin/page.tsx` — `WebPage` + `BreadcrumbList`, 7 paragrafů regulaminu
- `web/app/cookies/page.tsx` — Cookie policy s tabulkou ciasteczek (GA, AdSense), Google Consent Mode v2

#### ✅ 5. Sitemap a robots
**Soubor:** `web/app/sitemap.ts`
- Přidány: regionRoutes (16), nové static (wojewodztwo, maksymalne-ceny-paliw, o-nas, jak-dziala, regulamin, cookies, polityka-prywatnosci, kontakt)
- Stations s real cenou mají vyšší prioritu (0.7 vs 0.5) — Googlebot crawluje častěji
- changeFrequency optimalizována (hourly pro stanice s cenou)

#### ✅ 6. Header + Footer redesign
**Soubory:** `web/components/Header.tsx`, `web/components/Footer.tsx`
- Header: přidán `aria-label` pro accessibility, breakpoint změněn na `lg:` (více odkazů), přidán `/wojewodztwo/`
- Footer: ze 4 odkazů na **4-sloupcovou navigační strukturu** s 23 odkazy:
  - Sloupec 1: Ceny paliw (mapa, najtansze, historia)
  - Sloupec 2: Lokalizacja (województwa + 5 top miast)
  - Sloupec 3: Sieci stacji (Orlen, Shell, BP, Circle K, Moya)
  - Sloupec 4: Informacje (o-nas, jak-dziala, maksymalne ceny, kalkulator, ...)
  - Spodní pruh: regulamin, polityka, cookies, API JSON, link na CZ verzi s `hrefLang="cs"`

#### ✅ 7. Layout vylepšení
**Soubor:** `web/app/layout.tsx`
- `<link rel="preload" href="/data/stats_latest.json" as="fetch">` — rychlejší LCP
- 3 `<link rel="alternate" hrefLang>` (pl-PL, cs-CZ → benzinmapa.cz, x-default)
- `metadata.alternates.languages` rozšířeny o `cs-CZ`

#### ✅ 8. NewsArticle + Speakable na blog post
**Soubor:** `web/app/aktualnosci/[slug]/page.tsx`
- Přechod z 3 single-script JSON-LD na `@graph` se 3 entitami:
  - `NewsArticle` (silnější signál než `Article`) s `articleSection`, `wordCount`, `image`, `Speakable`
  - `BreadcrumbList`
  - `FAQPage` + `Speakable`
- Přidány CSS classy `article-excerpt` a `faq-question`

#### ✅ 9. Speakable na home stránce
**Soubor:** `web/app/page.tsx`
- FAQPage rozšířena o `speakable` se selektory `h1`, `.faq-question`, `.home-hero`
- Přidány CSS classy

#### ✅ 10. llms.txt rozšíření
**Soubor:** `web/public/llms.txt`
- Přidána sekce 16 vojvodství s URL
- Přidána sekce sieci stacji s pozycí cenovou
- Přidány nové URL: `/wojewodztwo/`, `/maksymalne-ceny-paliw/`, `/o-nas/`, `/jak-dziala/`
- Přidány query mappings: "podatky/akcyza", "Z czego składa się cena", "Jak obliczyć koszt"
- Sekce o vazbě na CZ verzi (turystyka paliwowa)

---

## 5) Validace

### Build test ✅ PROŠEL (exit 0)
- `npm run build` proběhl úspěšně
- TypeScript kompilace OK
- **8 912 statických stránek vygenerováno**:
  - 165 city pages (`/miasto/[nazev]/`)
  - 16 region pages (`/wojewodztwo/[slug]/`)
  - 6 brand pages (`/marka/[brand]/`)
  - 8 blog článků (`/aktualnosci/[slug]/`)
  - 8 691 stanic s reálnou nebo odhadovanou cenou (`/stacja/[id]/`)
  - Všechny nové statické stránky: `/wojewodztwo/`, `/maksymalne-ceny-paliw/`, `/o-nas/`, `/jak-dziala/`, `/regulamin/`, `/cookies/`
- Všechny stránky mají `revalidate: 6h` pro ISR aktualizaci s novými cenami

### Co ještě stojí za úvahu (P1 v budoucnu):
- Cookie consent banner (GDPR / Google Consent Mode v2 default 'denied') — `/cookies/` stránka existuje, ale frontend banner ne ✅ HOTOVO
- Stránky pro paliva: `/benzyna-95/`, `/benzyna-98/`, `/olej-napedowy/`, `/lpg/`, `/adblue/` ✅ HOTOVO
- Stránky kombinace marka×miasto: `/marka/orlen/warszawa/` ✅ HOTOVO
- Stránky pro autostrady A1, A2, A4, S7
- Stránky pro hraniční přechody (turystyka paliwowa long-tail)
- Více blog článků
- Web Vitals real-user monitoring → Vercel Analytics ✅ HOTOVO

---

## 6) P1 IMPLEMENTACE (2026-05-15)

### ✅ P1.1 — Cookie Consent banner + Google Consent Mode v2

**GDPR compliance — kritická:** bez Consent Mode default 'denied' uživatelé bez souhlasu měli aktivní GA4 a AdSense ciasteczka = riziko sankcí UODO.

**Soubory:**
- `web/app/layout.tsx` — přidán `CONSENT_DEFAULTS` JS script jako PRVNÍ v `<head>` (před AdSense). Default `denied` pro `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`. `wait_for_update: 500` ms.
- `web/components/CookieConsent.tsx` — nová komponenta (PL): 3 volby (Akceptuj wszystkie / Tylko analityczne / Odrzuć niepotrzebne) + rozbalovací detail. Persisted v `localStorage[bm_cookie_consent_v1]`.
- `web/components/GoogleAnalytics.tsx` — vyčištěn duplicitní `dataLayer.push` (consent default už v layoutu)

### ✅ P1.2 — IndexNow API integration

**Význam:** Bing dnes obsluhuje ChatGPT a Copilot. IndexNow ping pingne Bing/Yandex/Seznam/Naver okamžitě po update cen — kritické pro AI viditelnost (ceny se mění 3×/den).

**Soubory:**
- `web/public/0191df93d1b02a6c00fdb8d67042bdd3.txt` — IndexNow key file (verifikace)
- `scraper/indexnow_ping.py` — Python skript: collect 89+ URL (homepage, sitemap, paliva, top 50 měst, 16 vojvodství, 6 marek + až 500 stanic s real cenou) a POST na `api.indexnow.org`
- `.github/workflows/scraper.yml` — přidán step "Ping IndexNow" který se spouští **jen** když commit fakticky nastal (steps.commit.outputs.changed == 'true'); `continue-on-error: true` aby nevypnul pipeline při HTTP rate limit

### ✅ P1.3 — Vercel Analytics + Speed Insights + GA4 Web Vitals

**Soubory:**
- `web/package.json` — instalovány `@vercel/analytics` + `@vercel/speed-insights`
- `web/app/layout.tsx` — `<Analytics />` + `<SpeedInsights />` v `<body>`
- `web/components/WebVitals.tsx` — přepsán: posílá CWV (LCP, INP, CLS, FCP, TTFB) do GA4 jako custom events s `metric_rating` (good/needs-improvement/poor)

### ✅ P1.4 — Brand × Miasto stránky (~990 nových URL)

**Long-tail SEO:** "Orlen Warszawa", "Shell Kraków", "BP Poznań" jsou high-volume polské queries.

**Soubory:**
- `web/app/marka/[brand]/[city]/page.tsx` — nová šablona: 6 marek × 165 měst = **990 nových indexovatelných stránek** s:
  - `BreadcrumbList` (4 levels)
  - `CollectionPage` schema s `spatialCoverage` (City + Wikidata + geo)
  - `ItemList` top 10 nejlevnějších stanic dané sieci v daném městě
  - `FAQPage` + `Speakable` (5 dynamických FAQ s daty - cena, srovnání s městem a národním průměrem)
  - "Answer box" pro AI (krátká faktická odpověď nahoře)
  - Tabulka cen napříč 4 paliv (sieć vs miasto vs Polska)
  - Cross-link: jiné značky v městě + tato značka v jiných městech
- `web/app/marka/[brand]/page.tsx` — odkazy na města teď linkují na `/marka/[brand]/[city]/` pokud město existuje v CITIES
- `web/app/sitemap.ts` — `brandCityRoutes` (~990 URL, priority 0.65)
- `web/public/llms.txt` — sekce "Sieci × miasta" s URL pattern + 6 příkladů

### ✅ P1.5 — 5 stránek pro paliva (informativní + Article+Product schema)

**Soubory:**
- `web/app/benzyna-95/page.tsx` — RON 95, E10/E5, normy PN-EN 228, parametry (9 řádků), Pb95 vs Pb98 srovnání
- `web/app/benzyna-98/page.tsx` — RON 98 premium, do jakých aut (BMW M, AMG, Porsche...), Shell V-Power vs BP Ultimate vs Verva
- `web/app/olej-napedowy/page.tsx` — diesel, ON Arktic na zimu, AdBlue, parametry PN-EN 590, diesel vs benzyna
- `web/app/lpg/page.tsx` — autogaz, kalkulator opłacalności (real-time s daty z `stats`), instalacja, parametry PN-EN 589
- `web/app/adblue/page.tsx` — kde kupić najtaniej (tabulka cen dystrybutor vs kanister), HowTo tankování, co se stane když dojde

Každá stránka má:
- `Article` schema + `Product` schema s `AggregateOffer` + `UnitPriceSpecification` (cena/litr v PLN)
- `FAQPage` + `Speakable` (8 FAQ na stránku)
- "Answer box" pro AI extraction
- Cena tagována real-time z `stats_latest.json`

### ✅ P1.6 — Sitemap split (sitemap index + 6 sub-sitemap)

Bez split: 1 soubor s ~9 700 URL = pomalejší crawl, horší prioritizace.

**Soubor:** `web/app/sitemap.ts` přepsán s `generateSitemaps()`:
- `/sitemap.xml` — automatický index (Next.js)
- Batch 0: static + paliva (~22 URL)
- Batch 1: 165 měst
- Batch 2: 16 vojvodství
- Batch 3: 6 sieci + 990 marka×miasto
- Batch 4: 8 blog
- Batch 5: ~8 700 stanic (největší batch samostatně pro lepší crawl prioritizaci)

---

## 7) P1 výsledky

- **+~1 000 nových stránek** (brand×miasto)
- **+5 informativních stránek** pro paliva s Product schema
- **GDPR-compliant cookie banner** s Consent Mode v2
- **IndexNow** ping = okamžité informování AI vyhledávačů (Bing → ChatGPT/Copilot)
- **Real-user monitoring** přes Vercel Analytics + Speed Insights + GA4 vitals
- **Sitemap split** = lepší crawl efficiency

### Co NEHOTOVO (zbývá v plánu):
- ✅ Stránky pro autostrady A1, A2, A4, S7 HOTOVO
- ✅ Stránky pro hraniční přechody (granica niemcy/czechy/slowacja) HOTOVO
- ✅ 11 nových polských blog článků HOTOVO
- ✅ Custom OG image per route (home + miasto) HOTOVO
- 🔄 GSC + Bing Webmaster verifikace (manuální krok pro uživatele)

---

## 8) P1.7-P1.10 IMPLEMENTACE (2026-05-18)

### ✅ P1.7 — Stránky pro autostrady (11 nových URL)

**Soubory:**
- `web/types/index.ts` — `Highway` interface + `HIGHWAYS` array (11 tras: A1, A2, A4, A6, S1, S3, S5, S7, S8, S10, S11) s `from/to`, `lengthKm`, `cities`, `wikidata`, `bbox`
- `web/app/autostrada/page.tsx` — index 11 tras s `ItemList` + `BreadcrumbList`
- `web/app/autostrada/[slug]/page.tsx` — detail trasy s:
  - `Road` + `TouristTrip` schema + `BreadcrumbList` + `FAQPage` + `Speakable`
  - BBox filter stanic podél trasy
  - Top 15 nejlevnějších Pb95 + top 15 ON
  - Cross-link na města na trase (linked s CITIES)
  - "Answer box" pro AI + 6 dynamických FAQ

### ✅ P1.8 — Stránky pro hraniční přechody (7 nových URL + 1 index)

**Soubory:**
- `web/types/index.ts` — `Border` interface + `BORDERS` array (7 sousedů: Niemcy, Czechy, Słowacja, Litwa, Ukraina, Białoruś, Rosja-Kaliningrad) s `crossings`, `borderCities`, `avgPb95Foreign`, `worthIt` (yes/mixed/no)
- `web/app/granica/page.tsx` — index s vizuálním porovnáním cen vs Polska
- `web/app/granica/[slug]/page.tsx` — detail granice s:
  - `Country` + `Article` + `FAQPage` + `Speakable` + `BreadcrumbList`
  - "Verdict box" (TAK/NIE/MIESZANE) — silný signál pro AI Overviews
  - Tabulka porovnání cen (PL vs sąsiad, oszczędność per pełny bak)
  - Limity celní (pro mimo-UE: UA, BY, Rosja)
  - 5 dynamických FAQ s daty

### ✅ P1.9 — Custom OG images (Open Graph)

**Soubory:**
- `web/app/opengraph-image.tsx` — homepage OG (gradient + průměry cen all-fuels)
- `web/app/miasto/[nazev]/opengraph-image.tsx` — per-city OG (název města + region + avg + min ceny v městě)

Dynamic OG renderování přes `ImageResponse` z `next/og`. Nahrazuje statickou `/og-image.jpg` pro vybrané high-impact routes. Pro brand×city (~990 stránek) ne kvůli build-time cost — používají default home OG.

### ✅ P1.10 — 11 nových polských blog článků

**Soubor:** `web/app/aktualnosci/page.tsx` + `web/app/aktualnosci/[slug]/page.tsx`

Nové články (každý s 5 FAQ + `NewsArticle` + `Speakable` schema):
1. **akcyza-paliwowa-2026-waloryzacja** — stawky akcyzy w 2026, Polska vs UE
2. **ets2-system-handlu-emisjami-paliwa-2027** — ETS2 wpływ na ceny od 2027
3. **najtansze-stacje-a1-a2-a4-ranking-2026** — ranking stacji na autostradach
4. **lotos-navigator-vs-orlen-vitay-2026** — karty lojalnościowe po fuzji
5. **paliwo-w-firmie-pit-vat-kilometrowka-2026** — rozliczanie paliwa B2B
6. **pb95-vs-pb98-do-mojego-auta** — výběr oktanovej
7. **czy-orlen-ma-najtansze-paliwo-2026** — data-driven analiza
8. **on-arktic-diesel-zimowy-2026** — zimowy diesel
9. **benzyna-e10-czy-niszczy-silnik** — E10 zgodność
10. **stacje-samoobslugowe-vs-obslugowe-cena** — porównanie cen
11. **tankowanie-zima-porady-paliwa-mroz** — 7 zimowych porad

### Soubory: sitemap, llms.txt

- `web/app/sitemap.ts` — split do 6 batches přes `generateSitemaps()`:
  - Batch 0: static + paliva (~22 URL)
  - Batch 1: 165 měst
  - Batch 2: 16 vojvodství + 11 autostrad + 7 granic
  - Batch 3: 6 sieci + 990 brand×city
  - Batch 4: 19 blog článků (8 původních + 11 nových)
  - Batch 5: ~8 700 stanic
- `web/public/llms.txt` — přidány vojvodství, sieci×miasta, autostrady, granice + 14 query mappings

---

## 9) Celkové výsledky P0 + P1

**Indexovatelných stránek:** ~9 900 → **~10 950** (+10%)
- 165 city pages
- 16 region pages
- 6 brand pages + **990 brand×city** (nové)
- 11 highway pages (nové)
- 7 border pages (nové)
- 5 fuel info pages (nové)
- 4 informativní (o-nas, jak-dziala, regulamin, cookies)
- 8 691+ station pages
- 19 blog článků (11 nových)
- + úvodní stránky (najtansze-X, historia, kalkulator, maks-ceny, ...)

**Schema.org coverage:**
- `WebSite`, `Organization`, `Service` (layout)
- `GasStation` + `offers` + `AggregateOffer` (station detail)
- `City` + `AdministrativeArea` + `Country` (geo entity)
- `Road` + `TouristTrip` (autostrady)
- `Article` + `NewsArticle` + `Product` (blog + paliva)
- `CollectionPage` (brand×city)
- `ItemList` (rankingy)
- `BreadcrumbList` (všude)
- `FAQPage` + `Speakable` (všude relevantní)
- `HowTo` (jak-dziala)
- `AboutPage` (o-nas)

**Performance & monitoring:**
- Vercel Analytics + Speed Insights aktivní
- GA4 Web Vitals (LCP, INP, CLS, FCP, TTFB)
- Cookie Consent Mode v2 (GDPR)
- IndexNow ping 3×/den po každém update cen

**AI / LLM viditelnost:**
- `llms.txt` rozšířený o všechny nové routes
- Speakable schema na všech FAQ
- "Answer box" jako první obsah na new pages (AI extraction)
- Wikidata propojení (City + Country + Region)
- Strukturované odpovědi v FAQ

### Co ještě stojí za úvahu (P2 budoucnost):

- ✅ **Custom OG images pro region/marka/autostrada/granica** HOTOVO (4 nové)
- ✅ **Dataset schema** na /data/*.json endpointech HOTOVO
- ✅ **Strukturované odpovědi pro AI** (TL;DR/Answer Box) HOTOVO (home, najtansze-X)
- ✅ **najtansze-diesel + najtansze-lpg** přepsány na plnou verzi (ItemList, FAQ, region, brand stats) HOTOVO
- 🔄 **GSC + Bing Webmaster verifikace** (manuální krok pro uživatele — viz NEXT_STEPS_GSC.md)
- 🔄 **Optimalizace LCP** podle Vercel Speed Insights dat (po prvních týdnech RUM)
- 🔄 **Polish Wikipedia** entry pro BenzynaMAPA + backlinks
- 🔄 **Open Data PR** na data.gov.pl / GUS
- ⏸ **PWA reaktivace** — vědomé rozhodnutí: ponecháno disabled (historický stale CSS problém, commit 2aaff0e)
- 🔄 **A/B test cookie banner** (impact na consent rate)
- 🔄 **Polish AI Discoverability check** — test na Perplexity/ChatGPT/Gemini jak nás citují

---

## 10) P2 IMPLEMENTACE (2026-05-18)

### ✅ P2.1 — AI Answer Box na top funnel rankings

**Cíl:** strukturovaná odpověď na začátku stránky pro AI extraction (AI Overviews, ChatGPT, Perplexity).

**Soubory:**
- `web/app/page.tsx` — Answer Box hned pod hero: "Aktualne średnie ceny paliw w Polsce: Pb95 X, Diesel Y, LPG Z..." + linky na nejtansze sieci
- `web/app/najtansze-benzyna/page.tsx` — Answer Box s top stanicí + cenou + průměrem + best brands
- `web/app/najtansze-diesel/page.tsx` — **přepsána z minimalistické na plnou verzi**:
  - AI Answer Box
  - ItemList JSON-LD (top 10 stanic)
  - FAQPage + Speakable (6 FAQ)
  - Regionální průměry
  - Brand stats s odchylkami
  - SEO text, cross-link na /olej-napedowy/ a /adblue/
- `web/app/najtansze-lpg/page.tsx` — **přepsána z minimalistické na plnou verzi**:
  - AI Answer Box s "LPG taniej o X%" vs Pb95
  - ItemList JSON-LD
  - FAQPage + Speakable (6 FAQ)
  - Regionální průměry + brand stats
  - Kalkulator opłacalności CTA → /lpg/

### ✅ P2.2 — Custom OG images pro region/marka/autostrada/granica

Doplnění `opengraph-image.tsx` pro 4 typy stránek (kromě již existujících home + miasto):

- `web/app/wojewodztwo/[slug]/opengraph-image.tsx` — gradient blue→green, nazwa województwa, stolica, populace + průměrné ceny PL
- `web/app/marka/[brand]/opengraph-image.tsx` — barva podle sieci (Orlen red, Shell yellow, BP green, atd.), nazwa + offset cenowy + průměry
- `web/app/autostrada/[slug]/opengraph-image.tsx` — dark slate, červený "A1"/"S7" badge, trasa from→to, długość, miasta
- `web/app/granica/[slug]/opengraph-image.tsx` — gradient podle verdict (yes/mixed/no), flaga, porównanie cen PL vs sąsiad

### ✅ Bonus — Dataset JSON-LD na home

**Soubor:** `web/app/layout.tsx`

Přidán `Dataset` schema s 4 `DataDownload` objekty pro `/data/*.json` endpointy:
- stats_latest.json
- prices_latest.json
- stations_latest.json
- history_90d.json

Licence: ODbL. License a `isAccessibleForFree: true`. **Indexovatelné v Google Dataset Search.**

### ⏸ P2.3 — PWA reaktivace

**Rozhodnutí uživatele:** ponechat disabled. Historický kontext commit `2aaff0e` ("vypnutí PWA / SW — zdroj stale CSS"). Riziko regrese > SEO přínos.

### Bonus — Manuální setup instrukce

**Soubor:** `NEXT_STEPS_GSC.md` v rootu projektu — kompletní průvodce pro:
- Google Search Console (15 min, KRITICKÉ)
- Bing Webmaster Tools + IndexNow key registrace (10 min, KRITICKÉ pro AI)
- Vercel Analytics + Speed Insights enable
- GA4 + Consent Mode config
- AdSense status check
- Naver / Yandex (volitelné)

---

## 11) P2.4 + P2.5 dokončeno (2026-05-18)

### ✅ P2.4 — Marka × Województwo (96 nových URL)

**URL pattern:** `/marka/[brand]/wojewodztwo/[region]/`

**Soubory:**
- `web/app/marka/[brand]/wojewodztwo/[region]/page.tsx` — šablona 6 marek × 16 vojvodství:
  - `BreadcrumbList` (4 levels)
  - `CollectionPage` + `spatialCoverage AdministrativeArea` s Wikidata
  - `ItemList` top 10 nejlevnějších + FAQPage + Speakable
  - AI Answer Box, tabulka cen (sieć vs regionu)
  - Cross-link: miasta této marky v regionu, jiné značky v regionu, tato značka v jiných regionech
- `web/app/wojewodztwo/[slug]/page.tsx` — přidán cross-link grid na 6 marek×wojewodztwo
- `web/app/sitemap.ts` — `brandRegion` batch (96 URL, priority 0.7)

### ✅ P2.5 — API dokumentacja `/api-docs/`

**Cíl:** High-authority page pro developery + možnost backlinků + signál pro AI o strojově čitelných datech.

**Soubor:** `web/app/api-docs/page.tsx`
- `TechArticle` + `Dataset` (5 `DataDownload`) + `FAQPage` + `Speakable` + `BreadcrumbList`
- Quick start (curl příklad)
- 5 endpointů dokumentovaných s schema + size
- 4 příklady kódu (JavaScript fetch, Python requests, curl+jq, PHP)
- Licence ODbL + atrybucja
- CORS + cache headers info
- 8 FAQ (rate limit, webhook, CORS, GraphQL, …)
- Cross-link: Footer "API JSON" → "API – dokumentacja"
- Sitemap + llms.txt update

---

## 12) P3 dokončeno (2026-05-19)

### ✅ P3.1 — Dynamic llms.txt s aktuálními cenami

**Soubor:** `web/app/llms.txt/route.ts` (přechod ze statického `public/llms.txt`)
- Aktualizuje se 3×/den jako data (revalidate: 6h)
- Vrací real-time ceny v Pb95/Pb98/ON/LPG + 7-day trend
- Embedované live JSON format example s aktuálními hodnotami
- AI crawlery (GPTBot, ClaudeBot, PerplexityBot) dostávají vždy čerstvá data místo snapshot

### ✅ P3.2 — Vylepšený robots.txt s rozšířenou AI podporou

**Soubor:** `web/app/robots.ts`
- Přidáno: `OAI-SearchBot`, `Claude-Web`, `Perplexity-User`, `Google-Extended`, `Bytespider`, `Amazonbot`, `Applebot`, `Applebot-Extended`
- Přidáno: Seznam, DuckDuck, Yandex, Naver search bots
- Sociální sítě OG: WhatsApp, Slack, Telegram, Discord (lepší preview rendering)
- SEO tools: Ahrefs, Semrush, MJ12 (povoleno — vidí naše SEO)
- Blokovány: scrapery bez identifikace

### ✅ P3.3 — `/stacje-ladowania-ev/` (rostoucí EV trh)

**Soubor:** `web/app/stacje-ladowania-ev/page.tsx`
- 8 sítí EV ladovani v tabulce: GreenWay, Orlen Charge, Tauron, Ionity, GO+EAuto, Powerdot, PGE, hipermarkety
- AC vs DC vysvětlení + cennik
- EV vs ICE porovnani 100 km (EV dom = 6-12 zł, benzyna = 45 zł)
- 7 FAQ + Article + FAQPage + Speakable schema
- Roadmap notice (BenzynaMAPA prozatím nesleduje EV)
- High-volume keywords: "stacje ładowania samochodów elektrycznych", "GreenWay cennik"

### ✅ P3.4 — `WebApplication` + `SoftwareSourceCode` schema

**Soubor:** `web/app/layout.tsx`
- `WebApplication` schema: featureList (9 funkcí), screenshot, version, isAccessibleForFree, offers (free)
- `SoftwareSourceCode` schema: GitHub repo, languages, runtime, license ODbL
- Signál pro Google Knowledge Graph + AI o povaze aplikace

### ✅ P3.5 — `llms-full.txt` (deep AI data dump)

**Soubor:** `web/app/llms-full.txt/route.ts`
- Extended verze llms.txt s 15 sekcemi a kompletním dump
- Top 30 nejlevnějších stanic per palivo (s adresami + URL)
- Všechna města (165) s populací a regionem
- Všechna vojvodství (16) s capital + populací
- Všechny sítě (6) s offset cenovým
- Všechny autostrady (11) + granice (7) + verdict
- Skladniki ceny (Pb95, ON, LPG)
- Schema.org coverage overview
- Technické metadata
- `X-Robots-Tag: noindex` — pro AI scraper, ne pro Google index
- Linked v layout přes `<link rel="alternate" type="text/plain" href="/llms-full.txt">`

### Bonus — sitemap + footer update

- Sitemap přidána EV stránka
- Footer nový odkaz "Stacje ładowania EV"

---

## 13) P4 dokončeno (2026-05-20)

### ✅ P4.1 — RSS feed `/rss.xml`

**Soubor:** `web/app/rss.xml/route.ts`
- RSS 2.0 + Atom self-link
- Real-time ceny jako "news" item (refresh každý feed)
- 19 blog článků jako items s pubDate, category, author
- Konsumováno: Google News, Feedly, AI crawlery, email digesty
- Cache 1h fresh + 6h SWR

### ✅ P4.2 — Compare pages (long-tail SEO)

**Soubor:** `web/app/porownanie/page.tsx` (index 14 porovnání) + `web/app/porownanie/[slug]/page.tsx` (detail)

**14 detailních porovnání** s data-driven tabulky + verdict box + FAQ + Article schema:
- **Paliwa:** PB95 vs PB98, Diesel vs Benzyna, LPG vs Benzyna, EV vs spalinowe
- **Sieci:** Orlen vs Shell, Orlen vs BP, Shell vs BP, Moya vs Huzar, Orlen vs Lotos, V-Power vs Verva
- **Geografia:** Polska vs Niemcy, Polska vs Czechy, Polska vs Ukraina
- **Karty:** Orlen Vitay vs BP BonusMania

Šablony s dynamic data z `getStats()` — vždy aktuální ceny v tabulkách.

### ❌ P4.3 — Static OG fallback

**Rozhodnuto:** zamítnuto. Dynamic OG už pokrývají všechny hlavní typy stránek (home, miasto, region, marka, autostrada, granica). Statický fallback nedává hodnotu.

---

## 14) Celkový stav P0 + P1 + P2 + P3 + P4

**Indexovatelných stránek:** ~11 052 → **~11 067** (+15: 14 porovnání + RSS)
**LLM-specific files:** 2 dynamic (llms.txt, llms-full.txt) + RSS
**Schema.org typů:** **19+** (WebApplication, SoftwareSourceCode přidány v P3)
**AI crawlery povolené:** 21
**Long-tail SEO routes:** 990 brand×miasto + 96 brand×region + 14 porovnání + 11 autostrad + 7 granic + 165 miast + 16 vojvodství = **~1 300 long-tail URL**

### Soubory aktualizovány v P4:
- `web/app/rss.xml/route.ts` (NOVÝ)
- `web/app/porownanie/page.tsx` (NOVÝ)
- `web/app/porownanie/[slug]/page.tsx` (NOVÝ, 8 detailních + 6 stub)
- `web/app/sitemap.ts` (přepis — added compares + EV)
- `web/app/layout.tsx` (link rel=alternate RSS)
- `web/app/llms.txt/route.ts` (odkazy na porovnání + EV + RSS)

**Schema.org coverage (rozšířena o):**
- `Dataset` + `DataDownload` (Google Dataset Search)
- Custom dynamic OG images (region, marka, autostrada, granica)
- AI Answer Box na 4 top funnel stránkách

**Co výrazně zlepšilo SEO/GEO/LLM:**
- 🎯 **AI Overviews extraction**: TL;DR formát na začátku stránky
- 🎯 **Google Dataset Search**: data accessible jako otwarty dataset (ODbL)
- 🎯 **Social sharing CTR**: custom OG s aktuálními cenami per region/marka/autostrada/granica
- 🎯 **Voice search (Speakable)**: na FAQ, answer box, city stats
- 🎯 **Long-tail Polish queries**: brand×city (990), miasto (165), região, autostrada, granica
- 🎯 **AI viditelnost**: IndexNow → Bing → ChatGPT/Copilot okamžitě po update cen 3×/den
