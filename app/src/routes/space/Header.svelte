<script>
  import Mnemonic from "./Mnemonic.svelte";

  export let space;
  let showMagicWords;

  function handleShowMagicWords() {
    showMagicWords = true;
  }

  console.log(space);
</script>

<style>
  .group {
    width: 16rem;
    margin: 0 0 0 auto;
  }
  .group button,
  .group .button {
    width: 100%;
  }
  .admin {
    text-transform: uppercase;
  }
</style>

<header>
  <div class="group">
    {#if space.claimed === true}
      {#if showMagicWords}
        <Mnemonic />
      {/if}
      <button on:click={handleShowMagicWords}>Enter magic words</button>
      <hr />
      <a class="button" href="mailto:admin@example.org">Make contact</a>
    {:else if space.claimed === false}
      <button>Claim this space</button>
    {:else}
      {#if space.isAdmin}
        <a class="button admin" href="#/space/{space.spaceName}/admin">Admin</a>
        <hr />
      {/if}
      <a class="button" href="#/logout">Exit Space</a>
    {/if}
  </div>
</header>
