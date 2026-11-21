const CACHE = 'vet360-v2-cache';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './data.js',
  './manifest.webmanifest'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(
      cached =>
        cached ||
        fetch(e.request)
          .then(res => {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, copy));
            return res;
          })
          .catch(() => caches.match('./index.html'))
    )
  );
});
