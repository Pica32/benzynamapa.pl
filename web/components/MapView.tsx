'use client';

import { useEffect, useRef, useCallback } from 'react';
import { StationWithPrice, FuelType, FUEL_LABELS } from '@/types';

function getPriceColor(price: number, allPrices: number[]): string {
  if (!allPrices.length) return '#6b7280';
  const sorted = [...allPrices].sort((a, b) => a - b);
  const p20 = sorted[Math.floor(sorted.length * 0.2)];
  const p80 = sorted[Math.floor(sorted.length * 0.8)];
  if (price <= p20) return '#16a34a';
  if (price >= p80) return '#dc2626';
  return '#d97706';
}

function isPriceStale(reportedAt: string): boolean {
  return Date.now() - new Date(reportedAt).getTime() > 2 * 24 * 60 * 60 * 1000;
}

function formatDatePL(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function buildGeoJSON(stations: StationWithPrice[], fuelType: FuelType) {
  const prices = stations
    .map(s => s.price?.[fuelType])
    .filter((p): p is number => p != null);

  return {
    type: 'FeatureCollection' as const,
    features: stations
      .filter(s => s.price?.[fuelType] != null)
      .map(s => {
        const price = s.price![fuelType]!;
        const isReal = s.price?.source === 'cenapaliw.pl';
        const stale = isReal && s.price?.reported_at ? isPriceStale(s.price.reported_at) : false;
        return {
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: [s.lng, s.lat] as [number, number] },
          properties: {
            id: s.id,
            name: s.name,
            address: s.address,
            opening_hours: s.opening_hours || '',
            price,
            price_pb95: s.price?.pb95 ?? null,
            price_on: s.price?.on ?? null,
            price_lpg: s.price?.lpg ?? null,
            color: getPriceColor(price, prices),
            isReal,
            stale,
            reportedAt: s.price?.reported_at ?? '',
            priceLabel: (isReal ? '' : '~') + price.toFixed(2).replace('.', ','),
            lat: s.lat,
            lng: s.lng,
          },
        };
      }),
  };
}

function buildPopupHTML(p: Record<string, any>): string {
  const priceItems: [string, number | null][] = [
    ['Benzyna 95', p.price_pb95],
    ['Diesel', p.price_on],
    ['LPG', p.price_lpg],
  ];
  const priceRows = priceItems
    .filter(([, v]) => v != null)
    .map(([lbl, v]) =>
      p.isReal
        ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:4px 10px;text-align:center"><div style="font-size:9px;color:#166534;text-transform:uppercase;letter-spacing:.05em">${lbl}</div><div style="font-weight:800;color:#15803d;font-size:14px">${Number(v).toFixed(2).replace('.', ',')} zł</div></div>`
        : `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:4px 10px;text-align:center"><div style="font-size:9px;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em">${lbl}</div><div style="font-weight:600;color:#9ca3af;font-size:13px">~${Number(v).toFixed(2).replace('.', ',')} zł</div></div>`
    ).join('');

  const reportedLabel = p.isReal && p.reportedAt ? `Zaktualizowano: ${formatDatePL(p.reportedAt)}` : '';
  const gmaps = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
  const waze = `https://waze.com/ul?ll=${p.lat},${p.lng}&navigate=yes`;

  return `
    <div style="font-family:system-ui,sans-serif;min-width:210px;max-width:260px">
      <div style="font-weight:700;font-size:14px;margin-bottom:2px;line-height:1.3">${p.name}</div>
      <div style="color:#6b7280;font-size:11px;margin-bottom:4px">${p.address}</div>
      ${p.opening_hours ? `<div style="font-size:11px;color:#6b7280;margin-bottom:4px">⏰ ${p.opening_hours}</div>` : ''}
      ${p.stale
        ? `<div style="font-size:9px;color:#dc2626;font-weight:700;margin-bottom:4px;background:#fef2f2;border:1px solid #fecaca;border-radius:4px;padding:3px 6px">⚠ Cena dawno nie aktualizowana<br><span style="font-weight:400">${reportedLabel}</span></div>`
        : p.isReal
          ? `<div style="font-size:9px;color:#16a34a;font-weight:700;margin-bottom:4px">✓ Zweryfikowana cena · ${reportedLabel}</div>`
          : '<div style="font-size:9px;color:#f59e0b;font-weight:600;margin-bottom:4px">~ Szacowana cena — podaj aktualną cenę na stronie stacji</div>'
      }
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">${priceRows}</div>
      <div style="display:flex;gap:6px">
        <a href="${gmaps}" target="_blank" rel="noopener" style="flex:1;background:#16a34a;color:#fff;text-align:center;padding:7px 4px;border-radius:7px;font-size:11px;font-weight:700;text-decoration:none">🗺 Google Maps</a>
        <a href="${waze}" target="_blank" rel="noopener" style="flex:1;background:#33ccff;color:#000;text-align:center;padding:7px 4px;border-radius:7px;font-size:11px;font-weight:700;text-decoration:none">📡 Waze</a>
      </div>
      <a href="/stacja/${p.id}/" style="display:block;margin-top:6px;background:${p.stale ? '#fef2f2' : '#f3f4f6'};color:${p.stale ? '#dc2626' : '#374151'};text-align:center;padding:7px;border-radius:7px;font-size:11px;font-weight:600;text-decoration:none;border:1px solid ${p.stale ? '#fecaca' : '#e5e7eb'}">
        ${p.stale ? '⚠ Podaj aktualną cenę →' : p.isReal ? 'Szczegóły stacji →' : 'Podaj cenę →'}
      </a>
    </div>`;
}

interface MapViewProps {
  stations: StationWithPrice[];
  fuelType: FuelType;
  userLat?: number;
  userLng?: number;
  panTo?: { lat: number; lng: number; zoom?: number };
}

export default function MapView({ stations, fuelType, userLat, userLng, panTo }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const MapLibRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const userMarkerRef = useRef<any>(null);
  const stationsRef = useRef(stations);
  const fuelTypeRef = useRef(fuelType);

  useEffect(() => {
    stationsRef.current = stations;
    fuelTypeRef.current = fuelType;
  });

  const syncMarkers = useCallback(() => {
    const map = mapRef.current;
    const MapLib = MapLibRef.current;
    if (!map || !MapLib) return;

    try {
      const features = map.queryRenderedFeatures(undefined, {
        layers: ['clusters-query', 'points-query'],
      });

      const seenIds = new Set<string>();

      for (const f of features) {
        const props = f.properties as Record<string, any>;
        const isCluster = !!props.cluster;
        const id: string = isCluster ? `cluster-${props.cluster_id}` : String(props.id);
        if (!id || seenIds.has(id)) continue;
        seenIds.add(id);

        if (!markersRef.current.has(id)) {
          const coords = (f.geometry as any).coordinates as [number, number];
          let el: HTMLElement;

          if (isCluster) {
            const count = props.point_count as number;
            const size = count < 10 ? 36 : count < 50 ? 44 : 52;
            el = document.createElement('div');
            el.style.cssText = `width:${size}px;height:${size}px;background:#16a34a;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:${size < 44 ? 12 : 14}px;border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.3);cursor:pointer`;
            el.textContent = String(count);
            el.addEventListener('click', (e) => {
              e.stopPropagation();
              (map.getSource('stations') as any).getClusterExpansionZoom(
                props.cluster_id,
                (err: any, zoom: any) => { if (!err) map.easeTo({ center: coords, zoom }); }
              );
            });
          } else {
            el = document.createElement('div');
            const pill = document.createElement('div');
            pill.style.cssText = `background:${props.color};color:#fff;border-radius:20px;padding:3px 9px;font-size:11px;font-weight:700;border:2px solid rgba(255,255,255,0.5);box-shadow:0 2px 6px rgba(0,0,0,.28);white-space:nowrap;cursor:pointer;line-height:1.4;opacity:${props.isReal ? 1 : 0.75}`;
            pill.textContent = props.priceLabel;
            el.appendChild(pill);
          }

          const marker = new MapLib.Marker({ element: el, anchor: 'center' })
            .setLngLat(coords);

          if (!isCluster) {
            marker.setPopup(
              new MapLib.Popup({ maxWidth: '270px', offset: 16 })
                .setHTML(buildPopupHTML(props))
            );
          }

          marker.addTo(map);
          markersRef.current.set(id, marker);
        }
      }

      for (const [id, marker] of markersRef.current) {
        if (!seenIds.has(id)) {
          marker.remove();
          markersRef.current.delete(id);
        }
      }
    } catch {
      // Map not ready yet
    }
  }, []);

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    let cancelled = false;

    (async () => {
      const maplibregl = (await import('maplibre-gl')).default;
      await import('maplibre-gl/dist/maplibre-gl.css');
      if (cancelled || !containerRef.current) return;

      MapLibRef.current = maplibregl;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
              maxzoom: 19,
            },
            stations: {
              type: 'geojson',
              data: { type: 'FeatureCollection', features: [] } as any,
              cluster: true,
              clusterMaxZoom: 12,
              clusterRadius: 55,
            },
          },
          layers: [
            { id: 'osm', type: 'raster', source: 'osm' },
            {
              id: 'clusters-query',
              type: 'circle',
              source: 'stations',
              filter: ['has', 'point_count'],
              paint: { 'circle-radius': 0, 'circle-opacity': 0 },
            },
            {
              id: 'points-query',
              type: 'circle',
              source: 'stations',
              filter: ['!', ['has', 'point_count']],
              paint: { 'circle-radius': 0, 'circle-opacity': 0 },
            },
          ],
        },
        center: [19.15, 52.10],
        zoom: 7,
        scrollZoom: false,
        attributionControl: false,
      });

      map.addControl(new maplibregl.AttributionControl({ compact: true }));

      containerRef.current.addEventListener('click', () => map.scrollZoom.enable());
      containerRef.current.addEventListener('mouseleave', () => map.scrollZoom.disable());

      map.on('load', () => {
        (map.getSource('stations') as any).setData(
          buildGeoJSON(stationsRef.current, fuelTypeRef.current)
        );
      });

      map.on('moveend', syncMarkers);
      map.on('zoomend', syncMarkers);
      map.on('sourcedata', (e: any) => {
        if (e.sourceId === 'stations' && e.isSourceLoaded) syncMarkers();
      });

      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      for (const m of markersRef.current.values()) m.remove();
      markersRef.current.clear();
      userMarkerRef.current?.remove();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const m of markersRef.current.values()) m.remove();
    markersRef.current.clear();

    if (map.isStyleLoaded()) {
      (map.getSource('stations') as any)?.setData(buildGeoJSON(stations, fuelType));
    }
  }, [stations, fuelType]);

  useEffect(() => {
    const map = mapRef.current;
    const MapLib = MapLibRef.current;
    if (!map || !MapLib || userLat == null || userLng == null) return;

    userMarkerRef.current?.remove();
    const el = document.createElement('div');
    el.style.cssText = 'width:16px;height:16px;background:#3b82f6;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 4px rgba(59,130,246,.3)';

    userMarkerRef.current = new MapLib.Marker({ element: el, anchor: 'center' })
      .setLngLat([userLng, userLat])
      .setPopup(new MapLib.Popup().setHTML('<b>Twoja lokalizacja</b>'))
      .addTo(map);
    map.easeTo({ center: [userLng, userLat], zoom: 13 });
  }, [userLat, userLng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !panTo) return;
    map.easeTo({ center: [panTo.lng, panTo.lat], zoom: panTo.zoom ?? 13, duration: 800 });
  }, [panTo]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" style={{ zIndex: 0 }} />
      <div className="absolute bottom-5 left-3 z-[999] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 text-xs border border-gray-200 pointer-events-none">
        <p className="font-bold text-gray-600 uppercase tracking-widest text-[9px] mb-2">
          {FUEL_LABELS[fuelType]}
        </p>
        {([
          ['#16a34a', 'Najtańsze (↓ 20%)'],
          ['#d97706', 'Średnia cena'],
          ['#dc2626', 'Najdroższe (↑ 20%)'],
        ] as const).map(([color, label]) => (
          <div key={color} className="flex items-center gap-2 mb-1">
            <span className="w-3.5 h-3.5 rounded-full inline-block border border-white shadow" style={{ background: color }} />
            <span className="text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
