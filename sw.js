self.addEventListener('install', event => {
    console.log('V1 installing…');
  
    // Files to cach
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(
              [
                '/css/bootstrap.css',
                '/css/main.css',
                '/js/bootstrap.min.js',
                '/js/jquery.min.js',
                '/offline.html'
              ]
            );
        })
    );
});