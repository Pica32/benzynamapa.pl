import { NextRequest, NextResponse } from 'next/server';
import { getRecentSubmissions } from '@/lib/communityDb';
import { isOutlier } from '@/lib/priceModeration';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ stationId: string }> },
) {
  const { stationId } = await params;
  const subs = await getRecentSubmissions(stationId);

  // Auto-čištění: skryj outliery vůči konsenzu daného paliva ("blbosti vyškrtat")
  const byFuel = new Map<string, number[]>();
  for (const s of subs) {
    const arr = byFuel.get(s.fuel_type) ?? [];
    arr.push(s.price);
    byFuel.set(s.fuel_type, arr);
  }

  const publicSubs = subs
    .filter((s) => !isOutlier(s.price, byFuel.get(s.fuel_type) ?? []))
    .map(({ browser_id: _bid, confirmed_by: _cb, ...rest }) => rest);

  return NextResponse.json(publicSubs);
}
