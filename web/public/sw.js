// PWA disabled — kill switch for existing service workers.
// Old SW versions (v1, v2) caused stale CSS/JS hash mismatches after deploys.
// This SW unregisters itself, clears all caches, and reloads open clients.
// Safe to delete this file after ~30 days when all clients have updated.

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(c => c.navigate(c.url));
  })());
});

self.addEventListener('fetch', () => {
  // Pass-through — let the browser handle all requests directly.
});
