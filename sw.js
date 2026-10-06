const C = "workboard-sync-v2";

const A = [
  "./",
  "./index.html",
  "./manifest.json",
  "./firebase-config.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];


/* ================================ */
/* INSTALLATION */
/* ================================ */

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(C)
      .then(cache => cache.addAll(A))
      .then(() => self.skipWaiting())

  );

});


/* ================================ */
/* ACTIVATION */
/* ================================ */

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys()
      .then(keys => {

        return Promise.all(

          keys
            .filter(key => key !== C)
            .map(key => caches.delete(key))

        );

      })
      .then(() => self.clients.claim())

  );

});


/* ================================ */
/* REQUÊTES */
/* ================================ */

self.addEventListener("fetch", event => {

  event.respondWith(

    fetch(event.request)
      .then(response => {

        /* On récupère toujours la version
           la plus récente depuis le serveur */

        return response;

      })
      .catch(() => {

        /* Si Internet ne fonctionne pas,
           on utilise le cache */

        return caches.match(event.request);

      })

  );

});
