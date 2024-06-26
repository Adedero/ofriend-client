const publicVapidKey = import.meta.env.VITE_PUBLIC_VAPID_KEY;
const token = sessionStorage.getItem('token');

export async function initializePushNotifications(toast) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    toast.add({
      severity: 'info',
      summary: 'Push notifications not supported',
      detail: 'You may not be able to receive notifications from Ofriend as your browser does not support them.',
      life: 10000
    })
    console.log('Push notifications not supported');
    return;
  }

  try {
    const swRegistration = await navigator.serviceWorker.register('/service-worker.js');
    
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      toast.add({ severity: 'warn', summary: 'Notification permission not granted', life: 5000 });
      return;
    }

    const existingSubscription = await swRegistration.pushManager.getSubscription();
    if (existingSubscription) return;

    const subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    
    // Send subscription to server
    await fetch(`${import.meta.env.VITE_API}services/subscribe`, {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    console.log('Push notification subscription successful');
    toast.add({ severity: 'success', summary: 'Push notification subscription successful', life: 5000 });
  } catch (error) {
    console.error('Error setting up push notifications:', error);
    toast.add({ severity: 'error', summary: 'Error setting up push notifications', detail: error.message });
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

