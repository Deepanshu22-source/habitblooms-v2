self.addEventListener('push', function (event) {
  const data = JSON.parse(event.data.text() || '{}')
  event.waitUntil(
    self.registration.showNotification(data.title || 'HabitBlooms', {
      body: data.body || 'You have a new reminder!',
      icon: data.icon || '/icons/icon-192x192.png',
      badge: data.badge || '/icons/icon-192x192.png',
      data: {
        url: data.url || '/'
      }
    })
  )
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      if (clientList.length > 0) {
        let client = clientList[0]
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i]
          }
        }
        return client.focus()
      }
      return clients.openWindow(event.notification.data.url || '/')
    })
  )
})
