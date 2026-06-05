import { NextRequest, NextResponse } from 'next/server';
import { getRecentSubmissions, addSubmission } from '@/lib/communityDb';
import { moderate } from '@/lib/priceModeration';
import { FuelType } from '@/types';

const FUELS: FuelType[] = ['pb95', 'pb98', 'on', 'lpg'];

export async function POST(req: NextRequest) {
  try {
    const { station_id, fuel_type, price, browser_id, reference } = await req.json();
    if (!station_id || !fuel_type || !price || !browser_id)
      return NextResponse.json({ error: 'Brakuje wymaganych pól' }, { status: 400 });
    if (!FUELS.includes(fuel_type))
      return NextResponse.json({ error: 'Nieznany rodzaj paliwa' }, { status: 400 });

    const p = Number(price);
    if (isNaN(p) || p < 2 || p > 14)
      return NextResponse.json({ error: 'Nieprawidłowa cena' }, { status: 400 });
    const rounded = Math.round(p / 0.01) * 0.01;

    // Anti-spam: jeden hlas na stanici a prohlížeč za 24h
    const recent = await getRecentSubmissions(station_id);
    if (recent.some((s) => s.browser_id === browser_id))
      return NextResponse.json(
        { error: 'Podałeś już cenę dla tej stacji w ciągu ostatnich 24h' },
        { status: 429 },
      );

    // AUTOMATICKÁ KONTROLA — nesmysly ven, shody auto-ověřit
    const ref = typeof reference === 'number' && reference > 0 ? reference : null;
    const recentSameFuel = recent
      .filter((s) => s.fuel_type === fuel_type)
      .map((s) => s.price);
    const verdict = moderate(rounded, fuel_type as FuelType, ref, recentSameFuel);
    if (!verdict.ok)
      return NextResponse.json({ error: verdict.reason ?? 'Cena odrzucona' }, { status: 422 });

    const entry = await addSubmission({
      station_id,
      fuel_type,
      price: Math.round(rounded * 100) / 100,
      browser_id,
      autoVerified: verdict.autoVerified,
    });

    const { browser_id: _bid, confirmed_by: _cb, ...publicEntry } = entry;
    return NextResponse.json({ ok: true, entry: publicEntry, autoVerified: !!verdict.autoVerified });
  } catch {
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
