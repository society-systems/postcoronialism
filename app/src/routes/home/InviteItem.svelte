<script>
  export let invite;
  let input;
  let copied;

  function handleCopy() {
    input.select();
    document.execCommand("copy");
    input.blur();
    copied = true;
  }
</script>

<style>
  input {
    flex: 1;
  }
</style>

<input class:neutral={copied} bind:this={input} type="text" value={invite} />
<button class:neutral={copied} on:click={() => handleCopy()}>Copy</button>
