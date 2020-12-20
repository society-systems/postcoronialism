const check = () => {
  if (!("serviceWorker" in navigator)) {
    throw new Error("No Service Worker support!");
  }
  if (!("PushManager" in window)) {
    throw new Error("No Push API Support!");
  }
};

const registerServiceWorker = async () => {
  const swRegistration = await navigator.serviceWorker.register(
    "service-worker.js"
  );
  return swRegistration;
};

export default async function () {
  check();
  await registerServiceWorker();
  // FIXME: store the state in a runtime store
  await navigator.serviceWorker.ready;
}
