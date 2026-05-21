import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Polityka cookies – BenzynaMAPA.pl',
  description: 'Polityka plików cookies serwisu BenzynaMAPA.pl. Jakie ciasteczka używamy, w jakim celu i jak je wyłączyć.',
  alternates: { canonical: 'https://benzynamapa.pl/cookies/' },
};

export default function CookiesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Polityka cookies – BenzynaMAPA.pl',
        url: 'https://benzynamapa.pl/cookies/',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://benzynamapa.pl/' },
            { '@type': 'ListItem', position: 2, name: 'Polityka cookies' },
          ],
        },
      }) }} />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Strona główna</Link>
          <span className="mx-2">›</span>
          <span>Polityka cookies</span>
        </nav>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Polityka plików cookies</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Ostatnia aktualizacja: 15 maja 2026</p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Czym są pliki cookies</h2>
            <p>
              Pliki cookies (ciasteczka) to niewielkie pliki tekstowe zapisywane na urządzeniu użytkownika
              przez przeglądarkę internetową. Umożliwiają stronie zapamiętanie preferencji,
              prowadzenie statystyk lub wyświetlanie reklam.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Jakich ciasteczek używamy</h2>
            <table className="w-full text-xs mt-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-2 font-bold">Cookie</th>
                  <th className="text-left p-2 font-bold">Cel</th>
                  <th className="text-left p-2 font-bold">Dostawca</th>
                  <th className="text-left p-2 font-bold">Ważność</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <tr><td className="p-2 font-mono">_ga, _ga_*</td><td className="p-2">Statystyki ruchu (Google Analytics 4)</td><td className="p-2">Google</td><td className="p-2">2 lata</td></tr>
                <tr><td className="p-2 font-mono">_gid</td><td className="p-2">Identyfikacja sesji użytkownika</td><td className="p-2">Google</td><td className="p-2">24 godz.</td></tr>
                <tr><td className="p-2 font-mono">__gads, __gpi</td><td className="p-2">Reklamy AdSense, profilowanie</td><td className="p-2">Google AdSense</td><td className="p-2">13 mies.</td></tr>
                <tr><td className="p-2 font-mono">cookie_consent</td><td className="p-2">Zapamiętanie wyboru zgody</td><td className="p-2">BenzynaMAPA.pl</td><td className="p-2">12 mies.</td></tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reklamy Google AdSense</h2>
            <p>
              W serwisie wyświetlamy reklamy Google AdSense. Google jako dostawca zewnętrzny używa
              ciasteczek do wyświetlania reklam dopasowanych do zainteresowań użytkownika.
              Możesz wyłączyć spersonalizowane reklamy w{' '}
              <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                ustawieniach reklam Google
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Zgoda na cookies</h2>
            <p>
              Korzystamy z mechanizmu Google Consent Mode v2. Domyślnie ciasteczka analityczne
              i reklamowe są wyłączone. Po wyrażeniu zgody przez użytkownika zostają aktywowane.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Jak wyłączyć ciasteczka</h2>
            <p>
              Każda popularna przeglądarka pozwala na zarządzanie ciasteczkami w ustawieniach prywatności.
              Wyłączenie ciasteczek może uniemożliwić poprawne działanie niektórych funkcji serwisu.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Chrome – instrukcja</a></li>
              <li><a href="https://support.mozilla.org/pl/kb/blokowanie-ciasteczek" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Firefox – instrukcja</a></li>
              <li><a href="https://support.apple.com/pl-pl/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Safari – instrukcja</a></li>
              <li><a href="https://support.microsoft.com/pl-pl/microsoft-edge" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Edge – instrukcja</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Kontakt</h2>
            <p>W sprawach związanych z ciasteczkami pisz na <a href="mailto:kontakt@benzynamapa.pl" className="text-green-600 hover:underline">kontakt@benzynamapa.pl</a>.</p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 text-sm">
          <Link href="/polityka-prywatnosci/" className="text-green-700 dark:text-green-400 hover:underline">→ Polityka prywatności</Link>
          <Link href="/regulamin/" className="text-green-700 dark:text-green-400 hover:underline">→ Regulamin</Link>
          <Link href="/o-nas/" className="text-green-700 dark:text-green-400 hover:underline">→ O nas</Link>
        </div>
      </div>
    </>
  );
}
