import { getStationById, getStations, getStationsWithPrices, formatPrice, slugify } from '@/lib/data';
import { CITIES, FUEL_LABELS } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Clock, ChevronLeft, Navigation } from 'lucide-react';
import GpsButtons from './GpsButtons';
import StationMiniMap from '@/components/StationMiniMap';
import ShareButtons from '@/components/ShareButtons';
import PriceReport from '@/components/PriceReport';
import type { Metadata } from 'next';

export const revalidate = 21600;
export const dynamicParams = true;

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  try {
    return getStationsWithPrices()
      .filter(s => s.price?.pb95 != null || s.price?.on != null)
      .map(s => ({ id: s.id }));
  } catch { return []; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const station = getStationById(id);
  if (!station) return { title: 'Stacja nie znaleziona' };

  const p95 = station.price?.pb95;
  const pOn = station.price?.on;
  const priceStr = p95
    ? `Benzyna 95 ${formatPrice(p95)}${pOn ? `, diesel ${formatPrice(pOn)}` : ''}`
    : pOn ? `Diesel ${formatPrice(pOn)}` : '';

  const desc = priceStr
    ? `Aktualne ceny paliw ${station.name} ${station.city} – ${priceStr}. Mapa, nawigacja i godziny otwarcia. ${station.brand} stacja paliw.`
    : `Stacja paliw ${station.name} w ${station.city} – ceny benzyny i diesla dziś, mapa, GPS, godziny otwarcia. ${station.brand}.`;

  return {
    title: `${station.name} ${station.city} – ceny paliw dziś`,
    description: desc.slice(0, 158),
    alternates: { canonical: `https://benzynamapa.pl/stacja/${id}/` },
    openGraph: {
      title: `${station.name} ${station.city} – ceny paliw`,
      description: desc.slice(0, 155),
      type: 'website',
      url: `https://benzynamapa.pl/stacja/${id}/`,
      siteName: 'BenzynaMAPA',
      locale: 'pl_PL',
    },
    keywords: [
      `${station.name} ${station.city}`,
      `stacja paliw ${station.city}`,
      `ceny benzyny ${station.city}`,
      `diesel ${station.city}`,
      `${station.brand} ceny paliw`,
    ],
  };
}

const SERVICE_LABELS: Record<string, string> = {
  lpg: '🟢 LPG',
  adblue: '🔵 AdBlue',
  car_wash: '🚗 Myjnia',
};

export default async function StationPage({ params }: Props) {
  const { id } = await params;
  const station = getStationById(id);
  if (!station) notFound();

  const lat = station.lat.toFixed(6);
  const lng = station.lng.toFixed(6);
  const citySlug = slugify(station.city);
  const cityExists = CITIES.some(c => c.slug === citySlug);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const wazeUrl       = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  const appleMapsUrl  = `https://maps.apple.com/?daddr=${lat},${lng}`;
  const osmUrl        = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=16`;

  const fuels = ['pb95', 'pb98', 'on', 'lpg'] as const;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'GasStation',
        name: station.name,
        address: { '@type': 'PostalAddress', streetAddress: station.address, addressLocality: station.city, addressCountry: 'PL' },
        geo: { '@type': 'GeoCoordinates', latitude: station.lat, longitude: station.lng },
        url: `https://benzynamapa.pl/stacja/${id}/`,
        ...(station.opening_hours ? { openingHours: station.opening_hours } : {}),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'BenzynaMAPA', item: 'https://benzynamapa.pl/' },
          ...(cityExists ? [{ '@type': 'ListItem', position: 2, name: station.city, item: `https://benzynamapa.pl/miasto/${citySlug}/` }] : [{ '@type': 'ListItem', position: 2, name: station.city }]),
          { '@type': 'ListItem', position: 3, name: `${station.name} – ceny paliw` },
        ],
      }) }} />

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-5">
          <Link href="/" className="hover:text-green-600">Mapa</Link>
          <span>›</span>
          {cityExists
            ? <Link href={`/miasto/${citySlug}/`} className="hover:text-green-600">{station.city}</Link>
            : <span>{station.city}</span>}
          <span>›</span>
          <span className="text-gray-900 dark:text-white truncate max-w-[200px]">{station.name}</span>
        </nav>

        {/* Hlavní karta */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mb-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <span className="inline-block text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2.5 py-0.5 rounded-full uppercase tracking-wide mb-2">
                {station.brand}
              </span>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                {station.name} – ceny paliw {station.city}
              </h1>
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                <MapPin size={13} /> {station.address}
              </p>
              {station.opening_hours && (
                <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1">
                  <Clock size={13} /> {station.opening_hours}
                </p>
              )}
            </div>
          </div>

          {/* Ceny */}
          {station.price && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {fuels.map(fuel => {
                const price = station.price![fuel];
                if (!price) return null;
                const isReal = station.price!.source === 'cenapaliw.pl';
                return (
                  <div key={fuel} className={`rounded-xl p-3 text-center border ${isReal ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{FUEL_LABELS[fuel]}</div>
                    <div className={`text-xl font-black ${isReal ? 'text-green-700 dark:text-green-400' : 'text-gray-500'}`}>
                      {isReal ? '' : '~'}{formatPrice(price)}
                    </div>
                    {isReal
                      ? <div className="text-[9px] text-green-500 mt-0.5">✓ zweryfikowane</div>
                      : <div className="text-[9px] text-gray-400 mt-0.5">szacunek</div>}
                  </div>
                );
              })}
            </div>
          )}

          {/* Usługi */}
          {station.services.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
              {station.services.map(s => (
                <span key={s} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full">
                  {SERVICE_LABELS[s] ?? s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Hlášení cen */}
        <div className="mb-5">
          <PriceReport stationId={id} />
        </div>

        {/* GPS + nawigacja */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mb-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Navigation size={18} className="text-green-600" /> GPS i nawigacja
          </h2>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4 font-mono text-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-gray-400 text-xs">Szerokość geogr.</span>
                <p className="font-bold text-gray-900 dark:text-white text-base">{lat}</p>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Długość geogr.</span>
                <p className="font-bold text-gray-900 dark:text-white text-base">{lng}</p>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Format dziesiętny</span>
                <p className="font-bold text-gray-900 dark:text-white text-base">{lat}, {lng}</p>
              </div>
            </div>
          </div>
          <GpsButtons lat={lat} lng={lng} name={station.name} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
            {[
              { href: googleMapsUrl, icon: '🗺', label: 'Google Maps', color: 'hover:border-green-400 hover:bg-green-50 dark:hover:bg-gray-700 group-hover:text-green-700' },
              { href: wazeUrl,       icon: '📡', label: 'Waze',        color: 'hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 group-hover:text-blue-700' },
              { href: appleMapsUrl,  icon: '🍎', label: 'Apple Maps',  color: 'hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 group-hover:text-gray-700' },
              { href: osmUrl,        icon: '🌍', label: 'OpenStreetMap', color: 'hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-gray-700 group-hover:text-orange-700' },
            ].map(b => (
              <a key={b.label} href={b.href} target="_blank" rel="noopener noreferrer"
                 className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-200 dark:border-gray-600 transition-all group ${b.color}`}>
                <span className="text-2xl">{b.icon}</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{b.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Mini mapa */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-5 shadow-sm">
          <div className="w-full" style={{ height: 280 }}>
            <StationMiniMap lat={station.lat} lng={station.lng} name={station.name} />
          </div>
          <div className="px-4 py-2 text-xs text-gray-400 flex items-center gap-1">
            <MapPin size={10} />
            {station.address} · GPS: {lat}, {lng}
          </div>
        </div>

        {/* Sdílení */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mb-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Udostępnij tę stację</p>
          <ShareButtons url={`https://benzynamapa.pl/stacja/${id}/`} title={`${station.name} – ceny paliw | BenzynaMAPA.pl`} />
        </div>

        {/* SEO text */}
        <section className="mt-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">
            Stacja paliw {station.name} w {station.city} – informacje i ceny
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Stacja paliw <strong>{station.name}</strong> znajduje się pod adresem {station.address} w {station.city}
            {station.region && station.region !== station.city ? ` (${station.region})` : ''}.
            {station.opening_hours
              ? ` Godziny otwarcia: ${station.opening_hours}.`
              : ' Godziny otwarcia zalecamy sprawdzić bezpośrednio na miejscu lub na stronie operatora.'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            {station.price?.source === 'cenapaliw.pl'
              ? <>
                  Aktualne ceny paliw na tej stacji:{station.price.pb95 ? ` Benzyna 95 – ${formatPrice(station.price.pb95)} zł/l` : ''}
                  {station.price.on ? `, diesel – ${formatPrice(station.price.on)} zł/l` : ''}
                  {station.price.lpg ? `, LPG – ${formatPrice(station.price.lpg)} zł/l` : ''}.
                  {' '}Dane są weryfikowane ze źródeł społecznościowych i aktualizowane 3× dziennie.
                </>
              : `Ceny paliw na stacji ${station.name} są regularnie aktualizowane. Jeśli znasz aktualną cenę, podaj ją powyżej i pomóż innym kierowcom w ${station.city}.`
            }
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            Stację prowadzi sieć <strong>{station.brand}</strong>.
            {station.services.length > 0
              ? ` Na stacji dostępne są: ${station.services.map(s => ({ lpg: 'LPG', adblue: 'AdBlue', car_wash: 'myjnia samochodowa' }[s] ?? s)).join(', ')}.`
              : ''} GPS: {lat}°N, {lng}°E.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {cityExists
              ? <>Porównanie cen wszystkich stacji w {station.city} znajdziesz na stronie{' '}
                  <Link href={`/miasto/${citySlug}/`} className="text-green-700 dark:text-green-400 hover:underline">
                    ceny paliw {station.city}
                  </Link>.{' '}</>
              : <>Porównanie cen stacji w okolicy znajdziesz na{' '}</>}
            Ogólny ranking najtańszych stacji paliw w Polsce dostępny jest na{' '}
            <Link href="/" className="text-green-700 dark:text-green-400 hover:underline">mapie BenzynaMAPA.pl</Link>.
          </p>
        </section>

        <div className="mt-5 flex items-center gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-green-700 hover:text-green-800 dark:text-green-400 font-medium">
            <ChevronLeft size={16} /> Wróć do mapy
          </Link>
          {cityExists && (
            <Link href={`/miasto/${citySlug}/`} className="text-sm text-gray-500 hover:text-green-700 dark:text-gray-400">
              Wszystkie stacje w {station.city} →
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
