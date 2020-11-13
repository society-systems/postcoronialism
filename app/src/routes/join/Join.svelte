<script>
  import { joinSpace, getInviteDetails } from "../../store";
  import { replace } from "svelte-spa-router";

  export let params = {};

  let error;
  let userName = "";
  let signerName = "";
  let spaceName = "";

  getInviteDetails(params.invitation).then((d) => {
    signerName = d.userName;
    spaceName = d.spaceName;
  });

  async function handleJoin() {
    try {
      await joinSpace(spaceName, userName, params.invitation);
      console.log("joining");
      replace("/");
    } catch (e) {
      console.log("error", e);
      if (e.code === -32006) {
        error = "Please choose another name.";
      } else {
        error = e.message;
      }
    }
  }
</script>

<main>
  <section>
    You've been invited by
    {signerName}
    to join
    {spaceName}.

    <form on:submit|preventDefault={handleJoin}>
      Choose a name to join the space:
      <input bind:value={userName} />
      <button>Join "{spaceName}"</button>
    </form>

    {#if error}
      <p>{error}</p>
    {/if}
  </section>
</main>
