<script>
  import { space, inMeeting } from "../store";
  import { location } from "svelte-spa-router";
  import Jitsi from "./jitsi";

  let width = "100%";
  let height = "500px";
  let detachedWidth = "250px";
  let detachedHeight = "150px";

  $: show = $space && ["/", "/admin"].includes($location);
  $: detached = $location === "/admin";
  $: showPlaceholder = $location === "/";

  function handleJoin() {
    $inMeeting = true;
  }

  function onLeave() {
    $inMeeting = false;
  }
</script>

<style>
  section {
    margin-bottom: var(--size-l);
  }
  .placeholder {
    background-color: var(--color-secondary);
    display: flex;
    padding: var(--size-xl);
    flex-direction: column;
    justify-content: space-evenly;
  }
  h1 {
    font-size: 10rem;
    font-weight: normal;
    color: var(--color-tertiary);
    margin: 0 0 0 4rem;
    text-indent: -4rem;
    line-height: 0.6;
  }
  h1 strong {
    display: block;
  }
  button {
    background-color: var(--color-tertiary);
    color: var(--color-secondary);
    display: block;
    margin: 0 auto;
  }
</style>

{#if show}
  {#if $inMeeting}
    <section>
      <Jitsi
        name={$space.name}
        key={$space.jitsiKey}
        {detached}
        {showPlaceholder}
        {width}
        {height}
        {detachedWidth}
        {detachedHeight}
        {onLeave} />
    </section>
  {:else if showPlaceholder}
    <section>
      <div class="placeholder" style="width: {width}; height: {height}">
        <h1><strong>post-</strong>coronialism</h1>
        <div><button on:click={handleJoin}>Join meeting</button></div>
      </div>
    </section>
  {/if}
{/if}
