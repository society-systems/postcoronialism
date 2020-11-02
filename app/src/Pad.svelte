<script>
  export let key;
  export let name;
  $: {
    console.log("key is", key);
  }
</script>

<iframe
  title="Collaborative pad"
  src="https://pad.riseup.net/p/{key}?userName={name}"
  width="100%"
  height="400" />
