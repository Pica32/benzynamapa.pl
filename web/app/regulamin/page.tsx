import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Regulamin korzystania z BenzynaMAPA.pl',
  description: 'Regulamin korzystania z porównywarki cen paliw BenzynaMAPA.pl. Zasady użytkowania, odpowiedzialność, prawa autorskie.',
  alternates: { canonical: 'https://benzynamapa.pl/regulamin/' },
  robots: { index: true, follow: true },
};

export default function RegulaminPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Regulamin BenzynaMAPA.pl',
        url: 'https://benzynamapa.pl/regulamin/',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://benzynamapa.pl/' },
            { '@type': 'ListItem', position: 2, name: 'Regulamin' },
          ],
        },
      }) }} />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Strona główna</Link>
          <span className="mx-2">›</span>
          <span>Regulamin</span>
        </nav>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Regulamin BenzynaMAPA.pl</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Ostatnia aktualizacja: 15 maja 2026</p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">§1 Postanowienia ogólne</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>Niniejszy regulamin określa zasady korzystania z serwisu internetowego BenzynaMAPA.pl, dostępnego pod adresem <a href="https://benzynamapa.pl" className="text-green-600 hover:underline">https://benzynamapa.pl</a>.</li>
              <li>Operatorem serwisu jest podmiot prowadzący stronę BenzynaMAPA.pl. Kontakt: kontakt@benzynamapa.pl.</li>
              <li>Korzystanie z serwisu jest bezpłatne i nie wymaga rejestracji.</li>
              <li>Korzystając z serwisu, użytkownik akceptuje postanowienia niniejszego regulaminu.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">§2 Charakter serwisu</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>BenzynaMAPA.pl jest porównywarką cen paliw w Polsce o charakterze informacyjnym.</li>
              <li>Operator nie sprzedaje paliw ani nie jest stroną transakcji między użytkownikiem a stacjami paliw.</li>
              <li>Wszystkie ceny prezentowane w serwisie mają charakter <strong>orientacyjny</strong>. Operator dokłada wszelkich starań, aby były aktualne (aktualizacja 3× dziennie), jednak nie gwarantuje, że cena na stacji w danym momencie odpowiada cenie wyświetlanej w serwisie.</li>
              <li>Decyzję o zakupie paliwa użytkownik podejmuje na własną odpowiedzialność, weryfikując cenę bezpośrednio na stacji.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">§3 Źródła danych</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>Bazę stacji paliw budujemy w oparciu o dane <strong>OpenStreetMap</strong> (licencja ODbL).</li>
              <li>Ceny paliw pobieramy z publicznie dostępnych polskich serwisów agregujących dane oraz ze zgłoszeń użytkowników.</li>
              <li>Dla stacji bez zweryfikowanej ceny wyświetlamy szacunek liczony z krajowej średniej + typowego odchylenia danej sieci.</li>
              <li>Operator nie gwarantuje, że źródła danych podają ceny w 100% prawidłowe.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">§4 Zgłaszanie cen przez użytkowników</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>Użytkownicy mogą zgłaszać aktualne ceny paliw na stronach poszczególnych stacji.</li>
              <li>Po potwierdzeniu zgłoszenia przez 3 niezależnych użytkowników cena oznacza się jako zweryfikowana.</li>
              <li>Zgłaszający ponosi odpowiedzialność za prawdziwość zgłaszanych danych.</li>
              <li>Operator zastrzega prawo do usuwania nieprawdziwych lub spamowych zgłoszeń.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">§5 Wyłączenie odpowiedzialności</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>Operator nie ponosi odpowiedzialności za szkody poniesione w wyniku korzystania lub niemożności korzystania z serwisu.</li>
              <li>Operator nie odpowiada za rozbieżności między cenami w serwisie a rzeczywistymi cenami na stacjach.</li>
              <li>Operator nie odpowiada za działania osób trzecich, w tym dostawców danych, sieci stacji ani użytkowników zgłaszających ceny.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">§6 Prawa autorskie</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>Treści serwisu (z wyjątkiem danych OpenStreetMap) są chronione prawem autorskim.</li>
              <li>Dane mapowe pochodzą z OpenStreetMap (licencja ODbL).</li>
              <li>Wykorzystanie danych w celach niekomercyjnych jest dozwolone z podaniem źródła „BenzynaMAPA.pl".</li>
              <li>Wykorzystanie danych w celach komercyjnych wymaga uprzedniej zgody operatora.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">§7 Postanowienia końcowe</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>Operator zastrzega prawo do zmiany regulaminu w dowolnym momencie. Zmiany obowiązują od chwili publikacji.</li>
              <li>W sprawach nieuregulowanych regulaminem stosuje się przepisy prawa polskiego.</li>
              <li>Spory rozpatrywane są przez sądy właściwe miejscowo dla siedziby operatora.</li>
            </ol>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 text-sm">
          <Link href="/polityka-prywatnosci/" className="text-green-700 dark:text-green-400 hover:underline">→ Polityka prywatności</Link>
          <Link href="/cookies/" className="text-green-700 dark:text-green-400 hover:underline">→ Polityka cookies</Link>
          <Link href="/o-nas/" className="text-green-700 dark:text-green-400 hover:underline">→ O nas</Link>
        </div>
      </div>
    </>
  );
}
