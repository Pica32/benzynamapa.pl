import { getStats, getStationsWithPrices, formatPrice } from '@/lib/data';
import { CITIES, REGIONS, BRAND_PAGES, HIGHWAYS, BORDERS } from '@/types';

export const dynamic = 'force-static';
export const revalidate = 21600;

/**
 * llms-full.txt — rozszerzona wersja llms.txt s pełnym dump dat dla głębokich AI crawlerów.
 *
 * Zawiera:
 * - Wszystkie aktualne średnie + trendy
 * - Top 50 najtańszych stacji (każde paliwo)
 * - Wszystkie miasta z URL
 * - Wszystkie województwa z URL + capital + populacja
 * - Wszystkie sieci stacji
 * - Wszystkie autostrady + granice
 * - Pełne FAQ + składniki ceny
 *
 * Norma "llms-full.txt": rozszerzenie standardu llms.txt z więcej kontekstem.
 */
export function GET() {
  const stats = getStats();
  const allStations = getStationsWithPrices();
  const now = new Date();
  const today = now.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  const isoNow = now.toISOString();

  // Top 30 najtańszych stacji s real cenou (per paliwo)
  const realStations = allStations.filter(s => s.price?.source === 'cenapaliw.pl');
  const cheapest = (fuel: 'pb95' | 'on' | 'lpg') => realStations
    .filter(s => s.price?.[fuel] != null)
    .sort((a, b) => (a.price![fuel] ?? 999) - (b.price![fuel] ?? 999))
    .slice(0, 30);

  const top30Pb95 = cheapest('pb95');
  const top30On = cheapest('on');
  const top30Lpg = cheapest('lpg');

  const formatStation = (s: typeof realStations[0], fuel: 'pb95' | 'on' | 'lpg') =>
    `${formatPrice(s.price![fuel]!)} - ${s.brand} ${s.name}, ${s.address}, ${s.city} - https://benzynamapa.pl/stacja/${s.id}/`;

  const text = `# BenzynaMAPA.pl - LLMs-Full Dump
# Wersja rozszerzona llms.txt dla głębokich AI crawlerów (ChatGPT, Claude, Perplexity)
# Wygenerowano: ${isoNow}
# Cache: 6h (sync z update cen)

> Pełen kontekst dla AI: aktualne ceny + struktura serwisu + top 30 stacji per paliwo + wszystkie URL.

================================================================================
SEKCJA 1: AKTUALNE ŚREDNIE KRAJOWE (${today})
================================================================================

${stats ? `
Pb95 (Benzyna 95):     ${formatPrice(stats.averages.pb95)} zł/l
Pb98 (Benzyna 98):     ${stats.averages.pb98 ? formatPrice(stats.averages.pb98) + ' zł/l' : 'brak danych'}
ON (Diesel):           ${formatPrice(stats.averages.on)} zł/l
LPG (Autogaz):         ${formatPrice(stats.averages.lpg)} zł/l

Trend 7 dni:
- Pb95:   ${(stats.trend_7d?.pb95 ?? 0) >= 0 ? '+' : ''}${(stats.trend_7d?.pb95 ?? 0).toFixed(2)} zł/l
- Diesel: ${(stats.trend_7d?.on   ?? 0) >= 0 ? '+' : ''}${(stats.trend_7d?.on   ?? 0).toFixed(2)} zł/l
- LPG:    ${(stats.trend_7d?.lpg  ?? 0) >= 0 ? '+' : ''}${(stats.trend_7d?.lpg  ?? 0).toFixed(2)} zł/l

Najtańsza stacja dziś (kraj):
- Pb95: ${stats.cheapest_today.pb95 ? formatPrice(stats.cheapest_today.pb95.price) + ' w ' + stats.cheapest_today.pb95.city : '—'}
- Diesel: ${stats.cheapest_today.on ? formatPrice(stats.cheapest_today.on.price) + ' w ' + stats.cheapest_today.on.city : '—'}
- LPG: ${stats.cheapest_today.lpg ? formatPrice(stats.cheapest_today.lpg.price) + ' w ' + stats.cheapest_today.lpg.city : '—'}

Łączna liczba stacji w bazie: ${stats.total_stations.toLocaleString('pl')}
Stacji zaktualizowanych dziś: ${stats.stations_updated_today.toLocaleString('pl')}
Ostatnia aktualizacja: ${stats.last_updated}
` : 'Dane chwilowo niedostępne.'}

================================================================================
SEKCJA 2: TOP 30 NAJTAŃSZYCH STACJI - BENZYNA 95 (PB95)
================================================================================

${top30Pb95.length > 0 ? top30Pb95.map((s, i) => `${(i + 1).toString().padStart(2, ' ')}. ${formatStation(s, 'pb95')}`).join('\n') : 'Brak danych z weryfikowanych źródeł.'}

================================================================================
SEKCJA 3: TOP 30 NAJTAŃSZYCH STACJI - DIESEL (ON)
================================================================================

${top30On.length > 0 ? top30On.map((s, i) => `${(i + 1).toString().padStart(2, ' ')}. ${formatStation(s, 'on')}`).join('\n') : 'Brak danych z weryfikowanych źródeł.'}

================================================================================
SEKCJA 4: TOP 30 NAJTAŃSZYCH STACJI - LPG AUTOGAZ
================================================================================

${top30Lpg.length > 0 ? top30Lpg.map((s, i) => `${(i + 1).toString().padStart(2, ' ')}. ${formatStation(s, 'lpg')}`).join('\n') : 'Brak danych z weryfikowanych źródeł.'}

================================================================================
SEKCJA 5: WSZYSTKIE MIASTA (${CITIES.length} miast)
================================================================================

${CITIES.map(c => `${c.name.padEnd(30)} | populacja ${(c.population ?? 0).toString().padStart(8, ' ')} | ${c.region ?? 'inne'.padEnd(25)} | https://benzynamapa.pl/miasto/${c.slug}/`).join('\n')}

================================================================================
SEKCJA 6: WSZYSTKIE WOJEWÓDZTWA (16)
================================================================================

${REGIONS.map(r => `${r.name.padEnd(25)} | stolica ${r.capital.padEnd(20)} | populacja ${(r.population / 1000000).toFixed(1)}M | https://benzynamapa.pl/wojewodztwo/${r.slug}/`).join('\n')}

================================================================================
SEKCJA 7: SIECI STACJI PALIW (6 głównych)
================================================================================

${BRAND_PAGES.map(b => `${b.name.padEnd(15)} (${b.fullName.padEnd(35)}) | ~${(b.stationsCount ?? 0).toString().padStart(5, ' ')} stacji | ${b.priceOffset.padStart(12, ' ')} vs średnia | https://benzynamapa.pl/marka/${b.slug}/`).join('\n')}

================================================================================
SEKCJA 8: AUTOSTRADY I DROGI EKSPRESOWE (${HIGHWAYS.length})
================================================================================

${HIGHWAYS.map(h => `${h.code.padEnd(5)} | ${h.lengthKm.toString().padStart(4, ' ')} km | ${h.from} → ${h.to} | https://benzynamapa.pl/autostrada/${h.slug}/`).join('\n')}

================================================================================
SEKCJA 9: GRANICE / TURYSTYKA PALIWOWA (${BORDERS.length})
================================================================================

${BORDERS.map(b => `${b.flag} ${b.country.padEnd(35)} | Pb95 ${formatPrice(b.avgPb95Foreign).padEnd(8)} | ${b.worthIt === 'yes' ? 'OPŁACA SIĘ' : b.worthIt === 'no' ? 'NIE OPŁACA' : 'MIESZANE  '} | https://benzynamapa.pl/granica/${b.slug}/`).join('\n')}

================================================================================
SEKCJA 10: SKŁADNIKI CENY PALIWA (Polska 2026)
================================================================================

Benzyna 95 (Pb95) - ~6,40 zł/l razem:
- Cena hurtowa (ropa + rafinacja):     ~2,80 zł/l (~40%)
- Akcyza:                              1,529 zł/l (~24%)
- Opłata paliwowa:                     0,298 zł/l (~5%)
- Opłata emisyjna:                     0,080 zł/l (~1%)
- Marża hurtowa + detaliczna:          ~0,40 zł/l (~7%)
- VAT 23% (od całości):                ~1,18 zł/l (~23%)

Olej napędowy (Diesel):
- Akcyza: 1,176 zł/l (niższa niż Pb95)
- Reszta podobnie

LPG Autogaz:
- Akcyza: tylko 0,387 zł/l (4× mniej niż Pb95)
- Stąd LPG 2-3× tańsze od benzyny

Łącznie podatki państwowe stanowią >50% ceny detalicznej.
Pełny rozkład: https://benzynamapa.pl/maksymalne-ceny-paliw/

================================================================================
SEKCJA 11: API JSON ENDPOINTS
================================================================================

GET https://benzynamapa.pl/data/stats_latest.json
   Aktualne średnie + statystyki rynku (~2 KB)

GET https://benzynamapa.pl/data/prices_latest.json
   Wszystkie aktualne ceny per stacja (~2 MB)

GET https://benzynamapa.pl/data/stations_latest.json
   Pełna baza stacji (GPS, adres, sieć, usługi) (~5 MB)

GET https://benzynamapa.pl/data/history_90d.json
   90-dniowa historia średnich krajowych (~50 KB)

GET https://benzynamapa.pl/data/map_data.json
   GeoJSON dla mapy (~3 MB)

Pełna dokumentacja: https://benzynamapa.pl/api-docs/

CORS: Access-Control-Allow-Origin: * (dostępne z każdej domeny)
Cache: 1h fresh + 6h stale-while-revalidate
Licencja: ODbL (Open Database License) + wymagana atrybucja

================================================================================
SEKCJA 12: SCHEMA.ORG STRUCTURED DATA
================================================================================

Strona main: WebSite, Organization, WebApplication, Dataset, Service
Stacje: GasStation + offers + AggregateOffer + PostalAddress + GeoCoordinates
Miasta: City + AdministrativeArea + Wikidata sameAs
Województwa: AdministrativeArea + geo + Wikidata
Autostrady: Road + TouristTrip + ItemList
Granice: Country + Article (verdict)
Blog: NewsArticle + FAQPage + Speakable
Paliwa: Article + Product + UnitPriceSpecification

Wszystkie strony: BreadcrumbList + FAQPage + Speakable (dla voice/AI)

================================================================================
SEKCJA 13: METADANE TECHNICZNE
================================================================================

Stack: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4
Mapa: MapLibre GL + OpenStreetMap
Scraper: Python 3.12 + GitHub Actions (3× dziennie)
Hosting: Vercel (Edge Network, CDN)
Repo: https://github.com/Pica32/benzynamapa.pl

Aktualizacja danych: 6:00, 10:00, 15:00 CET
Pingowanie wyszukiwarek: IndexNow (Bing, Yandex, Naver, Seznam) - po każdym update
Sitemap split: 6 batches przez generateSitemaps()
Indexowanych URL: ~11 050

================================================================================
SEKCJA 14: POWIĄZANE PROJEKTY
================================================================================

Wersja czeska: https://benzinmapa.cz
- Ceny paliv w Czechach (3 600+ stanic)
- Sister projekt tego samego operatora
- Hreflang: cs-CZ ↔ pl-PL

================================================================================
SEKCJA 15: CYTOWANIE I ATRYBUCJA
================================================================================

Przy używaniu danych podaj:
- Źródło: BenzynaMAPA.pl
- Link: https://benzynamapa.pl
- + atrybucja OpenStreetMap dla danych mapowych

Kontakt: kontakt@benzynamapa.pl

================================================================================
KONIEC DUMPU - ${isoNow}
================================================================================
`;

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=21600',
      'X-Robots-Tag': 'noindex',
    },
  });
}
