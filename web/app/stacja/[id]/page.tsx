import { getStationById, getStations, formatPrice, timeAgo, isPriceStale } from '@/lib/data';
import { FUEL_LABELS } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 21600;
export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const stations = getStations();
    if (!stations.length) return [{ id: '__placeholder__' }];
    return stations.map(s => ({ id: s.id }));
  } catch {
    return [{ id: '__placeholder__' }];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const station = getStationById(id);
  if (!station) return { title: 'Stacja nie znaleziona' };

  const p = station.price;
  const priceStr = p?.pb95 ? `Benzyna 95: ${formatPrice(p.pb95)}` : '';

  return {
    title: `${station.name} – ceny paliw ${station.city}`,
    description: `Aktualne ceny paliw na stacji ${station.name} w ${station.city}. ${priceStr}. Sprawdź i nawiguj.`,
    alternates: { canonical: `https://benzynamapa.pl/stacja/${id}/` },
    openGraph: {
      title: `${station.name} – ceny paliw`,
      description: `Ceny paliw: ${station.address}, ${station.city}`,
      url: `https://benzynamapa.pl/stacja/${id}/`,
      siteName: 'BenzynaMAPA',
      locale: 'pl_PL',
      type: 'website',
    },
  };
}

export default async function StationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const station = getStationById(id);
  if (!station) notFound();

  const p = station.price;
  const stale = p?.reported_at ? isPriceStale(p.reported_at) : false;
  const gmaps = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
  const waze = `https://waze.com/ul?ll=${station.lat},${station.lng}&navigate=yes`;

  const fuels: { key: 'pb95' | 'pb98' | 'on' | 'lpg'; label: string }[] = [
    { key: 'pb95', label: FUEL_LABELS.pb95 },
    { key: 'pb98', label: FUEL_LABELS.pb98 },
    { key: 'on', label: FUEL_LABELS.on },
    { key: 'lpg', label: FUEL_LABELS.lpg },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-4">
        <Link href="/" className="text-sm text-green-700 dark:text-green-400 hover:underline">← Wróć do mapy</Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{station.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{station.address}, {station.city}</p>
            {station.brand && <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">{station.brand}</span>}
          </div>
        </div>

        {station.opening_hours && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">⏰ {station.opening_hours}</p>
        )}

        {p ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900 dark:text-white">Aktualne ceny paliw</h2>
              {p.reported_at && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${stale ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                  {stale ? '⚠ Nieaktualne' : `✓ ${timeAgo(p.reported_at)}`}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {fuels.map(({ key, label }) => {
                const price = p[key];
                if (!price) return null;
                const isReal = p.source === 'cenapaliw.pl';
                return (
                  <div key={key} className={`rounded-xl p-4 text-center border ${isReal ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{label}</div>
                    <div className={`text-2xl font-black ${isReal ? 'text-green-700 dark:text-green-400' : 'text-gray-500'}`}>
                      {isReal ? '' : '~'}{formatPrice(price)}
                    </div>
                    {!isReal && <div className="text-xs text-gray-400 mt-0.5">szacunek</div>}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center text-gray-500">
            Brak danych o cenach dla tej stacji
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <a href={gmaps} target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-xl font-bold text-sm transition-colors">
            🗺 Google Maps
          </a>
          <a href={waze} target="_blank" rel="noopener noreferrer" className="flex-1 bg-sky-400 hover:bg-sky-500 text-black text-center py-3 rounded-xl font-bold text-sm transition-colors">
            📡 Waze
          </a>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'GasStation',
            name: station.name,
            address: {
              '@type': 'PostalAddress',
              streetAddress: station.address,
              addressLocality: station.city,
              addressCountry: 'PL',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: station.lat,
              longitude: station.lng,
            },
            url: `https://benzynamapa.pl/stacja/${id}/`,
          }),
        }}
      />
    </div>
  );
}
