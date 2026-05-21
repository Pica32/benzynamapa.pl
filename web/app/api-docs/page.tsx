import type { Metadata } from 'next';
import Link from 'next/link';
import { Code, Database, Download, Key, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'API – darmowe dane o cenach paliw w Polsce | BenzynaMAPA',
  description: 'Otwarte API z aktualnymi cenami benzyny, diesla i LPG na 8 600+ stacjach w Polsce. JSON endpointy, ODbL licencja, aktualizacja 3× dziennie. Darmowe do użytku niekomercyjnego.',
  alternates: { canonical: 'https://benzynamapa.pl/api-docs/' },
  keywords: [
    'API ceny paliw Polska', 'JSON ceny paliw', 'open data paliwa',
    'API stacje paliw', 'darmowe API benzyna', 'BenzynaMAPA API',
    'OpenStreetMap stacje paliw', 'webhook ceny paliw',
  ],
  openGraph: {
    title: 'API BenzynaMAPA – darmowe dane o cenach paliw',
    description: 'JSON endpointy z aktualnymi cenami paliw w Polsce.',
    url: 'https://benzynamapa.pl/api-docs/',
    siteName: 'BenzynaMAPA',
    locale: 'pl_PL',
    type: 'article',
  },
};

const ENDPOINTS = [
  {
    name: 'stats_latest.json',
    url: '/data/stats_latest.json',
    description: 'Aktualne średnie ceny + statystyki rynku',
    size: '~2 KB',
    schema: {
      last_updated: 'ISO 8601 timestamp',
      averages: { pb95: 'number (zł/l)', pb98: 'number', on: 'number', lpg: 'number' },
      cheapest_today: { pb95: '{ price, station_id, city }', '...': '...' },
      trend_7d: { pb95: 'number (zmiana w zł/l)', on: 'number', lpg: 'number' },
      total_stations: 'number',
      stations_updated_today: 'number',
    },
  },
  {
    name: 'prices_latest.json',
    url: '/data/prices_latest.json',
    description: 'Wszystkie aktualne ceny paliw (jeden rekord per stacja)',
    size: '~2 MB',
    schema: {
      prices: '[{ station_id, pb95, pb98, on, lpg, source, reported_at }]',
    },
  },
  {
    name: 'stations_latest.json',
    url: '/data/stations_latest.json',
    description: 'Pełna baza stacji paliw (GPS, adres, sieć, usługi)',
    size: '~5 MB',
    schema: {
      stations: '[{ id, name, brand, lat, lng, address, city, region, services[], opening_hours }]',
    },
  },
  {
    name: 'history_90d.json',
    url: '/data/history_90d.json',
    description: '90-dniowa historia średnich cen krajowych',
    size: '~50 KB',
    schema: {
      history: '[{ date, pb95, pb98, on, lpg }]',
    },
  },
  {
    name: 'map_data.json',
    url: '/data/map_data.json',
    description: 'GeoJSON dla mapy (stacje + cluster data)',
    size: '~3 MB',
    schema: { type: '"FeatureCollection"', features: '[GeoJSON Feature]' },
  },
];

const FAQS = [
  {
    q: 'Czy API jest darmowe?',
    a: 'Tak, do użytku niekomercyjnego (osobistego, edukacyjnego, badawczego, jednostkowych projektów open-source). Wymagane podanie źródła: "Źródło: BenzynaMAPA.pl" + link do https://benzynamapa.pl. Komercyjne wykorzystanie - kontakt: kontakt@benzynamapa.pl.',
  },
  {
    q: 'Jak często aktualizowane są dane?',
    a: 'Wszystkie endpointy są regenerowane 3× dziennie (6:00, 10:00, 15:00 CET) przez automatyczne pipeline GitHub Actions. Każdy rekord ma znacznik czasu (last_updated, reported_at).',
  },
  {
    q: 'Jaka jest licencja danych?',
    a: 'Dane stacji (lokalizacje, adresy) pochodzą z OpenStreetMap - licencja ODbL (Open Database License). Ceny są naszą agregacją z publicznych źródeł. Wymagamy podania atrybucji "Źródło: BenzynaMAPA.pl + OpenStreetMap".',
  },
  {
    q: 'Czy jest rate limit?',
    a: 'Endpointy są serwowane jako statyczne pliki JSON z CDN Vercel - brak rate limit dla normalnego użytku. Prosimy o cache po stronie aplikacji (Cache-Control: max-age=3600 jest ustawiony).',
  },
  {
    q: 'CORS - czy mogę używać z przeglądarki?',
    a: 'Tak. Wszystkie endpointy mają Access-Control-Allow-Origin: * - dostępne z każdej domeny w przeglądarce (fetch, axios, jQuery).',
  },
  {
    q: 'Czy jest webhook / powiadomienia?',
    a: 'Aktualnie nie. Polecamy polling raz na 6 godzin lub subskrypcję IndexNow (Bing). Dla komercyjnych klientów rozważamy webhook za opłatą - kontakt.',
  },
  {
    q: 'Czy API obsługuje filtrowanie po GPS / mieście?',
    a: 'Aktualnie nie - serwujemy pełne snapshoty. Aby filtrować, pobierz stations_latest.json i przefiltruj po lat/lng/city w aplikacji. Dla flot z dużą ilością zapytań rozważamy graphql endpoint - kontakt.',
  },
  {
    q: 'Co to są historyczne ceny?',
    a: 'history_90d.json zawiera średnie krajowe per dzień przez ostatnie 90 dni. Historia per stacja nie jest publicznie dostępna - tylko snapshot bieżący. Dłuższa historia dla klientów komercyjnych.',
  },
];

const EXAMPLES = [
  {
    title: 'JavaScript (fetch)',
    lang: 'javascript',
    code: `const stats = await fetch('https://benzynamapa.pl/data/stats_latest.json')
  .then(r => r.json());

console.log(\`Średnia Pb95: \${stats.averages.pb95} zł/l\`);
console.log(\`Trend 7 dni: \${stats.trend_7d.pb95 > 0 ? '+' : ''}\${stats.trend_7d.pb95.toFixed(2)} zł\`);`,
  },
  {
    title: 'Python (requests)',
    lang: 'python',
    code: `import requests

stats = requests.get('https://benzynamapa.pl/data/stats_latest.json').json()
print(f"Średnia Pb95: {stats['averages']['pb95']} zł/l")
print(f"Liczba stacji: {stats['total_stations']:,}")`,
  },
  {
    title: 'curl',
    lang: 'bash',
    code: `# Aktualne średnie
curl https://benzynamapa.pl/data/stats_latest.json | jq '.averages'

# Najtańsza Pb95 dziś
curl https://benzynamapa.pl/data/stats_latest.json | jq '.cheapest_today.pb95'`,
  },
  {
    title: 'PHP',
    lang: 'php',
    code: `<?php
$stats = json_decode(file_get_contents('https://benzynamapa.pl/data/stats_latest.json'));
echo "Średnia Pb95: {$stats->averages->pb95} zł/l\\n";`,
  },
];

export default function ApiDocsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://benzynamapa.pl/' },
              { '@type': 'ListItem', position: 2, name: 'API – dokumentacja', item: 'https://benzynamapa.pl/api-docs/' },
            ],
          },
          {
            '@type': 'TechArticle',
            headline: 'API BenzynaMAPA – dokumentacja JSON endpointów',
            description: 'Otwarte API z aktualnymi cenami paliw w Polsce. JSON endpointy, przykłady kodu, licencja ODbL.',
            datePublished: '2026-05-18',
            dateModified: new Date().toISOString(),
            author: { '@type': 'Organization', name: 'BenzynaMAPA.pl' },
            publisher: { '@type': 'Organization', name: 'BenzynaMAPA.pl', logo: { '@type': 'ImageObject', url: 'https://benzynamapa.pl/icon-512.png' } },
            mainEntityOfPage: 'https://benzynamapa.pl/api-docs/',
            inLanguage: 'pl',
            proficiencyLevel: 'Beginner',
          },
          {
            '@type': 'Dataset',
            name: 'BenzynaMAPA API – ceny paliw Polska',
            description: 'API JSON z aktualnymi cenami benzyny 95, benzyny 98, diesla i LPG na 8 600+ stacjach paliw w Polsce.',
            url: 'https://benzynamapa.pl/api-docs/',
            license: 'https://opendatacommons.org/licenses/odbl/1-0/',
            isAccessibleForFree: true,
            creator: { '@type': 'Organization', name: 'BenzynaMAPA.pl' },
            keywords: ['API', 'ceny paliw', 'benzyna', 'diesel', 'LPG', 'JSON', 'OpenStreetMap', 'open data'],
            spatialCoverage: { '@type': 'Country', name: 'Polska', '@id': 'https://www.wikidata.org/wiki/Q36' },
            distribution: ENDPOINTS.map(e => ({
              '@type': 'DataDownload',
              encodingFormat: 'application/json',
              contentUrl: `https://benzynamapa.pl${e.url}`,
              name: e.name,
              description: e.description,
            })),
          },
          {
            '@type': 'FAQPage',
            mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
            speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.faq-question', '.api-summary'] },
          },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Strona główna</Link>
          <span className="mx-2">›</span>
          <span>API – dokumentacja</span>
        </nav>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Code className="text-green-600" size={28} />
          API BenzynaMAPA – dokumentacja JSON
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Otwarte API z aktualnymi cenami paliw na 8 600+ stacjach w Polsce.
          Darmowe do użytku niekomercyjnego, aktualizacja 3× dziennie, licencja ODbL.
        </p>

        {/* Summary cards */}
        <div className="api-summary grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
            <Database size={24} className="mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-black text-green-700 dark:text-green-400">5</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">JSON endpointów</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
            <Zap size={24} className="mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-black text-blue-700 dark:text-blue-400">3×</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">dziennie</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 text-center">
            <Key size={24} className="mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-black text-purple-700 dark:text-purple-400">FREE</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">bez API key</div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-center">
            <Download size={24} className="mx-auto mb-2 text-amber-600" />
            <div className="text-2xl font-black text-amber-700 dark:text-amber-400">ODbL</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">licencja</div>
          </div>
        </div>

        {/* Quick start */}
        <section className="mb-10 bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Szybki start</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            API jest pre-rendered jako statyczne pliki JSON serwowane z CDN Vercel.
            Brak rejestracji, brak API key, brak rate limit dla normalnego użytku.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
            <pre className="text-sm text-green-400 font-mono">
              <code>curl https://benzynamapa.pl/data/stats_latest.json</code>
            </pre>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Response: JSON z aktualnymi średnimi krajowymi (Pb95, Pb98, ON, LPG), trendem 7-dniowym i licznikiem stacji.
          </p>
        </section>

        {/* Endpoints */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Endpointy</h2>
          <div className="space-y-4">
            {ENDPOINTS.map(e => (
              <div key={e.name} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs font-bold px-2 py-0.5 rounded">GET</span>
                    <code className="text-sm font-mono text-gray-900 dark:text-white">{e.url}</code>
                  </div>
                  <span className="text-xs text-gray-400">~{e.size}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{e.description}</p>
                <details className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3">
                  <summary className="text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">Schema (JSON)</summary>
                  <pre className="text-xs text-gray-600 dark:text-gray-400 mt-2 overflow-x-auto font-mono">
                    {JSON.stringify(e.schema, null, 2)}
                  </pre>
                </details>
                <div className="mt-3">
                  <a href={e.url} target="_blank" rel="noopener noreferrer" className="text-sm text-green-700 dark:text-green-400 hover:underline font-medium">
                    → Otwórz endpoint live
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Examples */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Przykłady użycia</h2>
          <div className="space-y-4">
            {EXAMPLES.map(ex => (
              <div key={ex.title} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                  <Code size={14} className="text-gray-500" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{ex.title}</span>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm font-mono leading-relaxed">
                  <code>{ex.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>

        {/* Licencja */}
        <section className="mb-10 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Key size={20} className="text-amber-600" />
            Licencja i atrybucja
          </h2>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc pl-5">
            <li><strong>Dane stacji</strong> (lokalizacje, adresy): <a href="https://opendatacommons.org/licenses/odbl/1-0/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ODbL</a> (Open Database License) - z OpenStreetMap.</li>
            <li><strong>Ceny paliw</strong>: agregacja z publicznych źródeł, nasza praca - wymagana atrybucja.</li>
            <li><strong>Wymagana atrybucja:</strong> "Źródło: BenzynaMAPA.pl + OpenStreetMap" + aktywny link do https://benzynamapa.pl</li>
            <li><strong>Użytek niekomercyjny</strong> (osobisty, edukacyjny, badawczy, open-source): za darmo</li>
            <li><strong>Komercyjny</strong>: kontakt z operatorem - kontakt@benzynamapa.pl</li>
          </ul>
        </section>

        {/* CORS info */}
        <section className="mb-10 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">CORS &amp; Cache</h2>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc pl-5">
            <li><code className="bg-blue-100 dark:bg-blue-900/40 px-1.5 py-0.5 rounded text-xs">Access-Control-Allow-Origin: *</code> - dostępne z każdej domeny</li>
            <li><code className="bg-blue-100 dark:bg-blue-900/40 px-1.5 py-0.5 rounded text-xs">Cache-Control: public, max-age=3600, stale-while-revalidate=7200</code> - 1h fresh, 2h SWR</li>
            <li><code className="bg-blue-100 dark:bg-blue-900/40 px-1.5 py-0.5 rounded text-xs">Content-Type: application/json; charset=utf-8</code></li>
            <li>CDN: Vercel Edge Network - latency &lt; 100 ms z Europy</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">FAQ</h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <summary className="faq-question font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
                  {q}
                  <span className="text-green-600 group-open:rotate-180 transition-transform ml-3 flex-shrink-0">▼</span>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/o-nas/" className="text-green-700 dark:text-green-400 hover:underline">→ O nas</Link>
          <Link href="/jak-dziala/" className="text-green-700 dark:text-green-400 hover:underline">→ Jak działa BenzynaMAPA</Link>
          <Link href="/regulamin/" className="text-green-700 dark:text-green-400 hover:underline">→ Regulamin</Link>
          <a href="https://github.com/Pica32/benzynamapa.pl" target="_blank" rel="noopener noreferrer" className="text-green-700 dark:text-green-400 hover:underline">→ GitHub repo</a>
        </div>
      </div>
    </>
  );
}
