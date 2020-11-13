<script>
  import { onMount } from "svelte";

  export let key;
  export let name;

  let element;

  onMount(() => {
    const domain = "meet.jit.si";
    const options = {
      roomName: key,
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

<div bind:this={element} />
<!--iframe
    title="Jitsi meeting"
    allow="camera; microphone; fullscreen; display-capture"
    src="https://meet.jit.si/{$space.jitsi}"
    style="height: 700px; width: 100%; border: 0px;">
  </iframe-->
