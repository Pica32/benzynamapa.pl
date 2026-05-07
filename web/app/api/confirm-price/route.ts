import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join('/tmp', 'user_prices_pl.json');

function readDb() {
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')); }
  catch { return { submissions: {} }; }
}

function writeDb(data: object) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data), 'utf-8');
}

export async function POST(req: NextRequest) {
  try {
    const { submission_id, station_id, browser_id } = await req.json();
    if (!submission_id || !station_id || !browser_id)
      return NextResponse.json({ error: 'Brakuje wymaganych pól' }, { status: 400 });

    const db = readDb();
    const stationSubs = db.submissions[station_id] ?? [];
    const sub = stationSubs.find((s: any) => s.id === submission_id);

    if (!sub) return NextResponse.json({ error: 'Zgłoszenie nie znalezione' }, { status: 404 });
    if (sub.browser_id === browser_id)
      return NextResponse.json({ error: 'Nie możesz potwierdzić własnej ceny' }, { status: 403 });
    if (sub.confirmed_by.includes(browser_id))
      return NextResponse.json({ error: 'Już potwierdziłeś tę cenę' }, { status: 409 });

    sub.confirmed_by.push(browser_id);
    sub.confirmations = sub.confirmed_by.length;
    writeDb(db);
    return NextResponse.json({ ok: true, confirmations: sub.confirmations });
  } catch {
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
