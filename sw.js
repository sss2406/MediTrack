/**
 * MediTrack Service Worker — PWA offline support
 */
const CACHE_NAME = 'meditrack-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './add-record.html',
  './dashboard.html',
  './meditrack-hub.js',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('generativelanguage.googleapis.com')) return; // AI calls always live
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok && e.request.url.startsWith(self.location.origin)) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

// Push notification handler
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : { title: 'MediTrack', body: 'Medicine reminder!' };
  e.waitUntil(
    self.registration.showNotification(data.title || 'MediTrack Reminder', {
      body: data.body,
      icon: './assets/icon-192.png',
      badge: './assets/icon-192.png',
      tag: 'meditrack-reminder',
      vibrate: [200, 100, 200],
      actions: [
        { action: 'taken', title: '✅ Mark Taken' },
        { action: 'snooze', title: '⏰ Snooze 30min' }
      ]
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'taken') {
    const data = JSON.parse(self.clients ? '{}' : '{}');
    const adh = JSON.parse(data.adherence || '{"streak":0}');
    adh.streak++;
    // Would update localStorage via postMessage in a real implementation
  }
  e.waitUntil(clients.openWindow('./'));
});
