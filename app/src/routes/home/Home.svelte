<script>
  import Jitsi from "./Jitsi.svelte";
  import Pad from "./Pad.svelte";
  import Invite from "./Invite.svelte";

  import { publicKey, role, secrets, setMnemonic } from "../../store";

  let name = "🤪🏺⛱🗿";
  let mnemonic;

  let showMnemonicInput = false;

  function handleSubmitMnemonic() {
    setMnemonic(mnemonic);
  }
</script>

<style>
  main {
    max-width: 1024px;
    margin: 0 auto;
  }

  section {
    margin-bottom: 40px;
  }
</style>

<main>
  <h1>postcoronialism v0</h1>

  {#if $role}
    <p>Welcome <strong>{$role}</strong></p>
    <p><a href="#/logout">Exit space</a></p>
  {:else}
    <p>
      <button on:click={() => (showMnemonicInput = true)}>Enter magic words</button>
      {#if showMnemonicInput}
        <form on:submit={handleSubmitMnemonic}>
          <input bind:value={mnemonic} />
          <button type="submit">Enter</button>
        </form>
      {/if}
    </p>
  {/if}

  <Invite />

  <section>
    <!--Jitsi {name} /-->
  </section>

  <section>
    <!--Pad {name} /-->
  </section>
</main>
