'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Flame, Trophy, MapPin, CheckCircle, Send, TrendingUp } from 'lucide-react';
import {
  loadGam, levelInfo, badgeStatus, LEVELS, dailyBonusAvailable, type GamState,
} from '@/lib/gamification';

export default function ProfilClient() {
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

  if (!gam) return <div className="p-8 text-center text-gray-400">Ładowanie…</div>;

  const lvl = levelInfo(gam.points);
  const badges = badgeStatus(gam);
  const unlocked = badges.filter(b => b.unlocked).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1 flex items-center gap-2">
        <Trophy className="text-green-600" /> Mój profil kierowcy
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
        Zgłaszaj i potwierdzaj ceny paliw — zdobywaj punkty, awansuj i odblokowuj odznaki.
      </p>

      {/* Hlavní karta — hodnost + body + postup */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl border border-green-100 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="text-6xl">{lvl.current.icon}</div>
          <div className="flex-1">
            <div className="text-2xl font-black text-gray-900 dark:text-white">{lvl.current.name}</div>
            <div className="text-3xl font-black text-green-700 dark:text-green-400">{gam.points} <span className="text-base font-normal text-gray-400">pkt</span></div>
          </div>
          {gam.streakDays >= 2 && (
            <div className="text-center bg-orange-50 dark:bg-orange-900/20 rounded-xl px-3 py-2">
              <Flame className="text-orange-500 mx-auto" size={22} />
              <div className="text-lg font-black text-orange-600">{gam.streakDays}</div>
              <div className="text-[9px] text-orange-400 uppercase">dni z rzędu</div>
            </div>
          )}
        </div>
        {lvl.next && (
          <div className="mt-4">
            <div className="h-2.5 bg-white dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${Math.round(lvl.progress * 100)}%` }} />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-1">
              <Trophy size={11} /> Jeszcze <strong className="text-green-700 dark:text-green-400">{lvl.toNext} pkt</strong> do rangi: {lvl.next.icon} {lvl.next.name}
            </div>
          </div>
        )}
        {dailyBonusAvailable(gam) && (
          <div className="mt-4 text-sm px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 font-semibold">
            🎁 Bonus dzienny czeka! Zgłoś dziś cenę i zgarnij +10 pkt ekstra.
          </div>
        )}
      </div>

      {/* Statistiky */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: Send, label: 'Zgłoszeń', val: gam.reports, color: 'text-green-600' },
          { icon: CheckCircle, label: 'Potwierdzeń', val: gam.confirms, color: 'text-blue-600' },
          { icon: MapPin, label: 'Miast', val: gam.cities.length, color: 'text-purple-600' },
        ].map(({ icon: Icon, label, val, color }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
            <Icon className={`mx-auto mb-1 ${color}`} size={20} />
            <div className="text-2xl font-black text-gray-900 dark:text-white">{val}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</div>
          </div>
        ))}
      </div>

      {/* Odznaky */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        Odznaki <span className="text-sm font-normal text-gray-400">({unlocked}/{badges.length})</span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {badges.map(({ a, unlocked: ok }) => (
          <div key={a.id}
            className={`rounded-xl border p-3 text-center transition-all ${ok
              ? 'bg-white dark:bg-gray-800 border-yellow-300 dark:border-yellow-700 shadow-sm'
              : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-60'}`}>
            <div className={`text-3xl mb-1 ${ok ? '' : 'grayscale'}`}>{ok ? a.icon : '🔒'}</div>
            <div className="text-xs font-bold text-gray-900 dark:text-white">{a.name}</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{a.desc}</div>
          </div>
        ))}
      </div>

      {/* Žebříček hodností */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Rangi kierowców</h2>
      <div className="space-y-1.5 mb-8">
        {LEVELS.map(l => {
          const reached = gam.points >= l.min;
          const current = lvl.current.name === l.name;
          return (
            <div key={l.name}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${current
                ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700'
                : reached ? 'bg-white dark:bg-gray-800' : 'opacity-50'}`}>
              <span className="text-xl">{l.icon}</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 flex-1">{l.name}</span>
              <span className="text-xs text-gray-400">{l.min}+ pkt</span>
              {current && <span className="text-xs font-bold text-green-600">← jesteś tu</span>}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="bg-green-600 rounded-2xl p-6 text-center text-white">
        <TrendingUp className="mx-auto mb-2" />
        <h3 className="text-lg font-black mb-1">Zdobywaj kolejne punkty!</h3>
        <p className="text-sm text-green-100 mb-4">Otwórz mapę, wybierz stację i zgłoś aktualną cenę paliwa.</p>
        <Link href="/" className="inline-block bg-white text-green-700 font-bold px-6 py-2.5 rounded-xl hover:bg-green-50 transition-colors">
          Otwórz mapę stacji →
        </Link>
      </div>

      <p className="text-[11px] text-gray-400 text-center mt-6">
        Punkty i odznaki są zapisywane w Twojej przeglądarce. Pomagają motywować społeczność —
        im więcej zgłoszeń, tym dokładniejsze ceny dla wszystkich kierowców.
      </p>
    </div>
  );
}
