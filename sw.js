const CACHE = 'habitio_v4';

const PRECACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './suggestions.js',
  './manifest.json',
  './favicon.ico',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/hero-onboarding.webp',
  './icons/hero-onboarding.png',
];

// Install: pre-cache all app shell assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch strategy:
// - App shell (same-origin): cache-first, fall back to network
// - Google Fonts CSS: network-first, fall back to cache
// - Font files (.woff2): cache-first (long-lived)
// - Everything else: network-first, fall back to cache
self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Skip non-GET and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') return;

  // Font files — cache-first (immutable)
  if (url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open(CACHE).then((c) =>
        c.match(request).then(
          (cached) =>
            cached ||
            fetch(request).then((res) => {
              c.put(request, res.clone());
              return res;
            })
        )
      )
    );
    return;
  }

  // Google Fonts CSS — network-first, cache fallback
  if (url.hostname === 'fonts.googleapis.com') {
    e.respondWith(
      fetch(request)
        .then((res) => {
          caches.open(CACHE).then((c) => c.put(request, res.clone()));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // App shell (same-origin) — stale-while-revalidate
  // Serve from cache immediately for speed/offline, but always fetch in
  // background so the cache is refreshed and the next load is up-to-date.
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.open(CACHE).then((c) =>
        c.match(request).then((cached) => {
          const networkFetch = fetch(request).then((res) => {
            if (res.ok) c.put(request, res.clone());
            return res;
          });
          return cached || networkFetch;
        })
      )
    );
    return;
  }

  // Default — network with cache fallback
  e.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
