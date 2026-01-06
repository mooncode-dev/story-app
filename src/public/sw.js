self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  let data;
  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    data = { title: 'Story App', message: 'Ada cerita baru untukmu!' };
  }

  const options = {
    body: data.message || data.body || 'Cek aplikasi sekarang!',
    icon: '/favicon.png',
    badge: '/favicon.png',
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Story App', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(event.notification.data.url || '/');
    })
  );
});