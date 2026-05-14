const CACHE = 'benzynamapa-v2';
const STATIC = [
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
];
const DATA_CACHE = 'benzynamapa-data-v1';
const DATA_URLS = [
  '/data/stats_latest.json',
  '/data/map_data.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE && k !== DATA_CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // HTML dokumenty (navigace) — VŽDY network-first.
  // Stale HTML obsahuje stale CSS/JS hash → broken stránka. Tomuto chceme předejít.
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
    return;
  }

  // Data JSON — network-first, fallback cache
  if (DATA_URLS.some(u => url.pathname === u)) {
    e.respondWith(
      fetch(req).then(res => {
        const clone = res.clone();
        caches.open(DATA_CACHE).then(c => c.put(req, clone));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // OSM tiles — cache-first
  if (url.hostname === 'tile.openstreetmap.org') {
    e.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(req, clone));
        return res;
      }))
    );
    return;
  }

  // Hashed static assety (CSS/JS/IMG s otiskem) — cache-first, immutable.
  // Pokud cached není, jdeme na network a uložíme.
  if (url.pathname.startsWith('/_next/static/')) {
    e.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
        }
        return res;
      }))
    );
    return;
  }

  // Ostatní — stale-while-revalidate
  e.respondWith(
    caches.match(req).then(cached => {
      const fresh = fetch(req).then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(req, res.clone()));
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
