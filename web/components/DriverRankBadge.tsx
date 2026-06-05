'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadGam, levelInfo, type GamState } from '@/lib/gamification';

/**
 * Kompaktní odznak hodnosti řidiče v hlavičce — viditelný na celém webu,
 * jakmile uživatel získá první body. Klikací → profil. Posiluje návyk.
 * Skrytý pro nové návštěvníky (0 bodů), aby nerušil.
 */
export default function DriverRankBadge() {
  const [gam, setGam] = useState<GamState | null>(null);

  useEffect(() => {
    const refresh = () => setGam(loadGam());
    refresh();
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    window.addEventListener('gam-update', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('gam-update', refresh);
    };
  }, []);

  if (!gam || gam.points <= 0) return null;
  const lvl = levelInfo(gam.points);

  return (
    <Link
      href="/profil/"
      title={`${lvl.current.name} · ${gam.points} pkt${lvl.next ? ` · ${lvl.toNext} pkt do: ${lvl.next.name}` : ' · maks. ranga'}`}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 dark:bg-gray-800 border border-green-200 dark:border-gray-700 hover:border-green-400 transition-colors"
    >
      <span className="text-sm leading-none">{lvl.current.icon}</span>
      <span className="text-xs font-bold text-green-700 dark:text-green-400 leading-none">{gam.points}</span>
      <span className="hidden sm:inline text-[10px] text-gray-500 dark:text-gray-400 leading-none">pkt</span>
    </Link>
  );
}
