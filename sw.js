const CACHE = "habitio_v10";

const PRECACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./suggestions.js",
  "./i18n.js",
  "./manifest.json",
  "./favicon.ico",
  "./icons/icon-16.png",
  "./icons/icon-32.png",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/hero-onboarding.webp",
  "./icons/hero-onboarding.png",
  "./icons/flags/gb.svg",
  "./icons/flags/de.svg",
  "./icons/flags/pl.svg",
];

const APP_SHELL_PATHS = [
  "/index.html",
  "/styles.css",
  "/app.js",
  "/suggestions.js",
  "/i18n.js",
  "/manifest.json",
  "/favicon.ico",
  "/icons/icon-16.png",
  "/icons/icon-32.png",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/hero-onboarding.webp",
  "/icons/hero-onboarding.png",
];

function matchesPath(pathname, suffix) {
  return pathname === suffix || pathname.endsWith(suffix);
}

function isAppShellRequest(request, url) {
  if (url.origin !== globalThis.location.origin) return false;
  if (request.mode === "navigate") return true;
  return APP_SHELL_PATHS.some((suffix) => matchesPath(url.pathname, suffix));
}

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
// - App shell (same-origin): network-first with cache fallback
// - Google Fonts: bypass the service worker and let the browser cache them
// - Other same-origin assets: stale-while-revalidate
// - Everything else: network with cache fallback
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

  // App shell (same-origin) — network-first
  // Users should see freshly deployed HTML/JS/translations on the first reload,
  // while cached files still keep the app working offline.
  if (isAppShellRequest(request, url)) {
    e.respondWith(
      caches.open(CACHE).then(async (c) => {
        try {
          const res = await fetch(request);
          if (res.ok) await c.put(request, res.clone());
          return res;
        } catch (err) {
          const cached = await c.match(request);
          if (cached) return cached;
          if (request.mode === "navigate") {
            const fallback = (await c.match("./")) || (await c.match("./index.html"));
            if (fallback) return fallback;
          }
          throw err;
        }
      })
    );
    return;
  }

  // Other same-origin assets — stale-while-revalidate
  if (url.origin === globalThis.location.origin) {
    e.respondWith(
      caches.open(CACHE).then((c) =>
        c.match(request).then((cached) => {
          const networkFetch = fetch(request).then((res) => {
            if (res.ok) c.put(request, res.clone());
            return res;
          });
          e.waitUntil(networkFetch.catch(() => {}));
          return cached || networkFetch;
        })
      )
    );
    return;
  }

  // Default — network with cache fallback
  e.respondWith(fetch(request).catch(() => caches.match(request)));
});
