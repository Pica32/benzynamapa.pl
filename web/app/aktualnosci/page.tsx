import type { Metadata } from 'next';
import Link from 'next/link';
import { Newspaper, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Aktualności – ceny paliw w Polsce, analizy i porady | BenzynaMAPA.pl',
  description: 'Aktualne analizy cen benzyny i diesla w Polsce, porady jak zaoszczędzić na paliwie i porównanie stacji paliw. Praktyczne rady dla polskich kierowców.',
  alternates: { canonical: 'https://benzynamapa.pl/aktualnosci/' },
  openGraph: {
    title: 'Aktualności – ceny paliw w Polsce | BenzynaMAPA',
    description: 'Analizy, porady i prognozy cen paliw dla polskich kierowców.',
    url: 'https://benzynamapa.pl/aktualnosci/',
    siteName: 'BenzynaMAPA',
    locale: 'pl_PL',
    type: 'website',
  },
};

export const POSTS = [
  {
    slug: 'kiedy-tankowac-najtaniej-dzien-pora',
    title: 'Kiedy tankować najtaniej? Najlepszy dzień tygodnia i pora dnia w 2026',
    excerpt: 'Badania pokazują, że ceny paliw zmieniają się w zależności od dnia tygodnia i pory dnia. Poniedziałek rano vs piątek wieczór – różnica może sięgać 0,15 zł/l. Kiedy dokładnie tankować, żeby płacić najmniej?',
    date: '2026-05-07',
    readTime: '5 min',
    tag: 'Porady',
  },
  {
    slug: 'lpg-oplacalnosc-kalkulator-2026',
    title: 'LPG autogaz 2026: czy warto? Kalkulator opłacalności i porównanie kosztów',
    excerpt: 'LPG kosztuje ok. 2,90 zł/l – prawie trzy razy mniej niż benzyna 95. Czy przeróbka na autogaz się opłaca? Kalkulator zwrotu inwestycji, wady, zalety i które auta najlepiej nadają się na LPG.',
    date: '2026-05-07',
    readTime: '7 min',
    tag: 'Poradnik',
  },
  {
    slug: 'ceny-paliw-polska-vs-europa-2026',
    title: 'Ceny paliw: Polska vs Europa 2026 – gdzie tankujemy najtaniej?',
    excerpt: 'Polska jest w TOP 5 najtańszych krajów EU pod względem cen benzyny. Niemcy płacą o 0,80 zł/l więcej, Francja o 0,60 zł/l. Pełne porównanie cen paliw w 30 krajach Europy i dlaczego u nas jest taniej.',
    date: '2026-05-07',
    readTime: '6 min',
    tag: 'Porównanie',
  },
  {
    slug: 'jak-oszczedzac-na-paliwie-10-sposobow',
    title: 'Jak oszczędzać na paliwie? 10 sprawdzonych sposobów – do 30% mniej wydatków',
    excerpt: 'Styl jazdy, wybór stacji, karty lojalnościowe, monitorowanie cen – stosując 10 sprawdzonych metod można obniżyć wydatki na paliwo o 20–30%. Praktyczne porady dla każdego kierowcy.',
    date: '2026-05-07',
    readTime: '6 min',
    tag: 'Porady',
  },
  {
    slug: 'prognozy-cen-paliw-polska-2026',
    title: 'Prognozy cen paliw w Polsce 2026: kiedy potanieją benzyna i diesel?',
    excerpt: 'Ropa Brent, kurs PLN/USD, podatki akcyzowe – co wpływa na ceny paliw w Polsce? Analiza trendów i prognoza cen benzyny i diesla na drugie półrocze 2026. Kiedy warto tankować do pełna?',
    date: '2026-05-07',
    readTime: '5 min',
    tag: 'Analiza',
  },
  {
    slug: 'adblue-co-to-jest-cena-gdzie-kupic-2026',
    title: 'AdBlue: co to jest, ile kosztuje i gdzie kupić najtaniej w Polsce 2026',
    excerpt: 'AdBlue potrzebuje każdy diesel Euro 5 i nowszy. Cena na stacjach różni się nawet 3-krotnie. Gdzie kupić najtaniej, ile samochód zużywa i co się stanie, gdy AdBlue skończy się całkowicie.',
    date: '2026-05-07',
    readTime: '6 min',
    tag: 'Poradnik',
  },
  {
    slug: 'karty-paliwowe-orlen-vitay-bp-porownanie-2026',
    title: 'Karty paliwowe i programy lojalnościowe 2026: Orlen Vitay, BP, Shell – porównanie',
    excerpt: 'Karty lojalnościowe stacji paliw mogą zaoszczędzić 0,05–0,15 zł/l. Porównujemy Orlen Vitay, BP BonusMania, Shell ClubSmart i Circle K Easy. Która karta opłaca się najbardziej?',
    date: '2026-05-07',
    readTime: '7 min',
    tag: 'Porównanie',
  },
  {
    slug: 'turystyka-paliwowa-polska-niemcy-czechy-2026',
    title: 'Turystyka paliwowa 2026: czy opłaca się tankować za granicą?',
    excerpt: 'Polacy tankują w Niemczech, Czechach, Białorusi. Czy to nadal opłacalne? Porównanie cen paliw przy polskich granicach i obliczenie, kiedy jazda po tańsze paliwo za granicę ma sens finansowy.',
    date: '2026-05-07',
    readTime: '5 min',
    tag: 'Porównanie',
  },
];

const TAG_COLORS: Record<string, string> = {
  'Porady':     'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'Poradnik':   'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'Porównanie': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'Analiza':    'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
};

export default function AktualnosciPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'BenzynaMAPA – Aktualności',
        url: 'https://benzynamapa.pl/aktualnosci/',
        description: 'Analizy, porady i prognozy cen paliw dla polskich kierowców',
        inLanguage: 'pl',
      }) }} />

      <div className="flex items-center gap-3 mb-2">
        <Newspaper size={28} className="text-green-600" />
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Aktualności – paliwa w Polsce</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mb-10">
        Analizy cen paliw, praktyczne porady dla kierowców i prognozy rynkowe. Aktualizowane regularnie.
      </p>

      <div className="grid gap-6">
        {POSTS.map(post => (
          <Link
            key={post.slug}
            href={`/aktualnosci/${post.slug}/`}
            className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:border-green-500 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TAG_COLORS[post.tag] ?? 'bg-gray-100 text-gray-700'}`}>
                {post.tag}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
                <Clock size={12} />
                {post.readTime}
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors leading-snug">
              {post.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              {post.excerpt}
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-green-700 dark:text-green-400 font-semibold">
              Czytaj więcej →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
