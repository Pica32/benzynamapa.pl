import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join('/tmp', 'user_prices_pl.json');

function readDb() {
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')); }
  catch { return { submissions: {} }; }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ stationId: string }> }
) {
  const { stationId } = await params;
  const db = readDb();
  const subs = db.submissions[stationId] ?? [];
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;

  const public_subs = subs
    .filter((s: any) => new Date(s.submitted_at).getTime() > cutoff)
    .map(({ browser_id: _bid, confirmed_by: _cb, ...rest }: any) => rest);

  return NextResponse.json(public_subs);
}
