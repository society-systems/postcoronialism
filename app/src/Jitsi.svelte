<script>
  import { onMount } from "svelte";
  import { secrets } from "./store";

  //  export let name;
  //  let element;

  //  onMount(()=> {
  //    const domain = 'meet.jit.si';
  //    const options = {
  //        roomName: 'postcoronialism',
  //        width: "100%",
  //        height: "700px",
  //        parentNode: element,
  //        userInfo: {
  //          displayName: name
  //        }
  //    };
  //    const api = new JitsiMeetExternalAPI(domain, options);
  //  });
</script>

<!--div bind:this={element} /-->
{#if $secrets && $secrets.jitsi}
  <iframe
    title="Jitsi meeting"
    allow="camera; microphone; fullscreen; display-capture"
    src="https://meet.jit.si/{$secrets.jitsi}"
    style="height: 700px; width: 100%; border: 0px;">
  </iframe>
{/if}
