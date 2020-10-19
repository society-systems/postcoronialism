<script>
  import Router from "svelte-spa-router";

  import Home from "./routes/home";
  import Admin from "./routes/admin";
  import Join from "./routes/join";
  import Logout from "./routes/logout";

  import Jitsi from "./Jitsi.svelte";
  import Pad from "./Pad.svelte";

  const routes = {
    "/": Home,
    "/admin": Admin,
    "/logout": Logout,
    "/join/:invitation": Join,
  };
</script>

<style>
  .centered {
    max-width: 1024px;
    margin: 0 auto;
  }
</style>

<main>
  <h1 class="centered"><a href="#">postcoronialism v0.0.1</a></h1>

  <Router {routes} />

  <section>
    <Jitsi />
  </section>

  <section>
    <Pad />
  </section>
</main>
