import { NextRequest, NextResponse } from 'next/server';
import { confirmSubmission } from '@/lib/communityDb';

export async function POST(req: NextRequest) {
  try {
    const { submission_id, station_id, browser_id } = await req.json();
    if (!submission_id || !station_id || !browser_id)
      return NextResponse.json({ error: 'Brakuje wymaganych pól' }, { status: 400 });

    const res = await confirmSubmission(submission_id, station_id, browser_id);
    if (!res.ok) {
      const map = {
        notfound: { error: 'Zgłoszenie nie znalezione', status: 404 },
        own: { error: 'Nie możesz potwierdzić własnej ceny', status: 403 },
        already: { error: 'Już potwierdziłeś tę cenę', status: 409 },
      } as const;
      const m = map[res.reason];
      return NextResponse.json({ error: m.error }, { status: m.status });
    }
    return NextResponse.json({ ok: true, confirmations: res.confirmations });
  } catch {
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
