const CACHE_NAME = 'wbgt-checker-cache-v2'; // <--- AQUI! MUDADO DE v1 PARA v2
const urlsToCache = [
  '/wbgt-manual/', // A raiz do seu aplicativo
  '/wbgt-manual/index.html',
  '/wbgt-manual/style.css',
  '/wbgt-manual/script.js',
  '/wbgt-manual/wbgt_table_preciso.json',
  '/wbgt-manual/icon-192.png',
  '/wbgt-manual/icon-512.png',
  '/wbgt-manual/manifest.json'
];

// Evento 'install': Instala o Service Worker e armazena os arquivos em cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': Intercepta requisições de rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retorna a resposta do cache
        if (response) {
          return response;
        }
        // Nenhuma resposta no cache - busca na rede
        return fetch(event.request);
      })
  );
});

// Evento 'activate': Limpa caches antigos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
