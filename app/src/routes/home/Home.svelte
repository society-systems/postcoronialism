<script>
  import Header from "./Header.svelte";
  import Admin from "./Admin.svelte";
  import { location } from "svelte-spa-router";
  import { spaceName, space } from "../../store";
  import Welcome from "./Welcome.svelte";
  import Jitsi from "../../components/Jitsi.svelte";
  import Pad from "../../components/Pad.svelte";

  $: isAdmin = $location.endsWith("admin");
</script>

<main>
  <section>
    {#if $space !== undefined}
      <Header space={$space} />
      {#if $space === false}
        <Welcome />
      {:else}
        {#if isAdmin}
          <Admin />
        {/if}
        <!--section>
          <Jitsi name={$space.name} key={$space.jitsiKey} />
        </section>
        <section>
          <Pad name={$space.name} key={$space.etherpadKey} />
        </section-->
      {/if}
    {/if}
  </section>
</main>
