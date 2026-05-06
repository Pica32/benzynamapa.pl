import type { Metadata } from 'next';
import KalkulatorClient from './KalkulatorClient';

export const metadata: Metadata = {
  title: 'Kalkulator zużycia paliwa – ile kosztuje przejazd?',
  description: 'Oblicz koszt paliwa na trasę. Kalkulator zużycia benzyny, diesla i LPG w Polsce. Ile zapłacisz za przejazd?',
  alternates: { canonical: 'https://benzynamapa.pl/kalkulator/' },
};

export default function KalkulatorPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Kalkulator zużycia paliwa</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Oblicz koszt paliwa na planowaną trasę na podstawie aktualnych cen w Polsce.
      </p>
      <KalkulatorClient />
    </div>
  );
}
