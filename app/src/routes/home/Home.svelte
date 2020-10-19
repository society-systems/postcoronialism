<script>
  import Jitsi from "../../Jitsi.svelte";
  import Pad from "../../Pad.svelte";

  import { publicKey, role, secrets, setMnemonic } from "../../store";

  let name = "🤪🏺⛱🗿";
  let mnemonic;

  let error;

  let showMnemonicInput = false;

  function handleSubmitMnemonic() {
    if (!setMnemonic(mnemonic)) {
      error = true;
    }
  }
</script>

{#if $role}
  <p>Welcome <strong>{$role}</strong></p>
  {#if $role === 'admin'}
    <p><a href="#/admin">Create invites</a></p>
  {/if}
  <p><a href="#/logout">Exit space</a></p>
{:else}
  <p>
    <button on:click={() => (showMnemonicInput = true)}>Enter magic words</button>
    {#if showMnemonicInput}
      <form on:submit={handleSubmitMnemonic}>
        <input bind:value={mnemonic} required />
        <button type="submit">Enter</button>
      </form>
      {#if error}
        <p>
          Invalid magic words. Make sure that you entered your 12 words
          correctly.
        </p>
      {/if}
    {/if}
  </p>
{/if}
