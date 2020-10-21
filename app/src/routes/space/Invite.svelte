<script>
  import { invite, USER_ROLE, uint8ArrayToHexString } from "../../crypto";
  import { keyPair } from "../../store";

  let invites = [];

  function generate(secretKey, role, n) {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    invites = [];

    for (let i = 0; i < n; i++) {
      const invitation = invite(secretKey, role, expiry);
      const hexInvite = uint8ArrayToHexString(invitation);
      invites.push(`${window.location.origin}/#/join/${hexInvite}`);
    }
  }

  function generateAdmin() {
    generate($keyPair.secretKey, USER_ROLE.admin, 10);
  }

  function generateMember() {
    generate($keyPair.secretKey, USER_ROLE.member, 10);
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
