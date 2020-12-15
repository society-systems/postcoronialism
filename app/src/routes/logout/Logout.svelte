<script>
  import { push } from "svelte-spa-router";
  import CopyInput from "./CopyInput.svelte";
  import { mnemonic, logout } from "../../store";

  let understand;

  function handleLogout() {
    logout();
    push("/");
  }
</script>

<style>
  section {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .mnemonic {
    margin-bottom: var(--size-l);
  }
  div {
    margin-bottom: var(--size-m);
  }
</style>

<section>
  <h1>Before you leave</h1>

  <p>
    Save your magic words. If you don't, you won't be able to log in with your
    user and you'll have to ask for a new invite. Your magic words are:
  </p>

  <p class="mnemonic">
    <CopyInput text={$mnemonic} />
  </p>

  <div>
    <label>
      I understand
      <input type="checkbox" bind:checked={understand} />
    </label>
  </div>
  <div>
    <button disabled={!understand} on:click={handleLogout}>Exit space</button>
    <a class="button neutral" href="#">Go back</a>
  </div>
</section>
