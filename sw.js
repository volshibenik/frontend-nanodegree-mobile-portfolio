const VERSION = "3.0.1";

// const cacheName = 'techqueria-org';
const APP_CACHE_NAME = 'techqueria-org-app';
const STATIC_CACHE_NAME = 'techqueria-org-static';

console.log(`installing sw.js`);

const CACHE_STATIC = [

  '/css/print.css'
];

const CACHE_APP = [
  '/',
  '/index.html',
  '/about/',
  '/contact/',
  '/events/',
  '/code-of-conduct/',
  '/merch/',
  '/welcome-to-slack/',
];

self.addEventListener('install',function(e){
  e.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME),
      caches.open(APP_CACHE_NAME),
      self.skipWaiting()
    ]).then(function(storage){
      var static_cache = storage[0];
      var app_cache = storage[1];
      return Promise.all([
        static_cache.addAll(CACHE_STATIC),
        app_cache.addAll(CACHE_APP)]);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName !== APP_CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              console.log('deleting',cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

this.addEventListener('fetch', function(event) {
  var response;
  event.respondWith(caches.match(event.request)
                    .then(function (match) {
    return match || fetch(event.request);
  }).catch(function() {
    return fetch(event.request);
  })
                    .then(function(r) {
    response = r;
    caches.open(cacheName).then(function(cache) {
      cache.put(event.request, response);
    });
    return response.clone();
  })
                   );
});