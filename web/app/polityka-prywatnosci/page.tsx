import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Polityka prywatności – BenzynaMAPA.pl',
  description: 'Polityka prywatności serwisu BenzynaMAPA.pl. Informacje o przetwarzaniu danych osobowych zgodnie z RODO.',
  alternates: { canonical: 'https://benzynamapa.pl/polityka-prywatnosci/' },
  robots: { index: false },
};

export default function PolitykaPrywatnosci() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Polityka prywatności</h1>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Administrator danych</h2>
          <p>Administratorem serwisu BenzynaMAPA.pl jest jego operator. Kontakt: przez formularz na stronie kontaktowej.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Jakie dane zbieramy</h2>
          <p>Serwis nie zbiera danych osobowych w sposób aktywny. Przy korzystaniu z geolokalizacji (opcjonalnie) Twoja lokalizacja GPS jest przetwarzana wyłącznie lokalnie w przeglądarce i nie jest przesyłana na nasze serwery.</p>
          <p className="mt-2">Do sprawdzenia przybliżonej lokalizacji używamy API ip-api.com (anonimowe zapytanie po adresie IP). Dane te nie są przechowywane.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Pliki cookie</h2>
          <p>Serwis używa wyłącznie niezbędnych technicznie plików cookie. Nie używamy cookies marketingowych ani śledzących.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. Analytics</h2>
          <p>Korzystamy z Plausible Analytics — narzędzia bez cookies, zgodnego z RODO, które nie zbiera danych osobowych.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">5. Prawa użytkownika</h2>
          <p>Zgodnie z RODO masz prawo do dostępu, sprostowania i usunięcia danych. W związku z tym, że nie przechowujemy danych osobowych, realizacja tych praw następuje automatycznie.</p>
        </section>
      </div>
    </div>
  );
}
