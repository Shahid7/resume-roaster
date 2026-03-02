self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: 'Notification', body: 'Time for Iftar/Suhoor' };
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon.png', // Replace with your actual icon path
      badge: '/badge.png',
      vibrate: [200, 100, 200]
    });
  });
  
  // This handles clicking the notification
  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow('/')); 
  });

  const CACHE_NAME = 'qamar-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  // Add your local icons or audio files here
];

// Install: Save assets to cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Fetch: Serve from cache if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});