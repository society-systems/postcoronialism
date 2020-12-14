<script>
  import Mnemonic from "./Mnemonic.svelte";

  export let space;
  let showMagicWords;
  let error;

  function handleShowMagicWords() {
    showMagicWords = true;
  }

  function onReset() {
    showMagicWords = false;
  }

  function onError(e) {
    error = e;
  }
</script>

<style>
  header {
    position: relative;
    height: 5rem;
  }

  .group {
    position: absolute;
    right: 0;
    width: 14rem;
    margin: 0 0 0 auto;
    z-index: 10;
  }
  .group button,
  .group .button {
    width: 100%;
  }
  .mnemonic,
  .admin {
    background-color: var(--color-neutral);
  }
  .admin {
    text-transform: uppercase;
  }
</style>

<header>
  <div class="group">
    {#if space === false}
      {#if showMagicWords}
        <Mnemonic {onReset} {onError} />
      {:else}
        <button class="mnemonic" on:click={handleShowMagicWords}>Enter Magic
          Words</button>
        <hr />
        <a class="button" href="mailto:admin@example.org">Make Contact</a>
      {/if}
    {:else}
      {#if space.isAdmin}
        <a class="button admin" href="#/admin">Admin</a>
        <hr />
      {/if}
      <a class="button" href="#/logout">Exit Space</a>
    {/if}
  </div>
</header>
