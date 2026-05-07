'use client';
import { useEffect, useRef } from 'react';

interface Props { lat: number; lng: number; name: string; }

export default function StationMiniMap({ lat, lng, name }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (mapRef.current || !ref.current) return;
    let cancelled = false;
    (async () => {
      const maplibregl = (await import('maplibre-gl')).default;
      await import('maplibre-gl/dist/maplibre-gl.css');
      if (cancelled || !ref.current) return;
      const map = new maplibregl.Map({
        container: ref.current,
        style: {
          version: 8,
          sources: { osm: { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxzoom: 19 } },
          layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
        },
        center: [lng, lat], zoom: 15, scrollZoom: false, attributionControl: false,
      });
      map.addControl(new maplibregl.AttributionControl({ compact: true }));
      map.on('load', () => {
        const el = document.createElement('div');
        el.style.cssText = 'width:18px;height:18px;background:#16a34a;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,.4)';
        new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([lng, lat])
          .setPopup(new maplibregl.Popup().setHTML(`<b>${name}</b>`))
          .addTo(map).togglePopup();
      });
      mapRef.current = map;
    })();
    return () => { cancelled = true; mapRef.current?.remove(); mapRef.current = null; };
  }, [lat, lng, name]);

  return <div ref={ref} className="w-full h-full" style={{ zIndex: 0 }} />;
}
