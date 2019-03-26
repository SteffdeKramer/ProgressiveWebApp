var cacheName = "PWA_V4";
let CACHE_NAME = cacheName;
let online = navigator.onLine;

var filesToCache = ["app.js", "main.css", "index.html", "/"];

// Install
self.addEventListener("install", function(e) {
  console.log("[ServiceWorker | Install ] Installing SW");
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log("[ServiceWorker | Install ] Caching app shell");
      return cache.addAll(filesToCache);
    })
  );
});

// Activation
self.addEventListener("activate", function(event) {
  console.log("[ServiceWorker | Activate ]: Starting")
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (CACHE_NAME !== cacheName &&  cacheName.startsWith("PWA_")) {
            console.log("[ServiceWorker | Activate ]: Old cache detected and has been eradicated")
            return caches.delete(cacheName);
          }
          else {
            console.log("[ServiceWorker | Activate]: no old is cache present.")
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                console.log("clone clone clone");
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

