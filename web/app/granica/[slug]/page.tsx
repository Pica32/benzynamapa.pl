import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BORDERS, CITIES } from '@/types';
import { getStats, formatPrice, slugify } from '@/lib/data';
import { Globe, MapPin } from 'lucide-react';

export const revalidate = 86400;
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return BORDERS.map(b => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const border = BORDERS.find(b => b.slug === slug);
  if (!border) return { title: 'Granica nie znaleziona' };

  return {
    title: `Ceny paliw przy granicy z ${border.country} – tankowanie 2026 | BenzynaMAPA`,
    description: `Czy opłaca się tankować w ${border.country}? Porównanie cen paliw, najbliższe stacje w Polsce, limity celne, przejścia graniczne. ${border.description.slice(0, 80)}`,
    alternates: { canonical: `https://benzynamapa.pl/granica/${slug}/` },
    openGraph: {
      title: `Granica z ${border.country} ${border.flag} – ceny paliw`,
      description: border.description,
      url: `https://benzynamapa.pl/granica/${slug}/`,
      siteName: 'BenzynaMAPA',
      locale: 'pl_PL',
      type: 'website',
    },
    keywords: [
      `tankowanie ${border.country}`,
      `ceny paliw ${border.country}`,
      `granica z ${border.country}`,
      `paliwo ${border.country}`,
      `czy opłaca się tankować w ${border.country}`,
      `najbliższa stacja granica ${border.country}`,
    ],
  };
}

const WORTH_LONG = {
  yes:   { label: 'TAK — opłaca się tankować za granicą', color: 'green', icon: '✓' },
  mixed: { label: 'SYTUACJA MIESZANA — to zależy', color: 'amber', icon: '~' },
  no:    { label: 'NIE — taniej tankować w Polsce', color: 'red', icon: '✗' },
} as const;

export default async function BorderPage({ params }: Props) {
  const { slug } = await params;
  const border = BORDERS.find(b => b.slug === slug);
  if (!border) notFound();

  const stats = getStats();
  const plPb95 = stats?.averages.pb95;
  const diffPb95 = plPb95 ? border.avgPb95Foreign - plPb95 : null;

  // Polish cities at the border (s linkami pokud existují v CITIES)
  const cityLinks = border.borderCities.map(name => {
    const c = CITIES.find(ci => ci.name === name || ci.slug === slugify(name));
    return { name, slug: c?.slug ?? null };
  });

  const verdict = WORTH_LONG[border.worthIt];

  const faqs = [
    {
      q: `Czy opłaca się tankować w ${border.country}?`,
      a: border.worthIt === 'yes'
        ? `Tak. Paliwo w ${border.country} jest tańsze o ${diffPb95 != null ? Math.abs(diffPb95).toFixed(2).replace('.', ',') : '~'} zł/l niż w Polsce. ${border.description}`
        : border.worthIt === 'no'
          ? `Nie. Paliwo w ${border.country} jest droższe o ${diffPb95 != null ? Math.abs(diffPb95).toFixed(2).replace('.', ',') : '~'} zł/l niż w Polsce. Najlepsza strategia: zatankuj pełny bak w Polsce przed wyjazdem.`
          : `Sytuacja mieszana. ${border.description} Sprawdź aktualne ceny przed wyjazdem.`,
    },
    {
      q: `Ile kosztuje benzyna 95 w ${border.country}?`,
      a: `Średnia cena benzyny 95 w ${border.country} wynosi ok. ${formatPrice(border.avgPb95Foreign)}/l (po przeliczeniu z lokalnej waluty). Dla porównania w Polsce: ${plPb95 ? formatPrice(plPb95) + '/l' : 'sprawdź na stronie głównej'}. Różnica: ${diffPb95 != null ? (diffPb95 > 0 ? '+' : '') + diffPb95.toFixed(2).replace('.', ',') + ' zł/l' : 'sprawdź aktualnie'}.`,
    },
    {
      q: `Jakie są główne przejścia graniczne z ${border.country}?`,
      a: `Główne przejścia: ${border.crossings.join(', ')}.`,
    },
    {
      q: `Które polskie miasta są blisko granicy z ${border.country}?`,
      a: `Polskie miasta przygraniczne z ${border.country}: ${border.borderCities.join(', ')}. Tankowanie w tych miastach jest często najtańsze - sprawdź ceny lokalne klikając miasto na liście poniżej.`,
    },
    {
      q: `Jakie są limity celne przy tankowaniu w ${border.country}?`,
      a: ['ukraina', 'bialorus', 'rosja-obwod-kaliningradzki'].includes(border.slug)
        ? `${border.country} jest poza UE. Limit: bak samochodu bez limitu (cła nie pobiera się od paliwa w fabrycznym baku), kanister maksymalnie 10 litrów bez cła. Wielokrotne przekraczanie z pełnym bakiem może być uznane za działalność handlową.`
        : `${border.country} jest w UE - bez ograniczeń na tankowanie. Możesz tankować bez limitu, do baku i kanistrów.`,
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://benzynamapa.pl/' },
              { '@type': 'ListItem', position: 2, name: 'Granica', item: 'https://benzynamapa.pl/granica/' },
              { '@type': 'ListItem', position: 3, name: border.country, item: `https://benzynamapa.pl/granica/${slug}/` },
            ],
          },
          {
            '@type': 'Country',
            name: border.country,
            sameAs: `https://www.wikidata.org/wiki/${border.wikidata}`,
          },
          {
            '@type': 'Article',
            headline: `Tankowanie w ${border.country} - czy się opłaca? Ceny paliw 2026`,
            datePublished: '2026-05-15',
            dateModified: new Date().toISOString(),
            author: { '@type': 'Organization', name: 'BenzynaMAPA.pl' },
            publisher: { '@type': 'Organization', name: 'BenzynaMAPA.pl', logo: { '@type': 'ImageObject', url: 'https://benzynamapa.pl/icon-512.png' } },
            mainEntityOfPage: `https://benzynamapa.pl/granica/${slug}/`,
            inLanguage: 'pl',
          },
          {
            '@type': 'FAQPage',
            mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
            speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.faq-question', '.border-verdict'] },
          },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Strona główna</Link>
          <span className="mx-2">›</span>
          <Link href="/granica/" className="hover:text-green-600">Granica</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900 dark:text-white">{border.country}</span>
        </nav>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <span className="text-4xl">{border.flag}</span>
          Tankowanie w {border.country} — czy się opłaca?
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          {border.description}
        </p>

        {/* Verdict */}
        <div className={`border-verdict mb-8 rounded-2xl p-6 border ${
          verdict.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          : verdict.color === 'red' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`text-5xl font-black ${
              verdict.color === 'green' ? 'text-green-600' : verdict.color === 'red' ? 'text-red-600' : 'text-amber-600'
            }`}>{verdict.icon}</div>
            <div>
              <h2 className={`text-xl font-bold mb-2 ${
                verdict.color === 'green' ? 'text-green-700 dark:text-green-400'
                : verdict.color === 'red' ? 'text-red-700 dark:text-red-400'
                : 'text-amber-700 dark:text-amber-400'
              }`}>{verdict.label}</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Paliwo w {border.country}: <strong>{formatPrice(border.avgPb95Foreign)}/l</strong> (średnia Pb95).
                W Polsce: <strong>{plPb95 ? formatPrice(plPb95) : '~6,40 zł'}/l</strong>.
                {diffPb95 != null && (
                  <> Różnica: <strong className={diffPb95 > 0 ? 'text-red-600' : 'text-green-600'}>
                    {diffPb95 > 0 ? '+' : ''}{diffPb95.toFixed(2).replace('.', ',')} zł/l
                  </strong> ({diffPb95 > 0 ? `${border.country} drożej` : `${border.country} taniej`}).</>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Komparacja */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Porównanie cen Polska vs {border.country}</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="text-left p-3 font-semibold">Paliwo</th>
                  <th className="text-right p-3 font-semibold">Polska</th>
                  <th className="text-right p-3 font-semibold">{border.country} (~)</th>
                  <th className="text-right p-3 font-semibold">Różnica</th>
                  <th className="text-right p-3 font-semibold">Pełny bak 50l</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                <tr>
                  <td className="p-3 font-semibold">Benzyna 95</td>
                  <td className="p-3 text-right text-green-700 dark:text-green-400">{plPb95 ? formatPrice(plPb95) : '~6,40'}</td>
                  <td className="p-3 text-right">{formatPrice(border.avgPb95Foreign)}</td>
                  <td className={`p-3 text-right font-bold ${diffPb95 != null && diffPb95 > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {diffPb95 != null ? `${diffPb95 > 0 ? '+' : ''}${diffPb95.toFixed(2).replace('.', ',')} zł` : '—'}
                  </td>
                  <td className={`p-3 text-right font-semibold ${diffPb95 != null && diffPb95 > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {diffPb95 != null ? `${diffPb95 > 0 ? '+' : ''}${(diffPb95 * 50).toFixed(0)} zł` : '—'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Ceny w {border.country} są orientacyjne (mogą się różnić w zależności od regionu i kursu walut).
            Polskie ceny: aktualne z BenzynaMAPA.pl (aktualizacja 3× dziennie).
          </p>
        </section>

        {/* Przejścia graniczne */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Globe size={20} className="text-green-600" />
            Główne przejścia graniczne z {border.country}
          </h2>
          <div className="flex flex-wrap gap-2">
            {border.crossings.map(c => (
              <span key={c} className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* Polskie miasta przygraniczne */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <MapPin size={20} className="text-green-600" />
            Polskie miasta blisko granicy z {border.country}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Tankowanie w tych miastach przed przekroczeniem granicy jest często najlepszą strategią.
            Sprawdź ceny lokalne.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {cityLinks.map(c =>
              c.slug ? (
                <Link key={c.name} href={`/miasto/${c.slug}/`}
                  className="block p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 hover:bg-green-50 transition-all text-center group">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-400">{c.name}</span>
                </Link>
              ) : (
                <div key={c.name} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                  <span className="text-sm font-medium text-gray-500">{c.name}</span>
                </div>
              )
            )}
          </div>
        </section>

        {/* Limit celní */}
        {['ukraina', 'bialorus', 'rosja-obwod-kaliningradzki'].includes(border.slug) && (
          <section className="mb-10 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">⚠ Limity celne — {border.country} poza UE</h2>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc pl-5">
              <li><strong>Bak samochodu:</strong> bez limitu (cła nie pobiera się od paliwa w fabrycznym baku).</li>
              <li><strong>Kanister:</strong> do 10 litrów bez cła. Powyżej — akcyza + VAT przy odprawie celnej.</li>
              <li><strong>Wielokrotne przekraczanie:</strong> US może zakwestionować częste wjazdy z pełnym bakiem jako działalność handlową.</li>
              {border.slug === 'rosja-obwod-kaliningradzki' && (
                <li className="text-red-700 dark:text-red-400"><strong>UWAGA 2026:</strong> Po sankcjach 2022 zakaz wjazdu pojazdów na rosyjskich rejestracjach do UE. Ruch tranzytowy z PL praktycznie wstrzymany.</li>
              )}
              {border.slug === 'bialorus' && (
                <li className="text-red-700 dark:text-red-400"><strong>UWAGA 2026:</strong> Ograniczone przekroczenia graniczne. Sprawdź aktualne ostrzeżenia MSZ.</li>
              )}
            </ul>
          </section>
        )}

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">FAQ — tankowanie w {border.country}</h2>
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <details key={q} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <summary className="faq-question font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
                  {q}
                  <span className="text-green-600 ml-3 flex-shrink-0 text-xs">▼</span>
                </summary>
                <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Inne granice */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Sprawdź ceny przy innych granicach</h2>
          <div className="flex flex-wrap gap-2">
            {BORDERS.filter(b => b.slug !== slug).map(b => (
              <Link key={b.slug} href={`/granica/${b.slug}/`}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:border-green-500 hover:text-green-700 transition-all">
                {b.flag} {b.country}
              </Link>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/granica/" className="text-green-700 dark:text-green-400 hover:underline">← Wszystkie granice</Link>
          <Link href="/aktualnosci/turystyka-paliwowa-polska-niemcy-czechy-2026/" className="text-gray-500 hover:text-green-700">Pełen artykuł →</Link>
          <Link href="/maksymalne-ceny-paliw/" className="text-gray-500 hover:text-green-700">Polska vs Europa →</Link>
        </div>
      </div>
    </>
  );
}
