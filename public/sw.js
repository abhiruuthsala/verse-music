// Minimal service worker — enough to make the app installable as a PWA.
// It intentionally does NOT cache API responses or auth data, only lets the
// browser register a controller so "Add to Home Screen" / install prompts work.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

// Pass-through fetch — no offline caching of private data.
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
