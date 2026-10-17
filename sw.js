/* El Morjene Market — service worker
 * - Pré-charge le strict nécessaire pour que l'appli s'ouvre même sans réseau
 * - Ne touche JAMAIS aux requêtes POST (commandes FormSubmit) ni aux autres sites
 * Change CACHE_VERSION à chaque mise à jour du site pour forcer le rafraîchissement.
 */
const CACHE_VERSION = 'v5';
const CACHE = 'el-morjene-' + CACHE_VERSION;
const PRECACHE = [
  './',
  'index.html',
  'js/app.js',
  'js/app-mobile.js',
  'js/mobile-polish.js',
  'js/device-detect.js',
  'js/install.js',
  'js/version.js',
  'js/updater.js',
  'css/device.css',
  'css/desktop.css',
  'css/mobile.css',
  'css/mobile-polish.css',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('el-morjene-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;                       // commandes (POST) : on laisse passer
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;        // Google Fonts, FormSubmit… : on laisse passer

  // Pages : réseau d'abord (toujours à jour), cache si hors-ligne
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('index.html')));
    return;
  }

  // Fichiers du site (JS, CSS, images) : cache d'abord, mise à jour en arrière-plan
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
