import { getStationsByBrand, formatPrice } from '@/lib/data';
import { BRAND_PAGES, FUEL_LABELS } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 21600;
export const dynamicParams = false;

export async function generateStaticParams() {
  return BRAND_PAGES.map(b => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const { brand } = await params;
  const brandPage = BRAND_PAGES.find(b => b.slug === brand);
  if (!brandPage) return { title: 'Sieć nie znaleziona' };

  return {
    title: `${brandPage.fullName} – ceny paliw, stacje w Polsce`,
    description: `Aktualne ceny paliw na stacjach ${brandPage.fullName} w Polsce. ${brandPage.description}`,
    alternates: { canonical: `https://benzynamapa.pl/marka/${brand}/` },
    openGraph: {
      title: `${brandPage.fullName} ceny paliw – BenzynaMAPA`,
      description: brandPage.description,
      url: `https://benzynamapa.pl/marka/${brand}/`,
      siteName: 'BenzynaMAPA',
      locale: 'pl_PL',
      type: 'website',
    },
  };
}

export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;
  const brandPage = BRAND_PAGES.find(b => b.slug === brand);
  if (!brandPage) notFound();

  const stations = getStationsByBrand(brandPage);
  const withPrice = stations.filter(s => s.price?.pb95 != null || s.price?.on != null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-4">
        <Link href="/marka/" className="text-sm text-green-700 dark:text-green-400 hover:underline">← Wszystkie sieci</Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className={`${brandPage.color} text-white rounded-xl px-4 py-2 text-xl font-black`}>{brandPage.name}</div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">{brandPage.fullName}</h1>
          <div className={`font-bold text-sm ${brandPage.priceOffsetNum > 0 ? 'text-red-600' : brandPage.priceOffsetNum < 0 ? 'text-green-600' : 'text-gray-500'}`}>
            {brandPage.priceOffset} od średniej krajowej
          </div>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-8">{brandPage.description}</p>

      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Stacje {brandPage.name} z aktualnymi cenami ({withPrice.length})
      </h2>

      <div className="grid sm:grid-cols-2 gap-4">
        {withPrice.slice(0, 40).map(s => (
          <Link key={s.id} href={`/stacja/${s.id}/`} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-green-500 hover:bg-green-50 dark:hover:bg-gray-700 transition-all group">
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 mb-1 truncate">{s.name}</div>
            <div className="text-xs text-gray-500 mb-3 truncate">{s.address}, {s.city}</div>
            <div className="flex gap-3 flex-wrap">
              {(['pb95', 'on', 'lpg'] as const).map(fuel => {
                const price = s.price?.[fuel];
                if (!price) return null;
                return (
                  <div key={fuel} className="text-center">
                    <div className="text-xs text-gray-400">{FUEL_LABELS[fuel]}</div>
                    <div className="font-black text-green-700 dark:text-green-400 text-sm">{formatPrice(price)}</div>
                  </div>
                );
              })}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
