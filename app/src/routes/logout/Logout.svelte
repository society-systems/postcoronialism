<script>
  import { mnemonic, logout } from "../../store";
  import { push } from "svelte-spa-router";

  function handleLogout() {
    logout();
    push("/");
  }
</script>

<p>
  Important: save your magic words to be able to join the space later. If you
  don't do that, you won't be able to log in with your user and you'll have to
  ask for a new invite.
</p>

<p>Your magic words are:</p>

<p><code>{$mnemonic}</code></p>

<button on:click={handleLogout}>I saved my magic words and I'm ready to leave
  this space</button>
or
<a href="#">Go back</a>
