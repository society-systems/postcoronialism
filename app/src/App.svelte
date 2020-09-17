<script>
  import Jitsi from './Jitsi.svelte';
  import Pad from './Pad.svelte';

  let name = "🤪🏺⛱🗿";
</script>

<style>
  main {
    max-width: 1024px;
    margin: 0 auto;
  }

  section {
    margin-bottom: 40px;
  }
</style>

<main>
	<h1>postcoronialism v0</h1>

  <p>Welcome back, your usermoji is {name}</p>

  <section>
    <Jitsi {name} />
  </section>

  <section>
    <Pad {name} />
  </section>

</main>
