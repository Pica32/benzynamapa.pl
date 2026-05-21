import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStats, formatPrice } from '@/lib/data';
import { GitCompare, Check, X } from 'lucide-react';
import { COMPARES } from '../page';

export const revalidate = 86400;
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return COMPARES.map(c => ({ slug: c.slug }));
}

interface ComparisonData {
  title: string;
  intro: string;
  leftLabel: string;
  rightLabel: string;
  rows: { label: string; left: string; right: string; winner?: 'left' | 'right' | 'tie' }[];
  verdict: string;
  faqs: { q: string; a: string }[];
}

function buildComparison(slug: string, stats: ReturnType<typeof getStats>): ComparisonData | null {
  const pb95 = stats?.averages.pb95 ?? 6.40;
  const pb98 = stats?.averages.pb98 ?? 6.80;
  const on = stats?.averages.on ?? 6.20;
  const lpg = stats?.averages.lpg ?? 2.90;

  switch (slug) {
    case 'pb95-vs-pb98':
      return {
        title: 'Benzyna 95 vs Benzyna 98 - co wybrać?',
        intro: `PB95 to standard dla 90% aut, PB98 to premium dla turbo/sportowych. Różnica cenowa: ${formatPrice(pb98 - pb95)}/l. Czy 98 daje korzyść?`,
        leftLabel: 'Benzyna 95 (Pb95)',
        rightLabel: 'Benzyna 98 (Pb98)',
        rows: [
          { label: 'Liczba oktanowa RON', left: '95', right: '98' },
          { label: 'Cena średnia ' + new Date().toLocaleDateString('pl-PL'), left: formatPrice(pb95), right: formatPrice(pb98), winner: 'left' },
          { label: 'Różnica cenowa', left: '—', right: `+${formatPrice(pb98 - pb95)}/l (~${Math.round((pb98 / pb95 - 1) * 100)}%)` },
          { label: 'Do jakich aut', left: 'większość (90% aut)', right: 'BMW M, AMG, Porsche, Audi RS' },
          { label: 'Korzyść w aucie 95', left: 'optymalna', right: 'ŻADNA (nie wykorzysta wyższego RON)', winner: 'left' },
          { label: 'Detergenty (premium V-Power/Verva)', left: 'standardowe', right: 'więcej (czyszczą silnik)', winner: 'right' },
          { label: 'Tankowanie 50l - koszt', left: `${(pb95 * 50).toFixed(0)} zł`, right: `${(pb98 * 50).toFixed(0)} zł`, winner: 'left' },
          { label: 'Roczna oszczędność (15k km)', left: '—', right: `−${Math.round((pb98 - pb95) * 15000 / 100 * 7)} zł vs Pb98` },
        ],
        verdict: 'Dla 90% kierowców PB95 jest optymalny. PB98 wybierz TYLKO jeśli producent wymaga (sprawdź naklejkę w wlewie paliwa).',
        faqs: [
          { q: 'Pomyłkowo zatankowałem 98 zamiast 95 - co teraz?', a: 'Nic nie szkodzi. Silnik 95 zniesie 98 bez problemu (nie wykorzysta wyższej oktanowej). Po prostu zapłaciłeś więcej.' },
          { q: 'Pomyłkowo zatankowałem 95 zamiast 98 - co teraz?', a: 'Jedź łagodnie do następnej stacji, dotankuj 98. Pojedyncze zatankowanie nie zniszczy silnika, ale długoterminowo może powodować "stukanie".' },
          { q: 'Czy 98 daje większą moc?', a: 'Tylko w silnikach zaprojektowanych na 98+. W aucie 95 - mocy nie przybędzie.' },
        ],
      };

    case 'diesel-vs-benzyna':
      return {
        title: 'Diesel vs Benzyna 95 - co tańsze w eksploatacji?',
        intro: `Diesel ${on > pb95 ? 'jest droższy' : 'jest tańszy'} od benzyny o ${formatPrice(Math.abs(on - pb95))}/l. Ale spalanie diesla jest 20-30% niższe. Kiedy się opłaca?`,
        leftLabel: 'Diesel',
        rightLabel: 'Benzyna 95',
        rows: [
          { label: 'Cena średnia ' + new Date().toLocaleDateString('pl-PL'), left: formatPrice(on), right: formatPrice(pb95), winner: on < pb95 ? 'left' : 'right' },
          { label: 'Spalanie miasto', left: '6-9 l/100km', right: '9-12 l/100km', winner: 'left' },
          { label: 'Spalanie trasa', left: '5-6 l/100km', right: '6-8 l/100km', winner: 'left' },
          { label: 'Koszt 100 km miasto', left: `~${Math.round(7.5 * on)} zł`, right: `~${Math.round(10.5 * pb95)} zł`, winner: 'left' },
          { label: 'Koszt 100 km trasa', left: `~${Math.round(5.5 * on)} zł`, right: `~${Math.round(7 * pb95)} zł`, winner: 'left' },
          { label: 'Cena auta', left: 'wyższa (+3-8k zł)', right: 'niższa', winner: 'right' },
          { label: 'Koszt serwisu', left: 'wyższy (DPF, EGR, wtryski)', right: 'niższy', winner: 'right' },
          { label: 'AdBlue (Euro 5+)', left: 'TAK (1-2 l/1000km)', right: 'NIE', winner: 'right' },
          { label: 'Trwałość silnika', left: '300-500 tys. km', right: '200-350 tys. km', winner: 'left' },
          { label: 'Opłaca się przy', left: '>25 000 km/rok', right: '<20 000 km/rok' },
          { label: 'Akcyza', left: '1,176 zł/l', right: '1,529 zł/l', winner: 'left' },
        ],
        verdict: 'Diesel opłaca się przy rocznym przebiegu >25 000 km. Poniżej - benzyna jest bardziej ekonomiczna (niższy zakup auta i serwis).',
        faqs: [
          { q: 'Czy diesel zniknie z rynku?', a: 'Wolno. W UE coraz więcej restrykcji (ETS2, LEZ w miastach), ale do 2035 będą sprzedawane. Bądź ostrożny - wartość rezydualna spada.' },
          { q: 'Pomyłkowo zatankowałem benzynę do diesla - co robić?', a: 'NIE URUCHAMIAJ silnika. Zadzwoń po pomoc drogową. Mała ilość benzyny w diesle uszkadza wtryskiwacze - naprawa 5-10 tys. zł.' },
        ],
      };

    case 'lpg-vs-benzyna':
      return {
        title: 'LPG vs Benzyna 95 - czy autogaz się opłaca?',
        intro: `LPG kosztuje ${formatPrice(lpg)}/l - prawie ${Math.round(pb95 / lpg)}× mniej niż benzyna ${formatPrice(pb95)}/l. Kiedy zwraca się instalacja 2 500-5 000 zł?`,
        leftLabel: 'LPG Autogaz',
        rightLabel: 'Benzyna 95',
        rows: [
          { label: 'Cena średnia ' + new Date().toLocaleDateString('pl-PL'), left: formatPrice(lpg), right: formatPrice(pb95), winner: 'left' },
          { label: 'Spalanie 100 km', left: '8-9 l (+15-25%)', right: '7 l (baza)' },
          { label: 'Koszt 100 km', left: `~${Math.round(8.5 * lpg)} zł`, right: `~${Math.round(7 * pb95)} zł`, winner: 'left' },
          { label: 'Akcyza', left: '0,387 zł/l', right: '1,529 zł/l', winner: 'left' },
          { label: 'Koszt instalacji', left: '2 500-5 000 zł', right: '0 zł', winner: 'right' },
          { label: 'Zwrot inwestycji (20k km/rok)', left: '~10-15 mies.', right: '—' },
          { label: 'Oszczędność roczna (20k km)', left: `~${Math.round(20000/100 * (7 * pb95 - 8.5 * lpg))} zł`, right: '—', winner: 'left' },
          { label: 'Dostępność stacji', left: '~6 000 (70%)', right: '~8 600 (100%)', winner: 'right' },
          { label: 'Zwiększenie pojemności bagażnika', left: 'NIE (butla zajmuje miejsce)', right: 'TAK', winner: 'right' },
          { label: 'Coroczne przeglądy', left: 'TAK (100-150 zł)', right: 'NIE', winner: 'right' },
        ],
        verdict: 'LPG opłaca się przy rocznym przebiegu >15 000 km. Przy 20 000+ km zwrot inwestycji w ~10 miesięcy. Wadą: butla w bagażniku + 15-25% wyższe spalanie.',
        faqs: [
          { q: 'Czy każde auto można przerobić na LPG?', a: 'Większość benzynowych - tak. Silniki wolnossące (2 500-3 500 zł). Silniki TSI/FSI/EcoBoost wymagają droższej instalacji (4 500-6 000 zł). Hybrydy i diesle - nie.' },
          { q: 'Czy LPG niszczy silnik?', a: 'Nowoczesne sekwencyjne instalacje LPG (IV/V generacja) NIE niszczą silnika. Mit z czasów I-II generacji. Niektóre silniki wymagają smarowania zaworów.' },
        ],
      };

    case 'ev-vs-spalinowe':
      return {
        title: 'EV (elektryk) vs auto spalinowe - koszt 100 km',
        intro: 'Elektryk ładowany w domu = najtańsze, EV publiczne DC ≈ LPG. Pełne porównanie kosztów eksploatacji.',
        leftLabel: 'EV (elektryk)',
        rightLabel: 'Auto spalinowe',
        rows: [
          { label: 'Koszt 100 km (najtańszy)', left: '~6-12 zł (dom, taryfa nocna)', right: `~${Math.round(7 * pb95)} zł (Pb95)`, winner: 'left' },
          { label: 'Koszt 100 km (publiczne DC)', left: '~43 zł (DC szybkie)', right: `~${Math.round(7 * pb95)} zł`, winner: 'right' },
          { label: 'Koszt 100 km (LPG)', left: '—', right: `~${Math.round(8.5 * lpg)} zł (LPG)`, winner: 'right' },
          { label: 'Cena auta', left: '+30-100k zł vs ICE', right: 'niższa', winner: 'right' },
          { label: 'Dotacje (Mój Elektryk 2.0)', left: 'do 27 000 zł', right: 'nie', winner: 'left' },
          { label: 'Serwis roczny', left: '~500 zł (mniej części)', right: '~1500 zł', winner: 'left' },
          { label: 'Zasięg', left: '300-500 km', right: '700-1000 km na baku', winner: 'right' },
          { label: 'Czas ładowania/tankowania', left: '20-60 min (DC) lub 3-8h (AC)', right: '3-5 minut', winner: 'right' },
          { label: 'Bateria - żywotność', left: '8-12 lat / 200k km', right: '— (silnik 300k+ km)' },
          { label: 'Emisje CO2', left: '0 (z e-mobility)', right: '~160 g/km', winner: 'left' },
        ],
        verdict: 'EV opłaca się przy: (1) możliwości ładowania w domu, (2) przebiegu >15 000 km/rok, (3) dotacji Mój Elektryk 2.0. Bez ładowarki w domu - traditional jest sensowniejszy.',
        faqs: [
          { q: 'Czy EV w Polsce ma sens przy ujemnych temperaturach?', a: 'Zasięg spada o 20-30% w mrozie -10°C. Ale auto można podgrzewać przy ładowaniu (bez utraty baterii). Główne ograniczenie: dostępność szybkich ładowarek w trasie.' },
          { q: 'Hybryda vs EV - co lepsze?', a: 'Hybryda dla kierowców bez dostępu do domowej ładowarki. EV dla mających ładowarkę + przebieg >15k km/rok. Hybryda plug-in (PHEV) - kompromis.' },
        ],
      };

    case 'orlen-vs-shell':
      return {
        title: 'Orlen vs Shell - porównanie sieci stacji',
        intro: 'Polska firma państwowa (Orlen) vs holenderski premium koncern (Shell). Ceny, lokalizacje, programy lojalnościowe.',
        leftLabel: 'Orlen / Lotos',
        rightLabel: 'Shell',
        rows: [
          { label: 'Liczba stacji w PL', left: '~1850', right: '~435', winner: 'left' },
          { label: 'Średnia cena Pb95 vs średnia krajowa', left: '+0,10 zł/l', right: '+0,35 zł/l', winner: 'left' },
          { label: 'Średnia cena Pb95', left: `~${formatPrice(pb95 + 0.10)}`, right: `~${formatPrice(pb95 + 0.35)}`, winner: 'left' },
          { label: 'Pozycjonowanie', left: 'mainstream', right: 'premium' },
          { label: 'Paliwo premium 98', left: 'Verva 98', right: 'V-Power 98' },
          { label: 'Karta lojalnościowa', left: 'Vitay (0,05-0,15 zł rabat)', right: 'ClubSmart (0,05-0,10 zł)', winner: 'left' },
          { label: 'Aplikacja mobilna', left: 'Orlen Pay (rozbudowana)', right: 'Shell Recharge' },
          { label: 'Sklep / kawiarnia', left: 'Stop Cafe', right: 'Shell Select', winner: 'right' },
          { label: 'Lokalizacja', left: 'wszędzie + autostrady', right: 'głównie miasta + autostrady' },
          { label: 'Polski właściciel', left: 'TAK (Skarb Państwa 49,9%)', right: 'NIE (holenderski)', winner: 'left' },
        ],
        verdict: 'Orlen = tańsze, więcej stacji, polska firma. Shell = premium experience, lepszy sklep, droższy o 0,25-0,30 zł/l. Dla większości kierowców - Orlen daje lepszą value.',
        faqs: [
          { q: 'Czy Shell V-Power jest lepszy niż Verva?', a: 'Shell V-Power ma więcej detergentów, Verva jest tańsza. Różnica jakościowa minimalna. Verva się opłaca chyba że jeździsz w mróz / startujesz na zimno.' },
          { q: 'Orlen po fuzji z Lotosem - jak teraz?', a: 'Wszystkie byłe stacje Lotos mają już branding Orlen lub przejściowo Lotos. Programy lojalnościowe (Vitay i Navigator) działają równolegle.' },
        ],
      };

    case 'polska-vs-niemcy':
      return {
        title: 'Ceny paliw: Polska vs Niemcy',
        intro: 'Polska należy do TOP 5 najtańszych krajów UE pod względem benzyny. Niemcy w TOP 5 najdroższych. Dlaczego?',
        leftLabel: '🇵🇱 Polska',
        rightLabel: '🇩🇪 Niemcy',
        rows: [
          { label: 'Średnia Pb95', left: `~${formatPrice(pb95)}/l`, right: '~7,80 zł/l', winner: 'left' },
          { label: 'Średnia Diesel', left: `~${formatPrice(on)}/l`, right: '~7,40 zł/l', winner: 'left' },
          { label: 'Akcyza Pb95', left: '1,529 zł/l', right: '~3,00 zł/l', winner: 'left' },
          { label: 'VAT', left: '23%', right: '19%', winner: 'right' },
          { label: 'CO2 Tax / ETS', left: 'tylko opłata emisyjna 0,08 zł/l', right: 'CO2 Tax ~0,50 zł/l', winner: 'left' },
          { label: 'Udział podatków w cenie', left: '~52%', right: '~60%', winner: 'left' },
          { label: 'Łączna oszczędność na 50l baku', left: '—', right: 'około 70-90 zł', winner: 'left' },
          { label: 'Średni roczny przebieg', left: '15 000 km', right: '14 000 km' },
          { label: 'Czy warto tankować w Niemczech?', left: 'TAK', right: 'NIE - drożej', winner: 'left' },
        ],
        verdict: 'Polska jest tańsza o ~1,00-1,40 zł/l (Pb95) i ~1,00-1,20 zł/l (Diesel). Niemieccy turyści tankują w Polsce przy granicy. Dla polskich kierowców jadących do Niemiec - tankuj do pełna w PL.',
        faqs: [
          { q: 'Czy Niemcy mają ograniczenia na tankowanie przy granicy?', a: 'NIE. UE = swobodny przepływ. Wszystkie sąsiednie kraje (DE, CZ, SK, LT) - bez limitu. Tylko Ukraina i Białoruś (poza UE) mają limity celne.' },
          { q: 'Kiedy najlepiej zatankować jadąc do Niemiec?', a: 'Do pełna w Polsce (max 1-2 km przed granicą). Wracając: tylko niezbędne minimum (DE zawsze drożej).' },
        ],
      };

    case 'polska-vs-czechy':
      return {
        title: 'Ceny paliw: Polska vs Czechy',
        intro: 'Sąsiednia różnica niewielka - Polska zwykle o 0,30-0,60 zł/l taniej. Turystyka paliwowa głównie z PL do CZ, nie odwrotnie.',
        leftLabel: '🇵🇱 Polska',
        rightLabel: '🇨🇿 Czechy',
        rows: [
          { label: 'Średnia Pb95', left: `~${formatPrice(pb95)}/l`, right: '~6,90 zł/l', winner: 'left' },
          { label: 'Akcyza Pb95', left: '1,529 zł/l', right: '~2,15 zł/l', winner: 'left' },
          { label: 'VAT', left: '23%', right: '21%', winner: 'right' },
          { label: 'Czy opłaca się tankować w CZ?', left: 'TAK', right: 'TAK dla Czechów wracających z PL', winner: 'left' },
          { label: 'Oszczędność na 50l baku', left: '—', right: '~25 zł', winner: 'left' },
        ],
        verdict: 'PL zwykle o 0,40-0,60 zł/l tańsze. Czesi często tankują w PL przy granicy (Cieszyn, Kłodzko). Polacy raczej tankują w PL przed wyjazdem do CZ.',
        faqs: [
          { q: 'Czy Czesi tankują w Polsce?', a: 'TAK, na pograniczu (Cieszyn, Kłodzko, Lubawka). Polskie ceny atrakcyjne też dla Słowaków i Litwinów.' },
        ],
      };

    case 'polska-vs-ukraina':
      return {
        title: 'Ceny paliw: Polska vs Ukraina',
        intro: 'Ukraina ~0,90 zł/l taniej, ale obowiązują limity celne (bak bez limitu + 10l kanister bez cła).',
        leftLabel: '🇵🇱 Polska',
        rightLabel: '🇺🇦 Ukraina',
        rows: [
          { label: 'Średnia Pb95', left: `~${formatPrice(pb95)}/l`, right: '~5,50 zł/l', winner: 'right' },
          { label: 'Średnia Diesel', left: `~${formatPrice(on)}/l`, right: '~5,30 zł/l', winner: 'right' },
          { label: 'Oszczędność per 50l', left: '—', right: '~45 zł', winner: 'right' },
          { label: 'W UE?', left: 'TAK', right: 'NIE', winner: 'left' },
          { label: 'Limit celny tankowania', left: 'brak', right: 'bak + 10l kanister bez cła', winner: 'left' },
          { label: 'Główne przejścia', left: '—', right: 'Korczowa (A4), Hrebenne, Medyka', winner: 'left' },
          { label: 'Czas oczekiwania granicy', left: '—', right: '2-6h (zwłaszcza weekend)', winner: 'left' },
        ],
        verdict: 'Ukraina jest taniej, ale czas oczekiwania granicy + limit celny = oszczędność realnie 30-40 zł na bak. Opłaca się TYLKO przy regularnych przejazdach (przygranicze).',
        faqs: [
          { q: 'Ile mogę przewieźć paliwa z Ukrainy?', a: 'Bak samochodu = bez limitu. Kanister maks. 10 litrów bez cła. Powyżej - akcyza + VAT przy odprawie.' },
          { q: 'Czy jakość paliwa na Ukrainie jest taka sama?', a: 'Na renomowanych sieciach (OKKO, WOG) - tak (PN-EN 228 / EN 590). Na małych nieznanych stacjach - możliwa niższa jakość.' },
        ],
      };

    case 'shell-vpower-vs-orlen-verva':
      return {
        title: 'Shell V-Power 98 vs Orlen Verva 98',
        intro: 'Dwa premium PB98 z dodatkami detergentowymi. Który lepszy i kiedy się opłaca?',
        leftLabel: 'Shell V-Power 98',
        rightLabel: 'Orlen Verva 98',
        rows: [
          { label: 'Cena vs zwykła Pb98', left: '+0,10-0,20 zł/l', right: '+0,05-0,15 zł/l', winner: 'right' },
          { label: 'Detergenty', left: 'najwięcej (5×)', right: 'standardowe premium', winner: 'left' },
          { label: 'Modyfikatory tarcia', left: 'TAK', right: 'TAK' },
          { label: 'Liczba oktanowa', left: '98+ RON', right: '98+ RON' },
          { label: 'Dostępność stacji', left: '~435', right: '~1850', winner: 'right' },
          { label: 'Reklamacja', left: 'Międzynarodowa procedura', right: 'Polski operator' },
          { label: 'Cena 50l', left: `~${Math.round((pb98 + 0.20) * 50)} zł`, right: `~${Math.round((pb98 + 0.10) * 50)} zł`, winner: 'right' },
        ],
        verdict: 'V-Power = więcej detergentów (czyszczenie silnika). Verva = tańsza + lepiej dostępna. Dla starszych aut z osadami - V-Power. Dla standardowego użytku - Verva.',
        faqs: [
          { q: 'Czy V-Power naprawdę czyści silnik?', a: 'Tak, ale efekt jest minimalny po 1-2 tankowaniach. Realne korzyści po regularnym używaniu 6+ miesięcy.' },
          { q: 'Czy mogę mieszać V-Power z Verva?', a: 'TAK, oba to PB98 z normy PN-EN 228. Bez problemu mieszać.' },
        ],
      };

    default:
      return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const compareInfo = COMPARES.find(c => c.slug === slug);
  if (!compareInfo) return { title: 'Porównanie nie znalezione' };

  const data = buildComparison(slug, getStats());

  return {
    title: `${compareInfo.title} – porównanie 2026 | BenzynaMAPA`,
    description: data?.intro ?? compareInfo.desc,
    alternates: { canonical: `https://benzynamapa.pl/porownanie/${slug}/` },
    openGraph: {
      title: compareInfo.title,
      description: data?.intro ?? compareInfo.desc,
      url: `https://benzynamapa.pl/porownanie/${slug}/`,
      siteName: 'BenzynaMAPA',
      locale: 'pl_PL',
      type: 'article',
    },
    keywords: [
      compareInfo.title.toLowerCase(),
      slug.replace(/-/g, ' '),
      'porównanie 2026',
      'które lepsze',
      'opłacalność',
    ],
  };
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const compareInfo = COMPARES.find(c => c.slug === slug);
  if (!compareInfo) notFound();

  const stats = getStats();
  const data = buildComparison(slug, stats);

  // Pro porovnania bez detailních dat - jednodušší stub stránka
  if (!data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black mb-4">{compareInfo.title}</h1>
        <p className="text-gray-500 mb-8">{compareInfo.desc}</p>
        <p className="text-sm text-gray-400">Szczegółowe porównanie w trakcie przygotowania. Sprawdź <Link href="/porownanie/" className="text-green-700 underline">wszystkie porównania</Link>.</p>
      </div>
    );
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://benzynamapa.pl/' },
              { '@type': 'ListItem', position: 2, name: 'Porównania', item: 'https://benzynamapa.pl/porownanie/' },
              { '@type': 'ListItem', position: 3, name: compareInfo.title, item: `https://benzynamapa.pl/porownanie/${slug}/` },
            ],
          },
          {
            '@type': 'Article',
            headline: data.title,
            description: data.intro,
            datePublished: '2026-05-20',
            dateModified: new Date().toISOString(),
            author: { '@type': 'Organization', name: 'BenzynaMAPA.pl' },
            publisher: { '@type': 'Organization', name: 'BenzynaMAPA.pl', logo: { '@type': 'ImageObject', url: 'https://benzynamapa.pl/icon-512.png' } },
            mainEntityOfPage: `https://benzynamapa.pl/porownanie/${slug}/`,
            inLanguage: 'pl',
          },
          {
            '@type': 'FAQPage',
            mainEntity: data.faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
            speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.faq-question', '.compare-verdict'] },
          },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Strona główna</Link>
          <span className="mx-2">›</span>
          <Link href="/porownanie/" className="hover:text-green-600">Porównania</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900 dark:text-white">{compareInfo.title}</span>
        </nav>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <GitCompare className="text-green-600" size={28} />
          {data.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">{data.intro}</p>

        {/* Tabela porovnání */}
        <div className="mb-10 overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="text-left p-3 font-semibold">Cecha</th>
                <th className="text-center p-3 font-bold text-green-700 dark:text-green-400">{data.leftLabel}</th>
                <th className="text-center p-3 font-bold text-blue-700 dark:text-blue-400">{data.rightLabel}</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
              {data.rows.map((row, i) => (
                <tr key={i}>
                  <td className="p-3 font-semibold text-gray-700 dark:text-gray-300">{row.label}</td>
                  <td className={`p-3 text-center ${row.winner === 'left' ? 'font-bold text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {row.winner === 'left' && <Check size={14} className="inline mr-1 text-green-600" />}
                    {row.left}
                  </td>
                  <td className={`p-3 text-center ${row.winner === 'right' ? 'font-bold text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {row.winner === 'right' && <Check size={14} className="inline mr-1 text-blue-600" />}
                    {row.right}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Verdict */}
        <div className="compare-verdict bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 border-l-4 border-green-600 rounded-r-xl p-5 mb-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Werdykt</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{data.verdict}</p>
        </div>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">FAQ - {compareInfo.title}</h2>
          <div className="space-y-3">
            {data.faqs.map(({ q, a }) => (
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

        {/* Inne porównania */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Inne porównania</h2>
          <div className="flex flex-wrap gap-2">
            {COMPARES.filter(c => c.slug !== slug).slice(0, 8).map(c => (
              <Link key={c.slug} href={`/porownanie/${c.slug}/`}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:border-green-500 hover:text-green-700 transition-all">
                {c.title}
              </Link>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/porownanie/" className="text-green-700 dark:text-green-400 hover:underline">← Wszystkie porównania</Link>
          <Link href="/marka/" className="text-gray-500 hover:text-green-700">Sieci stacji →</Link>
          <Link href="/kalkulator/" className="text-gray-500 hover:text-green-700">Kalkulator →</Link>
        </div>
      </div>
    </>
  );
}
