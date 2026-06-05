/**
 * priceModeration — AUTOMATICKÁ kontrola komunitních hlášení cen.
 *
 * Cíl: "blbosti musí vyškrtávat" — nesmyslné/podvodné ceny se zahodí samy,
 * rozumné se ověří automaticky bez čekání na ruční potvrzení.
 *
 * Tři vrstvy:
 *  1. SANE bounds per palivo — fyzicky nemožné ceny ven.
 *  2. Odchylka od reference (aktuálně zobrazená cena stanice) — překlepy/podvody ven.
 *  3. Konsenzus mezi recentními hlášeními (medián) — outliery ven.
 * Pokud cena sedí s referencí/konsenzem → auto-ověřeno (zobrazí se rovnou jako potwierdzone).
 *
 * Pure modul (bez server-deps) — používá ho API route i klient (okamžitá zpětná vazba).
 */
import { FuelType } from '@/types';

/** Práh potvrzení (ruční i auto) pro "potwierdzone". Nízký = živější komunita. */
export const VERIFY_THRESHOLD = 2;

/** Tvrdé reálné meze ceny per palivo (PLN/l). Mimo = nesmysl. */
export const SANE: Record<FuelType, [number, number]> = {
  pb95: [4.5, 9.5],
  pb98: [5.0, 11.0],
  on: [4.5, 9.5],
  lpg: [1.8, 5.5],
};

const CONSENSUS_TOLERANCE = 0.18;    // max odchylka od mediánu — outlier vůči konsenzu
const AUTO_VERIFY_TOLERANCE = 0.08;  // shoda s referencí/konsenzem → auto-ověřeno
const STRONG_CONSENSUS = 3;          // od kolika hlášení je konsenzus "silný" (tvrdé zamítnutí outlieru)

export function median(nums: number[]): number | null {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}

export interface ModerationResult {
  ok: boolean;
  reason?: string;        // PL hláška proč zamítnuto
  autoVerified?: boolean; // true → rovnou potwierdzone (souhlasí s referencí/konsenzem)
}

/**
 * Automaticky posoudí hlášení.
 * @param price       nahlášená cena (PLN/l)
 * @param fuel        palivo
 * @param reference   aktuálně zobrazená cena stanice pro toto palivo (může chybět)
 * @param recentPrices ceny recentních hlášení stejného paliva (pro konsenzus)
 */
export function moderate(
  price: number,
  fuel: FuelType,
  reference?: number | null,
  recentPrices: number[] = [],
): ModerationResult {
  // 1) Tvrdá mez — fyzicky nemožné ceny ven (vždy).
  const [lo, hi] = SANE[fuel];
  if (!(price >= lo && price <= hi)) {
    return { ok: false, reason: `Cena ${price.toFixed(2).replace('.', ',')} zł wygląda nierealnie dla ${FUEL_PL[fuel]}.` };
  }

  // 2) Outlier vůči SILNÉMU konsenzu (≥3 hlášení) ven — chrání před překlepem/trollem.
  //    Slabý konsenzus NEzamítáme (komunita se může opravit → žádný deadlock).
  const med = median(recentPrices);
  if (med && recentPrices.length >= STRONG_CONSENSUS) {
    if (Math.abs(price - med) / med > CONSENSUS_TOLERANCE) {
      return { ok: false, reason: 'Inni kierowcy podają teraz wyraźnie inną cenę — sprawdź przecinek i spróbuj ponownie.' };
    }
  }

  // 3) Reference (zobrazená cena) se NEpoužívá k zamítnutí (může být zastaralá),
  //    jen k AUTO-OVĚŘENÍ při shodě → 1-tap potvrzení reálné ceny.
  const agreesRef = reference ? Math.abs(price - reference) / reference <= AUTO_VERIFY_TOLERANCE : false;
  const agreesMed = med && recentPrices.length >= 1
    ? Math.abs(price - med) / med <= AUTO_VERIFY_TOLERANCE
    : false;
  return { ok: true, autoVerified: agreesRef || agreesMed };
}

/** Konsenzuální cena = medián hlášení v toleranci (outliery se ignorují). */
export function consensusPrice(prices: number[]): number | null {
  const med = median(prices);
  if (med == null) return null;
  const inTol = prices.filter(p => Math.abs(p - med) / med <= CONSENSUS_TOLERANCE);
  return median(inTol) ?? med;
}

/** Je cena outlier vůči ostatním? (pro skrytí v zobrazení) */
export function isOutlier(price: number, allPrices: number[]): boolean {
  const med = median(allPrices);
  if (med == null || allPrices.length < 2) return false;
  return Math.abs(price - med) / med > CONSENSUS_TOLERANCE;
}

const FUEL_PL: Record<FuelType, string> = {
  pb95: 'benzyny 95',
  pb98: 'benzyny 98',
  on: 'oleju napędowego',
  lpg: 'LPG',
};
