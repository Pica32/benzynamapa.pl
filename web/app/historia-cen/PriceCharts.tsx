'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

interface HistoryEntry {
  date: string;
  pb95: number | null;
  on: number | null;
  lpg: number | null;
}

export default function PriceCharts() {
  const [data, setData] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/history_90d.json')
      .then(r => r.json())
      .then(d => { setData(d.history ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="h-64 flex items-center justify-center text-gray-400">
      <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!data.length) return (
    <div className="text-center py-12 text-gray-500">Brak danych historycznych.</div>
  );

  const formatted = data.map(d => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' }),
  }));

  return (
    <div className="space-y-10">
      {[
        { key: 'pb95' as const, label: 'Benzyna 95 (PB95)', color: '#16a34a' },
        { key: 'on' as const, label: 'Diesel (olej napędowy)', color: '#374151' },
        { key: 'lpg' as const, label: 'LPG Autogaz', color: '#7c3aed' },
      ].map(({ key, label, color }) => (
        <div key={key} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">{label}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={formatted} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={13} />
              <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} tickFormatter={v => v.toFixed(2).replace('.', ',')} />
              <Tooltip formatter={(v) => [typeof v === 'number' ? v.toFixed(2).replace('.', ',') + ' zł' : v, label]} />
              <Legend />
              <Line type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={false} name={label} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}
