import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aktualności cen paliw w Polsce 2026',
  description: 'Najnowsze informacje o cenach paliw w Polsce. Prognozy, analizy, trendy. Benzyna 95, diesel, LPG – aktualne wiadomości.',
  alternates: { canonical: 'https://benzynamapa.pl/aktualnosci/' },
};

export default function AktualnosciPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Aktualności – ceny paliw</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">
        Najnowsze informacje, prognozy i analizy cen paliw w Polsce.
      </p>

      <div className="space-y-6">
        {[
          {
            title: 'Ceny paliw w Polsce – maj 2026: diesel taniej, benzyna stabilna',
            date: '2026-05-01',
            excerpt: 'W maju 2026 ceny diesla w Polsce spadły średnio o 0,08 zł/l w porównaniu do kwietnia. Benzyna 95 pozostaje stabilna na poziomie 6,35–6,50 zł/l. Najniższe ceny notowane są na stacjach niezależnych i Moya.',
          },
          {
            title: 'Gdzie zatankować najtaniej przed majówką 2026?',
            date: '2026-04-28',
            excerpt: 'Przed długim weekendem majowym ceny paliw na autostradach wzrastają. Sprawdź, które stacje przy trasach krajowych oferują ceny zbliżone do miejskich. Oszczędź nawet 0,40 zł/l.',
          },
          {
            title: 'LPG coraz popularniejszy – ile kosztuje przejazd autogazem?',
            date: '2026-04-20',
            excerpt: 'Autogaz LPG utrzymuje się poniżej 3,00 zł/l, czyli prawie połowę ceny benzyny 95. Przy rocznym przebiegu 25 000 km różnica w kosztach to ponad 4000 zł rocznie.',
          },
          {
            title: 'Orlen vs. Shell – porównanie cen na tych samych trasach',
            date: '2026-04-10',
            excerpt: 'Analiza cen paliw na 50 trasach krajowych pokazuje, że Shell jest średnio o 0,35 zł/l droższy od Orlenu. W niektórych miastach różnica sięga 0,50 zł/l. Sprawdź nasze zestawienie.',
          },
        ].map((article) => (
          <div key={article.title} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-xs text-gray-400 mb-2">{new Date(article.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-green-700 cursor-pointer">
              {article.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{article.excerpt}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex gap-4">
        <Link href="/" className="text-sm text-green-700 dark:text-green-400 hover:underline font-medium">→ Mapa stacji paliw</Link>
        <Link href="/historia-cen/" className="text-sm text-green-700 dark:text-green-400 hover:underline font-medium">→ Historia cen</Link>
      </div>
    </div>
  );
}
