'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Props { lat: string; lng: string; name: string; }

export default function GpsButtons({ lat, lng, name }: Props) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(`${lat}, ${lng}`); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const shareUrl = `https://benzynamapa.pl/stacja/${name}`;
  const shareData = { title: name, text: `Stacja paliw: ${name}`, url: shareUrl };
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;
  return (
    <div className="flex gap-2 flex-wrap">
      <button onClick={copy}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">
        {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
        {copied ? 'Skopiowano!' : 'Kopiuj GPS'}
      </button>
      {canShare && (
        <button onClick={() => navigator.share(shareData).catch(() => {})}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-sm font-semibold text-white transition-colors">
          📤 Udostępnij
        </button>
      )}
    </div>
  );
}
