<script>
  export let text;
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
  div {
    display: flex;
  }
  input {
    flex: 1;
  }
</style>

<div>
  <input class:neutral={copied} bind:this={input} type="text" value={text} />
  <button class:neutral={copied} on:click={() => handleCopy()}>Copy</button>
</div>
