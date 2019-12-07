var cacheName = 'app-v1';
var appShellFiles = [
 "./index.html",
 "./main.js"
 "./style.css"
];



self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install');
});


self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      console.log('[Service Worker] Fetching resource: '+ e.request.url);

      return r || fetch(e.request).then(function(response) {
          return caches.open(cacheName).then(function(cache) {
            console.log('[Service Worker] Caching new resource: '+e.request.url);
            cache.put(e.request, response.clone());
            return response;
        });
      });
    })
  );
});
