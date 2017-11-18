var cacheName = 'SuperMarios_home';
var filesToCache = [
    '/home/',
    '/home/about',
    '/home/css/main.css',
    '/home/images/icons/favoricon.ico',
    '/home/images/icons/index.ico',
    '/home/js/jquery.min.js',
    '/home/js/jquery.poptrox.min.js',
    '/home/js/jquery.scrolly.min.js',
    '/home/js/jquery.scrollex.min.js',
    '/home/js/skel.min.js',
    '/home/js/util.js',
    '/home/js/main.js',
    '/home/images/fulls/01.jpg',
    '/home/images/thumbs/01.jpg',
    '/home/images/fulls/02.jpg',
    '/home/images/thumbs/02.jpg',
    '/home/images/fulls/03.jpg',
    '/home/images/thumbs/03.jpg',
    '/home/images/fulls/04.jpg',
    '/home/images/thumbs/04.jpg',
    '/home/images/fulls/05.jpg',
    '/home/images/thumbs/05.jpg',
    '/home/images/fulls/06.jpg',
    '/home/images/thumbs/06.jpg',
    '/home/images/intro.jpg',
    '/home/images/one.jpg',
    '/home/images/two.jpg',
];

self.addEventListener('install', function(e) {
  console.log('ServiceWorker Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('ServiceWorker Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('ServiceWorker Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
