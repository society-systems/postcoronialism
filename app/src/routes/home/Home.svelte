<script>
  import Jitsi from "./Jitsi.svelte";
  import Pad from "./Pad.svelte";
  import Invite from "./Invite.svelte";

  import { mnemonic, keyPair, publicKey, role, secrets } from "../../store";

  let name = "🤪🏺⛱🗿";
  $: {
    window.keyPair = $keyPair;
    window.publicKey = $publicKey;
    console.log($secrets);
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

  <p>Welcome back, your usermoji is {name}</p>
  <p>Your public key is {$publicKey}</p>
  <p>Your role is {$role}</p>

  <Invite />

  <section>
    <!--Jitsi {name} /-->
  </section>

  <section>
    <!--Pad {name} /-->
  </section>
</main>
