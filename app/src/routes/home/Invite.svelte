<script>
  import { invite, USER_ROLE, uint8ArrayToHexString } from "../../crypto";
  import { keyPair } from "../../store";

  let invites = [];

  function generate() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    const invitation = invite($keyPair.secretKey, USER_ROLE.member, expiry);
    const hexInvite = uint8ArrayToHexString(invitation);
    invites = [`${window.location.origin}/#/join/${hexInvite}`];
  }
</script>

<button on:click={generate}>Generate invite</button>

<ul>
  {#each invites as i}
    <li>{i}</li>
  {/each}
</ul>
