<script>
  import Router from "svelte-spa-router";

  import Home from "./routes/home";
  import Join from "./routes/join";
  import Logout from "./routes/logout";

  const routes = {
    "/": Home,
    "/logout": Logout,
    "/join/:invitation": Join,
  };
</script>

<Router {routes} />
