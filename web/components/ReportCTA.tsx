'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, ChevronRight } from 'lucide-react';
import { loadGam, levelInfo, dailyBonusAvailable, type GamState } from '@/lib/gamification';

/**
 * Site-wide výzva k hlášení cen — gamifikovaný banner. Adaptivní:
 *  - nový uživatel (0 pkt): pozvánka do komunity
 *  - vracející se: jeho hodnost + body + denní bonus lure
 * Umisťuje se na homepage, stránky měst atd. → gamifikace celého webu.
 */
export default function ReportCTA({ className = '' }: { className?: string }) {
  const [gam, setGam] = useState<GamState | null>(null);

  useEffect(() => {
    const refresh = () => setGam(loadGam());
    refresh();
    window.addEventListener('gam-update', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('gam-update', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  const hasPoints = gam && gam.points > 0;
  const lvl = gam ? levelInfo(gam.points) : null;
  const bonus = gam ? dailyBonusAvailable(gam) : false;

  return (
    <Link
      href={hasPoints ? '/profil/' : '/'}
      className={`group block rounded-2xl border border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 p-4 sm:p-5 hover:border-green-400 transition-all ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="text-4xl sm:text-5xl flex-shrink-0">{hasPoints ? lvl!.current.icon : '🏆'}</div>
        <div className="flex-1 min-w-0">
          {hasPoints ? (
            <>
              <div className="font-black text-gray-900 dark:text-white text-base sm:text-lg leading-tight">
                {lvl!.current.name} · {gam!.points} pkt
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                {bonus
                  ? '🎁 Bonus dzienny czeka! Zgłoś dziś cenę i zgarnij +10 pkt ekstra.'
                  : lvl!.next
                    ? <>Jeszcze <strong className="text-green-700 dark:text-green-400">{lvl!.toNext} pkt</strong> do rangi {lvl!.next.icon} {lvl!.next.name}.</>
                    : 'Masz maksymalną rangę! 🏆 Zgłaszaj dalej i pomagaj kierowcom.'}
              </div>
            </>
          ) : (
            <>
              <div className="font-black text-gray-900 dark:text-white text-base sm:text-lg leading-tight flex items-center gap-1.5">
                <Trophy size={16} className="text-green-600" /> Dołącz do społeczności kierowców
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                Zgłaszaj ceny paliw, zdobywaj <strong className="text-green-700 dark:text-green-400">punkty i odznaki</strong>, awansuj w rangach — i pomagaj innym tankować taniej.
              </div>
            </>
          )}
        </div>
        <ChevronRight className="text-green-600 group-hover:translate-x-1 transition-transform flex-shrink-0" size={20} />
      </div>
    </Link>
  );
}
