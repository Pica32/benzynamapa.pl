/**
 * gamification — herní vrstva pro hlášení cen (client-side, localStorage).
 *
 * Cíl: maximálně motivovat řidiče hlásit a potvrzovat ceny → víc komunitních dat.
 * Body, hodnosti, denní série, DENNÍ BONUS, sběratelské ODZNAKY (achievementy),
 * bonusy za odemčení. Bez backendu — funguje okamžitě.
 */

export interface GamState {
  points: number;
  reports: number;
  confirms: number;
  streakDays: number;
  lastDay: string;        // YYYY-MM-DD posledního příspěvku
  cities: string[];       // odlišná města, kde uživatel hlásil (pro odznak)
  badges: string[];       // odemčené odznaky (id)
  discoveries: number;    // počet stanic BEZ reálné ceny, které uživatel "objevil" (bounty)
}

const KEY = 'benzynamapa_gam';

export const POINTS_REPORT = 10;
export const POINTS_CONFIRM = 5;
export const POINTS_STREAK_BONUS = 5;    // bonus za udržení denní série
export const POINTS_DAILY_BONUS = 10;    // bonus za první příspěvek dne (vrací lidi zpět)
export const POINTS_BADGE = 25;          // bonus za odemčení odznaku
export const POINTS_GAP_BOUNTY = 20;     // BONUS za hlášení na stanici BEZ reálné ceny
                                         // → cíleně sbírá NOVÁ data tam, kde chybí

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

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
  check: (s: GamState) => boolean;
}

/** Sběratelské odznaky — každý odemčený dává +POINTS_BADGE bonus. */
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_report', name: 'Pierwsza cena', desc: 'Zgłoś swoją pierwszą cenę', icon: '🎯', check: s => s.reports >= 1 },
  { id: 'reports_10', name: 'Aktywny kierowca', desc: 'Zgłoś 10 cen', icon: '📊', check: s => s.reports >= 10 },
  { id: 'reports_50', name: 'Łowca cen', desc: 'Zgłoś 50 cen', icon: '🏅', check: s => s.reports >= 50 },
  { id: 'confirms_10', name: 'Pomocna dłoń', desc: 'Potwierdź 10 cen', icon: '🤝', check: s => s.confirms >= 10 },
  { id: 'streak_3', name: 'Na fali', desc: 'Seria 3 dni z rzędu', icon: '⚡', check: s => s.streakDays >= 3 },
  { id: 'streak_7', name: 'Tydzień z rzędu', desc: 'Seria 7 dni z rzędu', icon: '🔥', check: s => s.streakDays >= 7 },
  { id: 'cities_3', name: 'Lokalny ekspert', desc: 'Ceny w 3 miastach', icon: '📍', check: s => s.cities.length >= 3 },
  { id: 'cities_10', name: 'Podróżnik', desc: 'Ceny w 10 miastach', icon: '🗺️', check: s => s.cities.length >= 10 },
  { id: 'discover_5', name: 'Odkrywca cen', desc: 'Dodaj cenę na 5 stacjach bez danych', icon: '🔍', check: s => s.discoveries >= 5 },
  { id: 'points_500', name: 'Ekspert paliwowy', desc: 'Zdobądź 500 punktów', icon: '⭐', check: s => s.points >= 500 },
  { id: 'points_1500', name: 'Legenda', desc: 'Zdobądź 1500 punktów', icon: '👑', check: s => s.points >= 1500 },
];

const EMPTY: GamState = { points: 0, reports: 0, confirms: 0, streakDays: 0, lastDay: '', cities: [], badges: [], discoveries: 0 };

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
    // Notifikuj ostatní komponenty na stránce (badge v hlavičce ap.)
    window.dispatchEvent(new Event('gam-update'));
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

/** Aktualizuje denní sérii. Vrací {streakBonus, dailyBonus}. */
function bumpStreak(s: GamState): { streakBonus: number; dailyBonus: number } {
  const today = todayStr();
  if (s.lastDay === today) return { streakBonus: 0, dailyBonus: 0 }; // už dnes přispěl
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  s.streakDays = s.lastDay === yesterday ? s.streakDays + 1 : 1;
  s.lastDay = today;
  return { streakBonus: POINTS_STREAK_BONUS, dailyBonus: POINTS_DAILY_BONUS };
}

export interface GamResult {
  state: GamState;
  earned: number;
  base: number;
  dailyBonus: number;
  streakBonus: number;
  gapBonus: number;              // bonus za hlášení na stanici bez reálné ceny
  leveledUp: Level | null;       // pokud akce posunula na novou hodnost
  newBadges: Achievement[];      // nově odemčené odznaky
}

function applyAction(base: number, kind: 'report' | 'confirm', city?: string, gapBounty = false): GamResult {
  const s = loadGam();
  const beforeLevel = levelInfo(s.points).current;

  const { streakBonus, dailyBonus } = bumpStreak(s);
  const gapBonus = (kind === 'report' && gapBounty) ? POINTS_GAP_BOUNTY : 0;
  let earned = base + streakBonus + dailyBonus + gapBonus;
  s.points += earned;
  if (kind === 'report') s.reports += 1;
  else s.confirms += 1;
  if (gapBonus) s.discoveries += 1;

  if (city) {
    const c = city.trim();
    if (c && !s.cities.includes(c)) s.cities.push(c);
  }

  // Odemkni nové odznaky (kontrola po přičtení bodů/statů)
  const newBadges: Achievement[] = [];
  for (const a of ACHIEVEMENTS) {
    if (!s.badges.includes(a.id) && a.check(s)) {
      s.badges.push(a.id);
      newBadges.push(a);
      s.points += POINTS_BADGE;
      earned += POINTS_BADGE;
    }
  }

  save(s);
  const afterLevel = levelInfo(s.points).current;
  const leveledUp = afterLevel.min > beforeLevel.min ? afterLevel : null;
  return { state: s, earned, base, dailyBonus, streakBonus, gapBonus, leveledUp, newBadges };
}

/** @param gapBounty true = stanice nemá reálnou cenu → bonus (cíleně sbírá nová data). */
export function awardReport(city?: string, gapBounty = false): GamResult {
  return applyAction(POINTS_REPORT, 'report', city, gapBounty);
}

export function awardConfirm(): GamResult {
  return applyAction(POINTS_CONFIRM, 'confirm');
}

/** Už dnes přispěl? (pro zobrazení "denní bonus dostupný"). */
export function dailyBonusAvailable(s: GamState): boolean {
  return s.lastDay !== todayStr();
}

/** Seznam odznaků s příznakem odemčení (pro profil). */
export function badgeStatus(s: GamState): { a: Achievement; unlocked: boolean }[] {
  return ACHIEVEMENTS.map(a => ({ a, unlocked: s.badges.includes(a.id) }));
}
