<script>
  import { space } from "../../store";
  import Welcome from "./Welcome.svelte";
  import Pad from "../../components/Pad.svelte";
</script>

{#if $space === false}
  <Welcome />
{:else}
  <section>
    <Pad name={$space.name} key={$space.etherpadKey} />
  </section>
{/if}
