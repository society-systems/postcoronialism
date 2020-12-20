async function saveSubscription(subscription) {
  const response = await fetch("/api/save-subscription", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  return response.json();
}

self.addEventListener("install", () => {
  console.log("[Service Worker] Install");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("[Service Worker] Activate");
  clients.claim();

  /*
  const req = await fetch("/api/vapid-key");
  const applicationServerKey = await req.text();

  */
});

self.addEventListener("push", function (event) {
  if (event.data) {
    console.log("Push event!! ", event.data.text());
    showLocalNotification(
      "Something new",
      event.data.text(),
      self.registration
    );
  } else {
    console.log("Push event but no data");
  }
});

const showLocalNotification = (title, body, swRegistration) => {
  const options = {
    body,
  };
  swRegistration.showNotification(title, options);
};

self.addEventListener("notificationclick", (event) => {
  console.log("On notification click: ", event.notification.tag);
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          let client = clientList[i];
          if (client.url == "/" && "focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow("/");
      })
  );
});

self.addEventListener("message", async function (event) {
  console.log("[Service Worker] Got message:", event);
  if (event.data.action === "getSubscription") {
    const subscription = event.ports[0].postMessage({
      subscription: (
        await self.registration.pushManager.getSubscription()
      ).toJSON(),
    });
  } else if (event.data.action === "subscribe") {
    const { publicKey } = event.data;
    try {
      if (await self.registration.pushManager.getSubscription()) {
        event.ports[0].postMessage({ error: "Already subscribed" });
        return;
      }
      const options = {
        applicationServerKey: publicKey,
        userVisibleOnly: true,
      };
      const subscription = await self.registration.pushManager.subscribe(
        options
      );
      console.log("[Service Worker] Subscription successful:", subscription);
      event.ports[0].postMessage({ subscription: subscription.toJSON() });
    } catch (err) {
      event.ports[0].postMessage({ error: err.toString() });
      console.error("[Service Worker]", err);
    }
  } else if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
