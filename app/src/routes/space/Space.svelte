<script>
  import Create from "./Create.svelte";
  import Admin from "./Admin.svelte";
  import { location } from "svelte-spa-router";
  import { spaceName, publicKey, space } from "../../store";
  import Jitsi from "../../Jitsi.svelte";
  import Pad from "../../Pad.svelte";

  $: isAdmin = $location.endsWith("/admin");
</script>

<p>Space Name: {$spaceName}</p>
<p>Public Key: {$publicKey}</p>

{#if $space}
  {#if $space.claimed === false}
    <Create spaceName={$spaceName} />
  {:else if $space.claimed === true}
    This space is not available.
  {:else}
    {#if isAdmin}
      <Admin />
    {/if}

    <section>
      <Jitsi />
    </section>

    <section>
      <Pad />
    </section>
  {/if}
{/if}
