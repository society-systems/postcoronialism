<script>
  import { space } from "../../store";
  import Welcome from "./Welcome.svelte";
  import Pad from "../../components/Pad.svelte";
  import Posts from "../../components/forum/Posts.svelte";
</script>

{#if $space === false}
  <Welcome />
{:else}
  <section>
    <Pad name={$space.name} key={$space.etherpadKey} />
  </section>
  <section>
    <h1>Discussions</h1>
    <a href="#/forum/new" class="button">New Post</a>
    <Posts />
  </section>
{/if}
