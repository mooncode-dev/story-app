import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// Precache app shell
precacheAndRoute(self.__WB_MANIFEST);

// Cache data API Cerita
registerRoute(
  ({ url }) => url.href.startsWith('https://story-api.dicoding.dev/v1/'),
  new StaleWhileRevalidate({
    cacheName: 'story-api-cache',
  })
);

// Handle Push Event (Kriteria 2 - Skilled)
self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.message,
    icon: '/favicon.png',
    data: { url: data.url } // Action navigasi (Kriteria 2 - Advanced)
  });
});