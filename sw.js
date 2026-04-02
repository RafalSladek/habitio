const CACHE = "habitio_v9";

const PRECACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./suggestions.js",
  "./i18n.js",
  "./manifest.json",
  "./favicon.ico",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/hero-onboarding.webp",
  "./icons/hero-onboarding.png",
  "./icons/flags/gb.svg",
  "./icons/flags/de.svg",
  "./icons/flags/pl.svg",
];

// Install: pre-cache all app shell assets
globalThis.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
  globalThis.skipWaiting();
});

// Activate: delete old caches
globalThis.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  globalThis.clients.claim();
});

// Fetch strategy:
// - App shell (same-origin): stale-while-revalidate
// - Google Fonts: bypass the service worker and let the browser cache them
// - Everything else: network-first, fall back to cache
globalThis.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Skip non-GET and chrome-extension requests
  if (request.method !== "GET" || url.protocol === "chrome-extension:") return;

  // Let the browser handle Google Fonts directly. Firefox can surface noisy
  // cross-origin failures when a service worker proxies font requests.
  if (url.hostname === "fonts.gstatic.com" || url.hostname === "fonts.googleapis.com") {
    return;
  }

  // App shell (same-origin) — stale-while-revalidate
  // Serve from cache immediately for speed/offline, but always fetch in
  // background so the cache is refreshed and the next load is up-to-date.
  if (url.origin === globalThis.location.origin) {
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
  e.respondWith(fetch(request).catch(() => caches.match(request)));
});
