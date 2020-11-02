<script>
  import { secret } from "./store";
  import Router from "svelte-spa-router";

  import Home from "./routes/home";
  import Space from "./routes/space";
  import Join from "./routes/join";
  import Logout from "./routes/logout";

  $: {
    console.log($secret);
  }

  const routes = {
    "/": Home,
    "/logout": Logout,
    "/space/:name": Space,
    "/space/:name/admin": Space,
    "/join/:invitation": Join,
  };
</script>

<style>
  .centered {
    max-width: 1024px;
    margin: 0 auto;
  }
</style>

<Router {routes} />
