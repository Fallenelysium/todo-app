const CACHE_NAME = "todo-pwa-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./service-worker.js",
  "./assets/css/style.css",
  "./assets/js/app.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

// Install: cache de basis bestanden
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate: ruim oude caches op
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// Fetch: probeer cache eerst, anders internet
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
