<script>
  import { join } from "../../store";
  import { replace } from "svelte-spa-router";

  export let params = {};

  async function handleJoin() {
    await join(params.invitation);
    console.log("joining");
    replace("/");
  }
</script>

Welcome!
{params.invitation}

<button on:click={handleJoin}>Join</button>
