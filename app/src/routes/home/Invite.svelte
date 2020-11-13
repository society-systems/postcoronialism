<script>
  import { invite, uint8ArrayToHexString } from "../../crypto";
  import { keyPair } from "../../store";

  let invites = [];

  function generate(secretKey, isAdmin, n) {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    invites = [];

    for (let i = 0; i < n; i++) {
      const invitation = invite(secretKey, isAdmin, expiry);
      const hexInvite = uint8ArrayToHexString(invitation);
      invites.push(`${window.location.origin}/#/join/${hexInvite}`);
    }
  }

  function generateAdmin() {
    generate($keyPair.secretKey, true, 10);
  }

  function generateMember() {
    generate($keyPair.secretKey, false, 10);
  }
</script>

<p>
  Generate invites. An invite is valid for 7 days and can be used only once.
</p>
<button on:click={generateAdmin}>Generate invites for admin</button>
<button on:click={generateMember}>Generate invites for member</button>

<ul>
  {#each invites as i}
    <li><code>{i}</code></li>
  {/each}
</ul>
