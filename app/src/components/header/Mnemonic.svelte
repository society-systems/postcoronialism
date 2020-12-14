<script>
  import { login } from "../../store";

  export let onReset;
  export let onError;

  let inputs = [, , , , , , , , , , , ,];
  let elements = [, , , , , , , , , , , ,];
  let values = [, , , , , , , , , , , ,];

  function onValue(event, index) {
    const words = values[index].split(" ").filter((x) => x);
    words.forEach((word, i) => {
      const pos = index + i;
      if (pos < values.length) {
        values[pos] = word;
        elements[pos].focus();
      }
    });
  }

  async function handleSubmit() {
    try {
      console.log(values);
      await login(values.join(" "));
    } catch (e) {
      console.error(e);
      onError(e.toString());
    }
  }
</script>

<style>
  input,
  button {
    width: 100%;
    margin-bottom: var(--size-m);
  }
</style>

<form on:submit|preventDefault={handleSubmit} on:reset={onReset}>
  {#each inputs as _, i}
    <input
      bind:this={elements[i]}
      bind:value={values[i]}
      on:input={(e) => onValue(e, i)} />
  {/each}
  <button type="submit">Submit</button>
  <hr />
  <button type="reset" class="neutral">Cancel</button>
</form>
