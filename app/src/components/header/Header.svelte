<script>
  import { location } from "svelte-spa-router";

  import Mnemonic from "./Mnemonic.svelte";

  export let space;
  let showMagicWords;
  let error;

  $: home = $location === "/";
  // FIXME: there must be a better way!
  $: showHeader = !$location.startsWith("/join");

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
  .logo {
    font-weight: normal;
    color: var(--color-secondary);
  }
  .logo a {
    text-decoration: none;
    color: inherit;
  }
  .logo .arrow {
    width: 1.2rem;
    display: inline-block;
    overflow: hidden;
    vertical-align: bottom;
    transition: all 0.2s;
    transition-delay: 0.2s;
  }
  .logo .home .arrow {
    width: 0;
  }
  .group {
    position: absolute;
    top: 0;
    right: 0;
    width: 14rem;
    margin: 0 0 0 auto;
    z-index: 10;
  }
  .group button,
  .group .button {
    width: 100%;
  }
  .contact,
  .admin {
    background-color: var(--color-neutral);
  }
  .admin {
    text-transform: uppercase;
  }
</style>

{#if showHeader}
  <section>
    <header>
      {#if space}
        <h1 class="logo">
          <a href="#" class:home>
            <span class="arrow">←</span>
            <strong>post</strong>coronialism
          </a>
        </h1>
      {/if}
      <div class="group">
        {#if space === false}
          {#if showMagicWords}
            <Mnemonic {onReset} {onError} />
          {:else}
            <button class="mnemonic" on:click={handleShowMagicWords}>Enter Magic
              Words</button>
            <hr />
            <a class="button contact" href="mailto:admin@example.org">Make
              Contact</a>
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
  </section>
{/if}
