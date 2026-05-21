import type { Metadata } from 'next';
import Link from 'next/link';
import { Fuel, Database, RefreshCw, Globe, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'O BenzynaMAPA.pl – misja, dane, zespół | Porównywarka cen paliw',
  description: 'BenzynaMAPA.pl to bezpłatna porównywarka cen paliw w Polsce. Monitorujemy 8 600+ stacji, dane aktualizujemy 3× dziennie. Poznaj naszą misję i metodologię.',
  alternates: { canonical: 'https://benzynamapa.pl/o-nas/' },
  openGraph: {
    title: 'O BenzynaMAPA.pl – największa porównywarka cen paliw w Polsce',
    description: 'Misja, metodologia i zespół stojący za BenzynaMAPA.pl.',
    url: 'https://benzynamapa.pl/o-nas/',
    siteName: 'BenzynaMAPA',
    locale: 'pl_PL',
    type: 'website',
  },
};

export default function ONasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'O BenzynaMAPA.pl',
        description: 'Strona o porównywarce cen paliw BenzynaMAPA.pl',
        url: 'https://benzynamapa.pl/o-nas/',
        mainEntity: {
          '@type': 'Organization',
          name: 'BenzynaMAPA.pl',
          url: 'https://benzynamapa.pl',
          logo: 'https://benzynamapa.pl/icon-512.png',
          description: 'Bezpłatna porównywarka cen paliw na 8 600+ stacjach w Polsce',
          areaServed: { '@type': 'Country', name: 'Polska', '@id': 'https://www.wikidata.org/wiki/Q36' },
          knowsAbout: ['ceny benzyny', 'ceny diesla', 'stacje paliw', 'paliwa', 'PB95', 'LPG', 'akcyza paliwowa'],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email: 'kontakt@benzynamapa.pl',
            availableLanguage: 'Polish',
          },
          sameAs: ['https://benzinmapa.cz'],
        },
      }) }} />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Strona główna</Link>
          <span className="mx-2">›</span>
          <span>O nas</span>
        </nav>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Fuel size={28} className="text-green-600" />
          O BenzynaMAPA.pl
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg leading-relaxed">
          Największa bezpłatna porównywarka cen paliw w Polsce. Monitorujemy ponad
          <strong> 8 600 stacji paliw</strong>, dane aktualizujemy 3× dziennie.
        </p>

        <section className="mb-10 prose prose-gray dark:prose-invert max-w-none">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Nasza misja</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Wierzymy, że każdy kierowca powinien mieć łatwy dostęp do aktualnych cen paliw,
            niezależnie od tego, gdzie jest. Tworzymy darmowe narzędzie, które pomaga zaoszczędzić
            <strong> kilkadziesiąt złotych na każdym tankowaniu</strong> bez konieczności rejestracji
            i bez reklam wyskakujących.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            BenzynaMAPA.pl jest siostrzanym projektem czeskiej{' '}
            <a href="https://benzinmapa.cz" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
              BenzinMapa.cz
            </a>. Razem obsługujemy ponad 11 000 stacji paliw w Europie Środkowej.
          </p>
        </section>

        <section className="grid sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
            <Database size={28} className="text-green-600 mb-2" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Skąd dane</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Bazę stacji budujemy z OpenStreetMap (8 600+). Ceny pobieramy z polskich agregatorów
              danych (m.in. cenapaliw.pl) oraz z bezpośrednich zgłoszeń użytkowników.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
            <RefreshCw size={28} className="text-green-600 mb-2" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Aktualizacja 3× dziennie</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              GitHub Actions pobiera dane o cenach 3 razy dziennie (6:00, 10:00, 15:00 CET)
              i aktualizuje statyczną bazę. Każda cena ma znacznik czasu źródła.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
            <Globe size={28} className="text-green-600 mb-2" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Open source &amp; transparentność</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Kod scrapera i UI jest otwarty na{' '}
              <a href="https://github.com/Pica32/benzynamapa.pl" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">GitHubie</a>.
              Dane JSON udostępniamy publicznie pod{' '}
              <Link href="/data/stats_latest.json" className="text-green-600 hover:underline">/data/stats_latest.json</Link>.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
            <Shield size={28} className="text-green-600 mb-2" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Bez rejestracji</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Korzystanie z BenzynaMAPA.pl jest całkowicie bezpłatne i nie wymaga zakładania
              konta. Nie zbieramy danych osobowych poza ciasteczkami analitycznymi.
            </p>
          </div>
        </section>

        <section className="mb-10 bg-green-50 dark:bg-gray-800 rounded-2xl p-6 border border-green-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Metodologia szacowania cen</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Niektóre stacje nie mają jeszcze zweryfikowanej ceny. Dla nich wyświetlamy szacunek
            obliczony z (1) krajowej średniej dla danego paliwa, (2) typowego odchylenia ceny dla danej sieci
            (np. Shell typowo +0,35 zł, Moya typowo −0,15 zł), (3) korekty regionalnej.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Stacje ze zweryfikowaną ceną oznaczamy znakiem <span className="text-green-600 font-bold">✓ zweryfikowane</span>,
            stacje z szacunkiem znakiem <span className="text-gray-500">~</span>. Komunitę zachęcamy do
            zgłaszania aktualnych cen — zgłoszenia ze znacznikiem czasu pojawiają się
            jako zweryfikowane po potwierdzeniu przez 3 innych użytkowników.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Stack techniczny</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">Next.js 16</li>
            <li className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">React 19</li>
            <li className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">TypeScript</li>
            <li className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">Tailwind CSS v4</li>
            <li className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">MapLibre GL</li>
            <li className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">OpenStreetMap</li>
            <li className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">Python (scraper)</li>
            <li className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">GitHub Actions</li>
            <li className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">Vercel hosting</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Skontaktuj się</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Jesteśmy małym zespołem entuzjastów. Pisz do nas:
          </p>
          <ul className="space-y-2 text-sm">
            <li>📧 E-mail: <a href="mailto:kontakt@benzynamapa.pl" className="text-green-700 dark:text-green-400 hover:underline">kontakt@benzynamapa.pl</a></li>
            <li>💻 GitHub: <a href="https://github.com/Pica32/benzynamapa.pl" target="_blank" rel="noopener noreferrer" className="text-green-700 dark:text-green-400 hover:underline">Pica32/benzynamapa.pl</a></li>
            <li>🇨🇿 Wersja czeska: <a href="https://benzinmapa.cz" target="_blank" rel="noopener noreferrer" className="text-green-700 dark:text-green-400 hover:underline">BenzinMapa.cz</a></li>
          </ul>
        </section>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/jak-dziala/" className="text-green-700 dark:text-green-400 hover:underline">→ Jak działa BenzynaMAPA</Link>
          <Link href="/regulamin/" className="text-green-700 dark:text-green-400 hover:underline">→ Regulamin</Link>
          <Link href="/polityka-prywatnosci/" className="text-green-700 dark:text-green-400 hover:underline">→ Polityka prywatności</Link>
          <Link href="/cookies/" className="text-green-700 dark:text-green-400 hover:underline">→ Polityka cookies</Link>
        </div>
      </div>
    </>
  );
}
