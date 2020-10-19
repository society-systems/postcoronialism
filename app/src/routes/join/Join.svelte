<script>
  import { join } from "../../store";
  import { replace } from "svelte-spa-router";

  export let params = {};

  let error;

  async function handleJoin() {
    try {
      await join(params.invitation);
      console.log("joining");
      replace("/");
    } catch (e) {
      console.log("error", e);
      error = e.message;
    }
  }
</script>

You've been invited to join Postcoronialism.
<button on:click={handleJoin}>Join</button>

{#if error}
  <p>{error}</p>
{/if}
