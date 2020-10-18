<script>
  import Router from "svelte-spa-router";

  import Home from "./routes/home";
  import Join from "./routes/join";

  const routes = {
    "/": Home,
    "/join/:invitation": Join,
  };
</script>

<Router {routes} />
