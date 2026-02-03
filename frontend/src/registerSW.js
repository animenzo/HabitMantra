import API from "./services/api"; // 🔥 use axios instance


/*
====================================
Convert VAPID public key
====================================
*/
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}



/*
====================================
Register Service Worker + Subscribe
====================================
*/
export const registerSW = async () => {
  try {
    // ✅ browser support check
    if (!("serviceWorker" in navigator)) return;
    if (!("PushManager" in window)) return;

    // ✅ register only once
    const reg = await navigator.serviceWorker.register("/sw.js");

    // ask permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    // reuse subscription if exists
    let sub = await reg.pushManager.getSubscription();

    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY // 🔥 from env
        )
      });
    }

    // 🔥 send to backend (YOUR ROUTE)
    await API.post("/subscriptions", sub);

    console.log("✅ Push subscribed");

  } catch (err) {
    console.error("SW registration failed:", err);
  }
};
