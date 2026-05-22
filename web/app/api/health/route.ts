import { getStats, getStations } from '@/lib/data';

export const dynamic = 'force-static';
export const revalidate = 3600;

/**
 * /api/health — status endpoint pro monitoring.
 *
 * Použití:
 * - Uptime monitoring (Healthchecks.io, UptimeRobot, BetterUptime)
 * - Alert pokud data starší než 24h (scraper down)
 * - Vercel deploy verification
 *
 * Response 200 = vše OK, 503 = stale data nebo chyba
 */
export function GET() {
  try {
    const stats = getStats();
    const stations = getStations();
    const now = Date.now();

    if (!stats || stations.length === 0) {
      return Response.json({
        status: 'error',
        message: 'No data available',
        timestamp: new Date().toISOString(),
      }, { status: 503 });
    }

    const lastUpdated = new Date(stats.last_updated);
    const ageMs = now - lastUpdated.getTime();
    const ageHours = Math.round(ageMs / (60 * 60 * 1000) * 10) / 10;

    // Data starší než 24h = degraded (scraper pravděpodobně down)
    const isStale = ageMs > 24 * 60 * 60 * 1000;

    return Response.json({
      status: isStale ? 'degraded' : 'healthy',
      timestamp: new Date().toISOString(),
      data: {
        last_updated: stats.last_updated,
        age_hours: ageHours,
        is_stale: isStale,
        total_stations: stations.length,
        stations_with_real_price: stats.stations_updated_today,
        averages: stats.averages,
      },
      build: {
        commit_sha: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ?? 'unknown',
        environment: process.env.VERCEL_ENV ?? 'unknown',
      },
      services: {
        cenapaliw: 'primary scraper source',
        epetrol: 'national + regional averages',
        openstreetmap: 'station database',
      },
    }, {
      status: isStale ? 503 : 200,
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return Response.json({
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
