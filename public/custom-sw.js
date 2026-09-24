self.addEventListener('push', function(event) {
  try {
    if (event.data) {
      const data = event.data.json();
      const options = {
        body: data.body || 'New Notification',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: '1'
        }
      };
      
      event.waitUntil(
        self.registration.showNotification(data.title || 'HabitBlooms', options)
      );
    }
  } catch (e) {
    console.error('Error in push event', e);
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
