import App from "./App.svelte";
import install from "./install";

const app = new App({
  target: document.body,
});

install();

export default app;
