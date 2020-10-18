<script>
  import Jitsi from "../../Jitsi.svelte";
  import Pad from "../../Pad.svelte";

  import { publicKey, role, secrets, setMnemonic } from "../../store";

  let name = "🤪🏺⛱🗿";
  let mnemonic;

  let showMnemonicInput = false;

  function handleSubmitMnemonic() {
    setMnemonic(mnemonic);
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
        <input bind:value={mnemonic} />
        <button type="submit">Enter</button>
      </form>
    {/if}
  </p>
{/if}
