<script>
  import Router from "svelte-spa-router";

  import { space, subscribeToNotifications } from "./store";

  import EnableNotifications from "./components/EnableNotifications.svelte";
  import Header from "./components/header";
  import JitsiController from "./components/JitsiController.svelte";

  import Home from "./routes/home";
  import Forum from "./routes/forum/Index.svelte";
  import ForumGetPost from "./routes/forum/GetPost.svelte";
  import ForumAddPost from "./routes/forum/AddPost.svelte";
  import Admin from "./routes/admin";
  import Join from "./routes/join";
  import Logout from "./routes/logout";

  const routes = {
    "/": Home,
    "/forum": Forum,
    "/forum/new": ForumAddPost,
    "/forum/posts/:id": ForumGetPost,
    "/admin": Admin,
    "/logout": Logout,
    "/join/:invitation": Join,
  };
</script>

{#if $space !== undefined}
  <main>
    <EnableNotifications />
    <Header space={$space} />
    <JitsiController />
    <Router {routes} />
  </main>
{/if}
