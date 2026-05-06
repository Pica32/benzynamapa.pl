import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontakt – BenzynaMAPA.pl',
  description: 'Skontaktuj się z BenzynaMAPA.pl. Błąd w danych? Sugestia? Napisz do nas.',
  alternates: { canonical: 'https://benzynamapa.pl/kontakt/' },
};

export default function KontaktPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Kontakt</h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Znalazłeś błąd w danych? Masz sugestię? Skontaktuj się z nami.
        </p>
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
          <p>📧 Kontakt email: <span className="font-semibold">kontakt@benzynamapa.pl</span></p>
          <p>🐦 Dane o cenach paliw są pobierane automatycznie z publicznych źródeł. Ceny mają charakter informacyjny.</p>
        </div>
      </div>
    </div>
  );
}
