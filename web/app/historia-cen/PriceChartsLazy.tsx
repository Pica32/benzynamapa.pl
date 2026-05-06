'use client';
import dynamic from 'next/dynamic';

const PriceCharts = dynamic(() => import('./PriceCharts'), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center text-gray-400">
      <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function PriceChartsLazy() {
  return <PriceCharts />;
}
