<script>
  import Admin from "./Admin.svelte";
  import { location } from "svelte-spa-router";
  import { space } from "../../store";
  import Welcome from "./Welcome.svelte";
  import Jitsi from "../../components/Jitsi.svelte";
  import Pad from "../../components/Pad.svelte";

  $: isAdmin = $location.endsWith("admin");
</script>

{#if $space === false}
  <Welcome />
{:else}
  <section>
    {#if isAdmin}
      <Admin />
    {/if}
    <!--section>
          <Jitsi name={$space.name} key={$space.jitsiKey} />
        </section>
        <section>
          <Pad name={$space.name} key={$space.etherpadKey} />
        </section-->
  </section>
{/if}
