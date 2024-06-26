self.addEventListener('push', (event) => {
  const data = event.data.json();
  const title = data.title;
  const body = data.body;
  const url = data.url
  const notificationOptions = {
    body,
    url,
    icon: '/icon.png',
  };

  event.waitUntil(self.registration.showNotification(title, notificationOptions));

  //self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  window.location.href = event.data.url;
});

self.addEventListener('pushsubscriptionchange', (event) => {
  console.log(event);
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim()); // Ensures active service worker
});

self.addEventListener('install', (event) => {
  event.waitUntil(skipWaiting()); // Activate immediately
});
