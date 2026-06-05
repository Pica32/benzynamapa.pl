'use client';
import { useEffect, useState, useCallback } from 'react';
import { FUEL_LABELS, FuelType } from '@/types';
import { Users, CheckCircle, Send, ChevronDown, ChevronUp, Flame, Trophy } from 'lucide-react';
import {
  loadGam, awardReport, awardConfirm, levelInfo, type GamState,
} from '@/lib/gamification';
import { VERIFY_THRESHOLD } from '@/lib/priceModeration';

interface UserSub {
  id: string;
  fuel_type: FuelType;
  price: number;
  submitted_at: string;
  confirmations: number;
}

function getBrowserId(): string {
  if (typeof localStorage === 'undefined') return 'ssr';
  let id = localStorage.getItem('benzynamapa_bid');
  if (!id) { id = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('benzynamapa_bid', id); }
  return id;
}

function getConfirmed(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem('benzynamapa_confirmed') ?? '[]')); } catch { return new Set(); }
}

function saveConfirmed(set: Set<string>) {
  localStorage.setItem('benzynamapa_confirmed', JSON.stringify([...set]));
}

function getLocalSubs(stationId: string): UserSub[] {
  try {
    const raw = localStorage.getItem(`benzynamapa_subs_${stationId}`);
    if (!raw) return [];
    const parsed: UserSub[] = JSON.parse(raw);
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    return parsed.filter(s => new Date(s.submitted_at).getTime() > cutoff);
  } catch { return []; }
}

function saveLocalSub(stationId: string, entry: UserSub) {
  try {
    const existing = getLocalSubs(stationId).filter(s => s.id !== entry.id);
    localStorage.setItem(`benzynamapa_subs_${stationId}`, JSON.stringify([entry, ...existing].slice(0, 20)));
  } catch {}
}

const FUEL_ORDER: FuelType[] = ['pb95', 'on', 'pb98', 'lpg'];

interface Props {
  stationId: string;
  initialFuel?: FuelType;
  forceOpen?: boolean;
  /** Aktuálně zobrazené ceny stanice — reference pro automatickou kontrolu + pre-fill. */
  referencePrice?: Partial<Record<FuelType, number>>;
}

export default function PriceReport({ stationId, initialFuel, forceOpen, referencePrice }: Props) {
  const [subs, setSubs] = useState<UserSub[]>([]);
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [formFuel, setFormFuel] = useState<FuelType>(initialFuel ?? 'pb95');
  const [formPrice, setFormPrice] = useState('');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [gam, setGam] = useState<GamState | null>(null);
  const [flash, setFlash] = useState<{ pts: number; level?: string } | null>(null);

  const load = useCallback(async () => {
    const local = getLocalSubs(stationId);
    try {
      const res = await fetch(`/api/user-prices/${stationId}`);
      const server: UserSub[] = res.ok ? await res.json() : [];
      const seen = new Set<string>();
      const merged = [...local, ...server].filter(s => { if (seen.has(s.id)) return false; seen.add(s.id); return true; });
      setSubs(merged);
    } catch { setSubs(local); }
    setConfirmed(getConfirmed());
  }, [stationId]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setGam(loadGam()); }, []);
  useEffect(() => { if (forceOpen) setOpen(true); }, [forceOpen]);
  useEffect(() => { if (initialFuel) setFormFuel(initialFuel); }, [initialFuel]);

  // Pre-fill: nabídni aktuální cenu stanice → 1 tap na "Zgłoś" = potvrzení (auto-ověřeno).
  useEffect(() => {
    const ref = referencePrice?.[formFuel];
    setFormPrice(ref != null ? ref.toFixed(2).replace('.', ',') : '');
  }, [formFuel, referencePrice]);

  // Transientní zhasnutí flash hlášky o bodech
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 4500);
    return () => clearTimeout(t);
  }, [flash]);

  const verified = subs.filter(s => s.confirmations >= VERIFY_THRESHOLD);
  const lvl = gam ? levelInfo(gam.points) : null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setMsg(null);
    const p = parseFloat(formPrice.replace(',', '.'));
    if (isNaN(p) || p < 2 || p > 14) {
      setMsg({ text: 'Cena musi być między 2,00 a 14,00 zł', ok: false });
      setSending(false);
      return;
    }
    const res = await fetch('/api/report-price', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        station_id: stationId, fuel_type: formFuel, price: p,
        browser_id: getBrowserId(), reference: referencePrice?.[formFuel] ?? null,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      if (data.entry) saveLocalSub(stationId, data.entry);
      const r = awardReport();
      setGam(r.state);
      setFlash({ pts: r.earned, level: r.leveledUp?.name });
      setMsg({
        text: data.autoVerified
          ? 'Cena potwierdzona automatycznie ✓ Dzięki! 🎉'
          : 'Cena zgłoszona — czeka na potwierdzenie. Dzięki! 🎉',
        ok: true,
      });
      load();
    } else {
      // 422 = automatyczna kontrola odrzuciła (np. nierealna cena)
      setMsg({ text: data.error ?? 'Błąd', ok: false });
    }
    setSending(false);
  }

  async function confirm(subId: string) {
    const res = await fetch('/api/confirm-price', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submission_id: subId, station_id: stationId, browser_id: getBrowserId() }),
    });
    if (res.ok) {
      const newSet = new Set(confirmed).add(subId);
      setConfirmed(newSet);
      saveConfirmed(newSet);
      const r = awardConfirm();
      setGam(r.state);
      setFlash({ pts: r.earned, level: r.leveledUp?.name });
      load();
    } else {
      const d = await res.json();
      setMsg({ text: d.error ?? 'Błąd', ok: false });
    }
  }

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Flash — získané body / nová ranga */}
      {flash && (
        <div className="absolute top-2 right-2 z-10 animate-bounce">
          <div className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            +{flash.pts} pkt{flash.level ? ` · ${flash.level}!` : ''}
          </div>
        </div>
      )}

      {verified.length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Users size={13} /> Ceny od kierowców (potwierdzone)
          </p>
          <div className="flex flex-wrap gap-3">
            {verified.map(s => (
              <div key={s.id} className="bg-white dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-2 text-center">
                <div className="text-[10px] text-blue-500 uppercase tracking-wide">{FUEL_LABELS[s.fuel_type]}</div>
                <div className="text-xl font-black text-blue-700 dark:text-blue-300 leading-tight">
                  {s.price.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-[9px] text-blue-400">zł/l · {s.confirmations}× potwierdzone</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
        <span className="flex items-center gap-2">
          <Users size={15} className="text-green-600" />
          Zgłoś cenę i zdobądź punkty
          {subs.length > 0 && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded-full">{subs.length}</span>
          )}
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4">
          {/* Herní lišta — hodnost, body, postup, série */}
          {lvl && (
            <div className="mb-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700/60 dark:to-gray-700/30 rounded-xl border border-green-100 dark:border-gray-600 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-white">
                  <span className="text-lg">{lvl.current.icon}</span> {lvl.current.name}
                </span>
                <span className="flex items-center gap-2">
                  {gam!.streakDays >= 2 && (
                    <span className="flex items-center gap-0.5 text-xs font-bold text-orange-500" title="Seria dni z rzędu">
                      <Flame size={12} /> {gam!.streakDays}
                    </span>
                  )}
                  <span className="text-sm font-black text-green-700 dark:text-green-400">{gam!.points} pkt</span>
                </span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${Math.round(lvl.progress * 100)}%` }} />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                <span>{gam!.reports} zgłoszeń · {gam!.confirms} potwierdzeń</span>
                {lvl.next ? <span className="flex items-center gap-1"><Trophy size={10} /> {lvl.toNext} pkt do: {lvl.next.name}</span> : <span>Maks. ranga! 🏆</span>}
              </div>
            </div>
          )}

          <form onSubmit={submit} className="mb-5">
            <p className="text-xs text-gray-500 mb-3">
              Znasz aktualną cenę? Zgłoś ją w kilka sekund —{' '}
              <strong className="text-green-700 dark:text-green-400">+10 pkt</strong> i pomagasz innym kierowcom.
            </p>
            <div className="flex gap-2 flex-wrap mb-3">
              {FUEL_ORDER.map(f => (
                <button key={f} type="button" onClick={() => setFormFuel(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${formFuel === f ? 'bg-green-600 text-white border-green-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}>
                  {FUEL_LABELS[f]}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Cena zł/l</label>
                <input type="text" inputMode="decimal" placeholder="np. 6,39"
                  value={formPrice} onChange={e => setFormPrice(e.target.value)} required
                  className="w-full text-3xl font-black text-center border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:border-green-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <button type="submit" disabled={sending}
                className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors text-sm">
                <Send size={15} />
                {sending ? 'Wysyłam…' : 'Zgłoś +10'}
              </button>
            </div>
          </form>
          {msg && (
            <p className={`text-sm mb-4 px-3 py-2 rounded-lg ${msg.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{msg.text}</p>
          )}
          {subs.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Zgłoszone ceny (ostatnie 24h) — potwierdź za +5 pkt</p>
              {subs.sort((a, b) => b.confirmations - a.confirmations).map(s => {
                const isConfirmed = confirmed.has(s.id);
                const isVerified = s.confirmations >= VERIFY_THRESHOLD;
                return (
                  <div key={s.id} className={`flex items-center justify-between rounded-xl p-3 border ${isVerified ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}>
                    <div>
                      <span className="text-xs text-gray-400 mr-2">{FUEL_LABELS[s.fuel_type]}</span>
                      <span className={`text-xl font-black ${isVerified ? 'text-blue-700 dark:text-blue-300' : 'text-gray-800 dark:text-gray-100'}`}>
                        {s.price.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">zł/l</span>
                      {isVerified && <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-semibold">✓ Potwierdzone</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{s.confirmations}/{VERIFY_THRESHOLD}</span>
                      {!isConfirmed ? (
                        <button onClick={() => confirm(s.id)}
                          className="text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 hover:border-green-400 hover:text-green-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg font-semibold transition-colors">
                          Potwierdź +5
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-green-600 font-semibold"><CheckCircle size={13} /> Potwierdzono</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {subs.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-3">
              Brak zgłoszeń. <strong className="text-green-600">Bądź pierwszy i zgarnij +10 pkt!</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
