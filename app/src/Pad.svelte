<script>
  import { space } from "./store";

  //export let name;
</script>

{#if $space && $space.etherpad}
  <iframe
    title="Collaborative pad"
    src="https://pad.riseup.net/p/{$space.etherpad}?userName=postcoronialism"
    width="100%"
    height="400" />
{/if}
