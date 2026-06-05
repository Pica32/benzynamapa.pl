/**
 * communityDb — perzistentní úložiště komunitních hlášení cen.
 *
 * PROČ: dříve se hlásilo do /tmp/user_prices_pl.json, což je na Vercelu efemérní
 * (mizí při cold startu) a scraper (GitHub Actions, jiný stroj) to nikdy nepřečte.
 * → komunitní data se ztrácela. Tady jsou uložená v SDÍLENÉ DB (Supabase Postgres),
 * ke které mají přístup jak API routes (zápis), tak scraper (čtení → merge do dat).
 *
 * Backend:
 *  - Pokud jsou nastavené env SUPABASE_URL + SUPABASE_SERVICE_KEY → Supabase REST.
 *  - Jinak fallback na /tmp (lokální dev / než se DB provisionuje) — bez pádu.
 *
 * Schéma (Supabase SQL, viz SUPABASE_SETUP.md):
 *   table price_submissions (
 *     id uuid pk default gen_random_uuid(),
 *     station_id text, fuel_type text, price numeric(5,2),
 *     browser_id text, submitted_at timestamptz default now(),
 *     confirmed_by text[] default '{}', confirmations int default 0 )
 */
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { VERIFY_THRESHOLD } from './priceModeration';

export interface Submission {
  id: string;
  station_id: string;
  fuel_type: string;
  price: number;
  submitted_at: string;
  browser_id: string;
  confirmed_by: string[];
  confirmations: number;
}

const SUPA_URL = process.env.SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_KEY;
export const usingSupabase = Boolean(SUPA_URL && SUPA_KEY);

const TABLE = 'price_submissions';
const DAY_MS = 24 * 60 * 60 * 1000;

// ───────────────────────── Supabase REST ─────────────────────────
function headers(extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: SUPA_KEY as string,
    Authorization: `Bearer ${SUPA_KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

// ───────────────────────── /tmp fallback ─────────────────────────
const TMP_PATH = path.join('/tmp', 'user_prices_pl.json');
function tmpRead(): Record<string, Submission[]> {
  try {
    return JSON.parse(fs.readFileSync(TMP_PATH, 'utf-8')).submissions ?? {};
  } catch {
    return {};
  }
}
function tmpWrite(subs: Record<string, Submission[]>): void {
  try {
    fs.writeFileSync(TMP_PATH, JSON.stringify({ submissions: subs }), 'utf-8');
  } catch {
    /* read-only fs — ignore */
  }
}

// ───────────────────────── public API ─────────────────────────

/** Recentní (posledních 24h) hlášení pro stanici, seřazená vzestupně dle času. */
export async function getRecentSubmissions(stationId: string): Promise<Submission[]> {
  const cutoffMs = Date.now() - DAY_MS;
  if (usingSupabase) {
    const cutoff = new Date(cutoffMs).toISOString();
    const url =
      `${SUPA_URL}/rest/v1/${TABLE}` +
      `?station_id=eq.${encodeURIComponent(stationId)}` +
      `&submitted_at=gt.${encodeURIComponent(cutoff)}` +
      `&order=submitted_at.asc`;
    const r = await fetch(url, { headers: headers(), cache: 'no-store' });
    if (!r.ok) return [];
    return (await r.json()) as Submission[];
  }
  const all = tmpRead()[stationId] ?? [];
  return all.filter((s) => new Date(s.submitted_at).getTime() > cutoffMs);
}

/** Vytvoří nové hlášení. Vrací uloženou položku.
 *  autoVerified=true → cena prošla automatickou kontrolou (souhlasí s referencí/
 *  konsenzem), seedneme confirmations na práh, aby se rovnou zobrazila jako potwierdzone. */
export async function addSubmission(input: {
  station_id: string;
  fuel_type: string;
  price: number;
  browser_id: string;
  autoVerified?: boolean;
}): Promise<Submission> {
  const entry: Submission = {
    id: randomUUID(),
    station_id: input.station_id,
    fuel_type: input.fuel_type,
    price: input.price,
    submitted_at: new Date().toISOString(),
    browser_id: input.browser_id,
    confirmed_by: input.autoVerified ? ['__auto__'] : [],
    confirmations: input.autoVerified ? VERIFY_THRESHOLD : 0,
  };

  if (usingSupabase) {
    await fetch(`${SUPA_URL}/rest/v1/${TABLE}`, {
      method: 'POST',
      headers: headers({ Prefer: 'return=minimal' }),
      body: JSON.stringify(entry),
    });
    return entry;
  }

  const all = tmpRead();
  const list = (all[entry.station_id] ??= []);
  list.push(entry);
  if (list.length > 20) list.splice(0, list.length - 20); // cap
  tmpWrite(all);
  return entry;
}

/** Najde hlášení dle id (kvůli potvrzení). */
export async function getSubmission(id: string): Promise<Submission | null> {
  if (usingSupabase) {
    const url = `${SUPA_URL}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}&limit=1`;
    const r = await fetch(url, { headers: headers(), cache: 'no-store' });
    if (!r.ok) return null;
    const rows = (await r.json()) as Submission[];
    return rows[0] ?? null;
  }
  const all = tmpRead();
  for (const list of Object.values(all)) {
    const found = list.find((s) => s.id === id);
    if (found) return found;
  }
  return null;
}

/**
 * Potvrdí hlášení jiným prohlížečem. Vrací nový počet potvrzení,
 * nebo objekt s chybovým kódem (already / own / notfound).
 */
export async function confirmSubmission(
  id: string,
  stationId: string,
  browserId: string,
): Promise<{ ok: true; confirmations: number } | { ok: false; reason: 'notfound' | 'own' | 'already' }> {
  const sub = await getSubmission(id);
  if (!sub) return { ok: false, reason: 'notfound' };
  if (sub.browser_id === browserId) return { ok: false, reason: 'own' };
  if (sub.confirmed_by.includes(browserId)) return { ok: false, reason: 'already' };

  const confirmed_by = [...sub.confirmed_by, browserId];
  const confirmations = confirmed_by.length;

  if (usingSupabase) {
    await fetch(`${SUPA_URL}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: headers({ Prefer: 'return=minimal' }),
      body: JSON.stringify({ confirmed_by, confirmations }),
    });
    return { ok: true, confirmations };
  }

  const all = tmpRead();
  const list = all[stationId] ?? [];
  const target = list.find((s) => s.id === id);
  if (target) {
    target.confirmed_by = confirmed_by;
    target.confirmations = confirmations;
    tmpWrite(all);
  }
  return { ok: true, confirmations };
}
