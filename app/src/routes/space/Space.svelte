<script>
  import Header from "./Header.svelte";
  import Create from "./Create.svelte";
  import Admin from "./Admin.svelte";
  import { location } from "svelte-spa-router";
  import { spaceName, publicKey, space } from "../../store";
  import PostcoronialismWelcome from "./postcoronialism/Welcome.svelte";
  import Jitsi from "../../Jitsi.svelte";
  import Pad from "../../Pad.svelte";

  $: isAdmin = $location.endsWith("/admin");
</script>

<main>
  <section>
    {#if $space}
      <Header space={$space} />
      {#if $space.claimed === false}
        <Create spaceName={$spaceName} />
      {:else if $space.claimed === true}
        {#if $spaceName === 'postcoronialism'}
          <PostcoronialismWelcome />
        {:else}This space is not available.{/if}
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
