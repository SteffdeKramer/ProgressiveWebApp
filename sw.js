var cacheName = "PWA_V45";
let CACHE_NAME = cacheName;
let online = navigator.onLine;

var filesToCache = ["app.js", "main.css", "index.html", "sw.js"];

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

// Switch case for getting the right strategy

self.addEventListener('fetch', (event) => {

  if(online == false){
    loadFromCache(event);
    return
  } else {

  console.log("you called");
  console.log(event.request);
  const destination = event.request.destination;
  switch (destination) {
    case 'image': {
      loadFromNetworkCacheFallback(event);
      return;
    }
    case 'document': {
      loadFromCacheNetworkFallback(event);
      return;
    }
    case 'script': {
      loadFromCacheNetworkFallback(event);
      return;
    }
    case 'style': {
      loadFromCacheNetworkFallback(event);
      return;
    }
    default: {
      console.log("race started");
      race(event);
      return;
    }
  }}
});

function loadFromCache(event) {
  console.log("[FETCH]: Load from cache");
  event.respondWith(caches.match(event.request));
}

function loadFromNetwork(event) {
  console.log("[FETCH]: Load from network");
  event.respondWith(fetch(event.request));
}

function loadFromCacheNetworkFallback(event) {
  event.respondWith(async function() {
    console.log("[FETCH]: Load from cache with network fallback");
    const response = await caches.match(event.request);
    return response || fetch(event.request);
  }());
}

function loadFromNetworkCacheFallback(event) {
  console.log("[FETCH]: Load from network with cache as fallback");
  event.respondWith(async function() {
    try {
      return await fetch(event.request);
    } catch (err) {
      return caches.match(event.request);
    }
  }());
}

function race (event) {
  promiseRace([
    caches.match(event.request),
    fetch(event.request)
  ])
}

function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    // make sure promises are all promises
    promises = promises.map(p => Promise.resolve(p));
    // resolve this promise as soon as one resolves
    promises.forEach(p => p.then(resolve));
    // reject if all promises reject
    promises.reduce((a, b) => a.catch(() => b))
      .catch(() => reject(Error("All failed")));
  });
};