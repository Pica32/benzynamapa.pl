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
  // P1.10: 11 nowych artykułów
  {
    slug: 'akcyza-paliwowa-2026-waloryzacja',
    title: 'Akcyza paliwowa 2026: stawki, waloryzacja, wpływ na ceny',
    excerpt: 'Akcyza na benzynę 1,529 zł/l, diesel 1,176 zł/l, LPG 0,387 zł/l - tak wygląda obciążenie podatkowe paliw w Polsce w 2026. Czy szykuje się waloryzacja i co to oznacza dla kierowcy?',
    date: '2026-05-18',
    readTime: '6 min',
    tag: 'Analiza',
  },
  {
    slug: 'ets2-system-handlu-emisjami-paliwa-2027',
    title: 'ETS2 - jak wpłynie na ceny paliw w Polsce od 2027?',
    excerpt: 'Nowy system handlu emisjami UE (ETS2) obejmie transport drogowy od 2027. Eksperci szacują wzrost cen paliw o 0,30-0,80 zł/l. Co to oznacza dla kierowców i jak się przygotować.',
    date: '2026-05-18',
    readTime: '7 min',
    tag: 'Analiza',
  },
  {
    slug: 'najtansze-stacje-a1-a2-a4-ranking-2026',
    title: 'Najtańsze stacje na autostradach A1, A2, A4 - ranking 2026',
    excerpt: 'Stacje przy autostradach są zazwyczaj o 0,30-0,50 zł/l droższe od średniej. Ale są wyjątki. Ranking najtańszych stacji na głównych polskich autostradach i strategie zatankowania taniej.',
    date: '2026-05-18',
    readTime: '6 min',
    tag: 'Porównanie',
  },
  {
    slug: 'lotos-navigator-vs-orlen-vitay-2026',
    title: 'Lotos Navigator vs Orlen Vitay 2026 - która karta lepsza?',
    excerpt: 'Po fuzji Orlen z Lotosem programy lojalnościowe Lotos Navigator i Orlen Vitay działają równolegle. Czym się różnią, jak je łączyć i która daje wyższe rabaty na paliwo?',
    date: '2026-05-18',
    readTime: '5 min',
    tag: 'Porównanie',
  },
  {
    slug: 'paliwo-w-firmie-pit-vat-kilometrowka-2026',
    title: 'Paliwo w firmie 2026: PIT, VAT, kilometrówka - jak rozliczać',
    excerpt: 'Auto firmowe a osobiste, pełen vs połowiczny VAT, kilometrówka 2026 (1,15 zł/km), ewidencja przebiegu. Kompleksowy przewodnik rozliczania paliwa w działalności gospodarczej.',
    date: '2026-05-18',
    readTime: '8 min',
    tag: 'Poradnik',
  },
  {
    slug: 'pb95-vs-pb98-do-mojego-auta',
    title: 'PB95 czy PB98 do mojego auta - jaki RON wybrać?',
    excerpt: 'Kiedy benzyna 98 daje korzyść, a kiedy to wyrzucone pieniądze? Lista aut wymagających 98 (BMW M, AMG, Porsche), test przy aucie zaprojektowanym na 95 i co się stanie przy pomyłce.',
    date: '2026-05-18',
    readTime: '5 min',
    tag: 'Poradnik',
  },
  {
    slug: 'czy-orlen-ma-najtansze-paliwo-2026',
    title: 'Czy Orlen ma najtańsze paliwo? Analiza danych 2026',
    excerpt: 'Orlen jako największa polska sieć - czy faktycznie oferuje najniższe ceny? Analiza odchyleń cenowych od średniej krajowej w 6 największych sieciach: Orlen, Shell, BP, Circle K, Moya, Huzar.',
    date: '2026-05-18',
    readTime: '6 min',
    tag: 'Analiza',
  },
  {
    slug: 'on-arktic-diesel-zimowy-2026',
    title: 'ON Arktic - kiedy tankować diesel zimowy do -32°C?',
    excerpt: 'Standardowy zimowy diesel w Polsce ma CFPP -20°C. Co zrobić gdy mrozy są silniejsze? ON Arktic dla -32°C, gdzie kupić, kiedy tankować i dlaczego nigdy nie dolewać benzyny do diesla.',
    date: '2026-05-18',
    readTime: '5 min',
    tag: 'Poradnik',
  },
  {
    slug: 'benzyna-e10-czy-niszczy-silnik',
    title: 'Benzyna E10 - czy niszczy silnik? Lista zgodnych aut',
    excerpt: 'Od 2024 standard w Polsce to E10 (do 10% bioetanolu). Czy uszkodzi Twój silnik? Lista aut zgodnych i niezgodnych, gdzie wciąż kupić E5 i jak rozpoznać który wariant tankujesz.',
    date: '2026-05-18',
    readTime: '6 min',
    tag: 'Poradnik',
  },
  {
    slug: 'stacje-samoobslugowe-vs-obslugowe-cena',
    title: 'Stacje samoobsługowe vs obsługowe - czy taniej?',
    excerpt: 'Samoobsługowe stacje (typu Moya, Auchan) bywają o 0,10-0,30 zł/l tańsze niż obsługowe. Dlaczego, gdzie ich szukać i czy to bezpieczne dla początkujących kierowców.',
    date: '2026-05-18',
    readTime: '4 min',
    tag: 'Porównanie',
  },
  {
    slug: 'tankowanie-zima-porady-paliwa-mroz',
    title: 'Tankowanie zimą - 7 porad jak nie wybić silnika',
    excerpt: 'Zimowe tankowanie ma swoje zasady. Diesel ON Arktic, benzyna z niższą lotnością, AdBlue zamarza w -11°C. 7 praktycznych porad jak przetrwać polską zimę na 4 kołach.',
    date: '2026-05-18',
    readTime: '5 min',
    tag: 'Porady',
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
