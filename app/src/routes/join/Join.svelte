<script>
  import {
    space,
    joinSpace,
    getInviteDetails,
    verifyInvite,
  } from "../../store";
  import { replace } from "svelte-spa-router";

  export let params = {};

  let error;
  let userName = "";
  let signerName = "";
  let spaceName = "";
  let validationStatus;
  let validationError;

  getInviteDetails(params.invitation).then((d) => {
    signerName = d.userName;
    spaceName = d.spaceName;
  });

  verifyInvite(params.invitation)
    .then((status) => {
      validationStatus = true;
    })
    .catch((e) => {
      console.log(e);
      validationStatus = false;
      validationError = e.message;
    });

  async function handleJoin() {
    try {
      await joinSpace(spaceName, userName, params.invitation);
      console.log("joining");
      replace("/");
    } catch (e) {
      console.log("error", e);
      if (e.code === -32006) {
        error = "Pseudonym already taken, try another one.";
      } else {
        error = e.message;
      }
    }
  }
</script>

<style>
  h1 {
    font-weight: normal;
    margin-bottom: var(--size-l);
  }
  section {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  form {
    display: flex;
    width: 50%;
  }
  form label {
    align-self: center;
    margin-right: var(--size-s);
  }
  form input {
    flex: 1;
  }
  p {
  }
</style>

{#if $space === undefined}
  <section>
    <h1>welcome to <strong>post</strong>coronialism</h1>

    {#if validationStatus === true}
      <form on:submit|preventDefault={handleJoin}>
        <label for="name">Choose your pseudonym</label>
        <input id="name" autocomplete="off" bind:value={userName} />
        <button>Next</button>
      </form>

      {#if error}
        <p>{error}</p>
      {/if}
    {:else if validationStatus === false}{validationError}{/if}
  </section>
{:else}
  <section>
    <p>
      You cannot use this invite since you are already a member.
      <a href="#" class="button">Go back</a>
    </p>
  </section>
{/if}
