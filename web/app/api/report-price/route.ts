import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const DB_PATH = path.join('/tmp', 'user_prices_pl.json');

function readDb() {
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')); }
  catch { return { submissions: {} }; }
}

function writeDb(data: object) {
  try { fs.writeFileSync(DB_PATH, JSON.stringify(data), 'utf-8'); } catch {}
}

export async function POST(req: NextRequest) {
  try {
    const { station_id, fuel_type, price, browser_id } = await req.json();
    if (!station_id || !fuel_type || !price || !browser_id)
      return NextResponse.json({ error: 'Brakuje wymaganych pól' }, { status: 400 });

    const p = Number(price);
    if (isNaN(p) || p < 2 || p > 14)
      return NextResponse.json({ error: 'Nieprawidłowa cena' }, { status: 400 });

    const rounded = Math.round(p / 0.01) * 0.01;
    const db = readDb();
    if (!db.submissions[station_id]) db.submissions[station_id] = [];

    const stationSubs = db.submissions[station_id];
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;

    const alreadySubmitted = stationSubs.some(
      (s: any) => s.browser_id === browser_id && new Date(s.submitted_at).getTime() > cutoff
    );
    if (alreadySubmitted)
      return NextResponse.json({ error: 'Podałeś już cenę dla tej stacji w ciągu ostatnich 24h' }, { status: 429 });

    const entry = {
      id: randomUUID(),
      fuel_type,
      price: Math.round(rounded * 100) / 100,
      submitted_at: new Date().toISOString(),
      browser_id,
      confirmations: 0,
      confirmed_by: [] as string[],
    };

    stationSubs.push(entry);
    if (stationSubs.length > 20) stationSubs.splice(0, stationSubs.length - 20);
    db.submissions[station_id] = stationSubs;
    writeDb(db);

    const { browser_id: _bid, confirmed_by: _cb, ...publicEntry } = entry;
    return NextResponse.json({ ok: true, entry: publicEntry });
  } catch {
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
