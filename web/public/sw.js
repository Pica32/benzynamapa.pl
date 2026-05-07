const CACHE = 'benzynamapa-v1';
const STATIC = [
  '/',
  '/najtansze-benzyna/',
  '/najtansze-diesel/',
  '/najtansze-lpg/',
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
  const url = new URL(e.request.url);

  // Data soubory — network first, fallback na cache
  if (DATA_URLS.some(u => url.pathname === u)) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(DATA_CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Mapy tiles — cache first, jinak network
  if (url.hostname === 'tile.openstreetmap.org') {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }))
    );
    return;
  }

  // Ostatní — stale-while-revalidate
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fresh = fetch(e.request).then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
