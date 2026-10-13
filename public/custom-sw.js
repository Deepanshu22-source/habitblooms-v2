self.addEventListener('push', function (event) {
  let data = {}
  try {
    if (event.data) {
      data = event.data.json()
    }
  } catch (e) {
    try {
      data = { body: event.data.text() }
    } catch (err) {
      data = { body: 'Time to check off your habits! 🌸' }
    }
  }

  const title = data.title || 'HabitBlooms 🌸'
  const options = {
    body: data.body || "Don't let your streak break! Check off your habits today.",
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [200, 100, 200],
    tag: 'habitblooms-reminder',
    renotify: true,
    data: {
      url: data.url || '/dashboard'
    }
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  const targetUrl = event.notification.data?.url || '/dashboard'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i]
        if (client.url && client.url.includes('/dashboard') && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl)
      }
    })
  )
})
