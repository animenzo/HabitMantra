/* =========================================
   HabitMantra Service Worker
   Production Ready
========================================= */

const CACHE_NAME = "habitmantra-v1";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon.png"
];


/* =========================================
   INSTALL → cache files
========================================= */
self.addEventListener("install", (event) => {
  console.log("✅ SW installed");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );

  self.skipWaiting();
});


/* =========================================
   ACTIVATE → cleanup old cache
========================================= */
self.addEventListener("activate", (event) => {
  console.log("✅ SW activated");

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});


/* =========================================
   FETCH → offline support
========================================= */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});


/* =========================================
   PUSH → show notification
========================================= */
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.body || "Habit reminder",
    icon: "/icon.png",
    badge: "/icon.png",

    vibrate: [200, 100, 200],

    data: {
      url: data.url || "/dashboard"
    },

    tag: "habit-reminder", // prevents duplicates
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || "Reminder 🔔",
      options
    )
  );
});


/* =========================================
   CLICK → open dashboard
========================================= */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((windows) => {
        // if already open → focus
        for (const win of windows) {
          if (win.url.includes(urlToOpen)) {
            return win.focus();
          }
        }
        // else open new
        return clients.openWindow(urlToOpen);
      })
  );
});


/* =========================================
   OPTIONAL → background sync
========================================= */
self.addEventListener("sync", (event) => {
  console.log("Background sync:", event.tag);
});
