<script>
  import { onMount } from "svelte";
  import { space } from "./store";

  export let name;
  let element;

  onMount(() => {
    return;
    const domain = "meet.jit.si";
    const options = {
      roomName: "postcoronialism",
      width: "100%",
      height: "700px",
      parentNode: element,
      userInfo: {
        displayName: name,
      },
    };
    const api = new JitsiMeetExternalAPI(domain, options);
    window.jitsiAPI = api;
  });
</script>

<!--div bind:this={element} /-->
{#if $space && $space.jitsi}
  <!--iframe
    title="Jitsi meeting"
    allow="camera; microphone; fullscreen; display-capture"
    src="https://meet.jit.si/{$space.jitsi}"
    style="height: 700px; width: 100%; border: 0px;">
  </iframe-->
{/if}
