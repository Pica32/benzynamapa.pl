import { getStationsByCity, formatPrice } from '@/lib/data';
import { CITIES, FUEL_LABELS } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 21600;
export const dynamicParams = false;

export async function generateStaticParams() {
  return CITIES.map(c => ({ nazev: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ nazev: string }> }): Promise<Metadata> {
  const { nazev } = await params;
  const city = CITIES.find(c => c.slug === nazev);
  if (!city) return { title: 'Miasto nie znalezione' };

  return {
    title: `Ceny paliw ${city.name} dziś – najtańsze stacje`,
    description: `Aktualne ceny benzyny 95, diesla i LPG w ${city.name}. Mapa najtańszych stacji paliw w ${city.name}. Aktualizacja 3× dziennie.`,
    alternates: { canonical: `https://benzynamapa.pl/miasto/${nazev}/` },
    openGraph: {
      title: `Ceny paliw ${city.name} – BenzynaMAPA`,
      description: `Najtańsze stacje paliw w ${city.name}. Benzyna 95, diesel, LPG.`,
      url: `https://benzynamapa.pl/miasto/${nazev}/`,
      siteName: 'BenzynaMAPA',
      locale: 'pl_PL',
      type: 'website',
    },
  };
}

export default async function MiastoPage({ params }: { params: Promise<{ nazev: string }> }) {
  const { nazev } = await params;
  const city = CITIES.find(c => c.slug === nazev);
  if (!city) notFound();

  const stations = getStationsByCity(city.name);
  const withPrice = stations.filter(s => s.price?.pb95 != null || s.price?.on != null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-4">
        <Link href="/" className="text-sm text-green-700 dark:text-green-400 hover:underline">← Mapa</Link>
      </div>

      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
        Ceny paliw w {city.name}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        {withPrice.length} stacji paliw z aktualnymi cenami w {city.name}.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {withPrice
          .sort((a, b) => (a.price?.pb95 ?? 999) - (b.price?.pb95 ?? 999))
          .slice(0, 30)
          .map(s => (
            <Link key={s.id} href={`/stacja/${s.id}/`} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-green-500 hover:bg-green-50 dark:hover:bg-gray-700 transition-all group">
              <div className="font-semibold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 mb-1 truncate">{s.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 truncate">{s.address}</div>
              <div className="flex gap-3 flex-wrap">
                {(['pb95', 'on', 'lpg'] as const).map(fuel => {
                  const price = s.price?.[fuel];
                  if (!price) return null;
                  return (
                    <div key={fuel} className="text-center">
                      <div className="text-xs text-gray-400">{FUEL_LABELS[fuel]}</div>
                      <div className="font-black text-green-700 dark:text-green-400">{formatPrice(price)}</div>
                    </div>
                  );
                })}
              </div>
            </Link>
          ))}
      </div>

      {withPrice.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Brak danych o cenach dla stacji w {city.name}.
        </div>
      )}
    </div>
  );
}
