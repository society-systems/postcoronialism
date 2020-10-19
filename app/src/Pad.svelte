<script>
  import { secrets } from "./store";

  //export let name;
</script>

{#if $secrets && $secrets.etherpad}
  <iframe
    title="Collaborative pad"
    src="https://pad.riseup.net/p/{$secrets.etherpad}?userName=postcoronialism"
    width="100%"
    height="400" />
{/if}
