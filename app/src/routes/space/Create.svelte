<script>
  import { createSpace } from "../../store";

  export let spaceName;
  let userName = "";

  function handleCreateSpace() {
    createSpace(spaceName, userName);
  }
</script>

<form on:submit|preventDefault={handleCreateSpace}>
  <input bind:value={userName} />
  <button>Claim this space</button>
</form>
