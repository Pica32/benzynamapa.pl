import type { Metadata } from 'next';
import PriceChartsLazy from './PriceChartsLazy';

export const revalidate = 21600;

export const metadata: Metadata = {
  title: 'Historia cen paliw w Polsce – wykres 90 dni',
  description: 'Historia i trend cen benzyny 95, diesla i LPG w Polsce. Wykres zmian cen paliw za ostatnie 90 dni. Kiedy tankować najtaniej?',
  alternates: { canonical: 'https://benzynamapa.pl/historia-cen/' },
};

export default function HistoriaCenPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Historia cen paliw w Polsce</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Średnie ceny benzyny 95, diesla i LPG w Polsce za ostatnie 90 dni. Dane aktualizowane 3× dziennie.
      </p>
      <PriceChartsLazy />
    </div>
  );
}
