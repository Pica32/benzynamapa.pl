/**
 * gamification — lehká herní vrstva pro hlášení cen (client-side, localStorage).
 *
 * Cíl: motivovat řidiče hlásit a potvrzovat ceny → víc komunitních dat.
 * Body, hodnosti (řidičská témata), série dní, postup do dalšího levelu.
 * Bez backendu — funguje okamžitě. (Server-side žebříček lze přidat později přes Supabase.)
 */

export interface GamState {
  points: number;
  reports: number;
  confirms: number;
  streakDays: number;
  lastDay: string; // YYYY-MM-DD posledního příspěvku
}

const KEY = 'benzynamapa_gam';

export const POINTS_REPORT = 10;
export const POINTS_CONFIRM = 5;
export const POINTS_STREAK_BONUS = 5; // bonus za udržení denní série

export interface Level {
  min: number;
  name: string;
  icon: string;
}

/** Hodnosti — laděné tak, aby první level-up přišel rychle (návyk). */
export const LEVELS: Level[] = [
  { min: 0, name: 'Nowicjusz', icon: '🚗' },
  { min: 30, name: 'Kierowca', icon: '🚙' },
  { min: 100, name: 'Strażnik cen', icon: '🛡️' },
  { min: 250, name: 'Ekspert paliwowy', icon: '⛽' },
  { min: 600, name: 'Mistrz kierownicy', icon: '🏁' },
  { min: 1500, name: 'Legenda tras', icon: '🏆' },
];

const EMPTY: GamState = { points: 0, reports: 0, confirms: 0, streakDays: 0, lastDay: '' };

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function loadGam(): GamState {
  if (typeof localStorage === 'undefined') return { ...EMPTY };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY };
  }
}

function save(s: GamState): GamState {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* private mode — ignore */
  }
  return s;
}

/** Aktuální hodnost + následující + postup (0..1) k dalšímu levelu. */
export function levelInfo(points: number): { current: Level; next: Level | null; progress: number; toNext: number } {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i].min) idx = i;
  }
  const current = LEVELS[idx];
  const next = LEVELS[idx + 1] ?? null;
  if (!next) return { current, next: null, progress: 1, toNext: 0 };
  const span = next.min - current.min;
  const progress = Math.min(1, (points - current.min) / span);
  return { current, next, progress, toNext: Math.max(0, next.min - points) };
}

/** Aktualizuje denní sérii. Vrací bonus bodů (0 nebo POINTS_STREAK_BONUS). */
function bumpStreak(s: GamState): number {
  const today = todayStr();
  if (s.lastDay === today) return 0; // už dnes přispěl, série se nemění
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  s.streakDays = s.lastDay === yesterday ? s.streakDays + 1 : 1;
  s.lastDay = today;
  return POINTS_STREAK_BONUS;
}

export interface GamResult {
  state: GamState;
  earned: number;
  leveledUp: Level | null; // pokud akce posunula na novou hodnost
}

function applyAction(base: number, kind: 'report' | 'confirm'): GamResult {
  const s = loadGam();
  const beforeLevel = levelInfo(s.points).current;
  const streakBonus = bumpStreak(s);
  const earned = base + streakBonus;
  s.points += earned;
  if (kind === 'report') s.reports += 1;
  else s.confirms += 1;
  save(s);
  const afterLevel = levelInfo(s.points).current;
  const leveledUp = afterLevel.min > beforeLevel.min ? afterLevel : null;
  return { state: s, earned, leveledUp };
}

export function awardReport(): GamResult {
  return applyAction(POINTS_REPORT, 'report');
}

export function awardConfirm(): GamResult {
  return applyAction(POINTS_CONFIRM, 'confirm');
}
