<script>
  import { onMount } from 'svelte';

  export let name;
  let element;

  onMount(()=> {
    const domain = 'meet.jit.si';
    const options = {
        roomName: 'postcoronialism',
        width: "100%",
        height: "700px",
        parentNode: element,
        userInfo: {
          displayName: name
        }
    };
    const api = new JitsiMeetExternalAPI(domain, options);
  });
</script>

<div bind:this={element} />
