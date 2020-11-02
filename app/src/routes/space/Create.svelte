<script>
  import { createSpace } from "../../store";

  export let spaceName;
  let userName = "";
  let isPublic = false;

  function handleCreateSpace() {
    createSpace(spaceName, userName);
  }
</script>

<h1>The space "{spaceName}" is available and you can claim it</h1>

<p>
  <em>[This is a wip. Text will be changed later]</em>
  By claming this space you will become the admin of it. As an admin, you can
  add other admins and members. Other important info:
</p>

<ul>
  <li>Every space is <strong>invite-only</strong>.</li>
  <li>A space can be private or public.</li>
  <li />
</ul>

<p>You need to provide few details before claiming this space. Note that</p>
<form on:submit|preventDefault={handleCreateSpace}>
  <label>
    <p>Your pseudoname</p>
    <input bind:value={userName} />
  </label>
  <label>
    <p>Is this space public?</p>
    <input bind:value={isPublic} type="checkbox" />
  </label>
  <button>Claim this space</button>
</form>
