<script>
  import Router from "svelte-spa-router";

  import { space } from "./store";

  import Header from "./components/header";

  import Home from "./routes/home";
  import Join from "./routes/join";
  import Logout from "./routes/logout";

  const routes = {
    "/": Home,
    "/admin": Home,
    "/logout": Logout,
    "/join/:invitation": Join,
  };
</script>

{#if $space !== undefined}
  <main>
    <Header space={$space} />
    <Router {routes} />
  </main>
{/if}
