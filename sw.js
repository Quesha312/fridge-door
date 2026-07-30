// Minimal service worker - just enough to satisfy PWA installability
// requirements (a fetch handler). Deliberately does NOT cache anything:
// this app is still under active development, and a caching service
// worker would risk showing an old stale version after updates. If you
// want real offline support later, this is the file to extend.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
