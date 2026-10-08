const CACHE_NAME = "workboard-sync-v2";

const STATIC_FILES = [
  "./",
  "./manifest.json",
  "./firebase-config.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key.startsWith("workboard-sync-") && key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  // Toujours récupérer la dernière version de index.html
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .then(response => {
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Pour les autres fichiers : réseau d'abord, cache en secours
  event.respondWith(
    fetch(request)
      .then(response => {
        return response;
      })
      .catch(() => caches.match(request))
  );
});
