<script>
  import { fade } from "svelte/transition";

  import { invite, uint8ArrayToHexString } from "../../crypto";
  import { keyPair } from "../../store";
  import InviteItem from "./InviteItem.svelte";

  let memberInvites = [];
  let adminInvites = [];

  generateMember(1);
  generateAdmin(1);

  function generate(secretKey, isAdmin, n) {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    const invites = [];

    for (let i = 0; i < n; i++) {
      const invitation = invite(secretKey, isAdmin, expiry);
      const hexInvite = uint8ArrayToHexString(invitation);
      invites.push(`${window.location.origin}/#/join/${hexInvite}`);
    }
    return invites;
  }

  function generateAdmin(n = 5) {
    adminInvites = [...adminInvites, ...generate($keyPair.secretKey, true, n)];
  }

  function generateMember(n = 5) {
    memberInvites = [
      ...memberInvites,
      ...generate($keyPair.secretKey, false, n),
    ];
  }
</script>

<style>
  ul {
    margin: var(--size-m) 0 0 0;
    padding: 0;
  }
  li {
    list-style-type: none;
    display: flex;
    margin-bottom: var(--size-m);
  }
</style>

<h1>Invite people to join this space</h1>

<p>
  To invite a new member, copy one of the links below and share it via email or
  messenger. An invite is valid for 7 days and can be used only once. You can
  generate as many invites you need.
</p>

<h2>Invite members</h2>

<p>Members can join video calls, edit the shared pad, and post in the forum.</p>

<ul>
  {#each memberInvites as invite}
    {#key invite}
      <li in:fade>
        <InviteItem {invite} />
      </li>
    {/key}
  {/each}
</ul>

<button on:click={() => generateMember()}>I need more invites</button>

<h2>Invite members with admin powers</h2>

<p>Members with admin powers can invite new people.</p>

<ul>
  {#each adminInvites as invite}
    {#key invite}
      <li in:fade>
        <InviteItem {invite} />
      </li>
    {/key}
  {/each}
</ul>
<button on:click={() => generateAdmin()}>I need more invites</button>
