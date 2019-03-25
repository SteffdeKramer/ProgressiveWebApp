var cacheName = "PWA_V9";
let CACHE_NAME = cacheName;
let online = navigator.onLine;

var filesToCache = ["app.js", "main.css", "index.html"];

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

self.addEventListener("fetch", function (event) {
  //To tell browser to evaluate the result of event
  
  if (online == true) {
    console.log("[FETCH]: Is online get from network");
    event.respondWith(fetch(event.request));
  } else {
    event.respondWith(
      caches.match(event.request) //To match current request with cached request it
      .then(function(response) {
        //If response found return it, else fetch again.
        return response || fetch(event.request);
      })
      .catch(function(error) {
        console.error("Error: ", error);
      })
    );
  }
	
});
