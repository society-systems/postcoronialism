<script>
  import Router from "svelte-spa-router";

  import { space } from "./store";

  import Header from "./components/header";
  import JitsiController from "./components/JitsiController.svelte";

  import Home from "./routes/home";
  import Admin from "./routes/admin";
  import Join from "./routes/join";
  import Logout from "./routes/logout";

  const routes = {
    "/": Home,
    "/admin": Admin,
    "/logout": Logout,
    "/join/:invitation": Join,
  };
</script>

{#if $space !== undefined}
  <main>
    <Header space={$space} />
    <JitsiController />
    <Router {routes} />
  </main>
{/if}
