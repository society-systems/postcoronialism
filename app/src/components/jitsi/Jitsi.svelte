<script>
  import { onMount } from "svelte";

  export let key;
  export let name;
  export let height = "500px";
  export let detachedHeight = "250px";
  export let detached = false;

  let api;
  let element;
  let tileView;

  $: currentHeight = detached ? detachedHeight : height;

  $: {
    if (api) {
      if (detached) {
        if (tileView) {
          api.executeCommand("toggleTileView");
        }
        element.querySelector("iframe").style.height = currentHeight;
      } else {
        element.querySelector("iframe").style.height = currentHeight;
      }
    }
  }

  onMount(() => {
    function tileViewListener({ enabled }) {
      console.log("asdfasdf", enabled);
      tileView = enabled;
    }

    const domain = "meet.jit.si";
    const options = {
      roomName: key,
      width: "100%",
      height,
      parentNode: element,
      userInfo: {
        displayName: name,
      },
      configOverwrite: {
        prejoinPageEnabled: false,
      },
      interfaceConfigOverwrite: {
        HIDE_INVITE_MORE_HEADER: true,
        SHOW_CHROME_EXTENSION_BANNER: false,
        TOOLBAR_BUTTONS: [
          "microphone",
          "camera",
          "closedcaptions",
          "desktop",
          "embedmeeting",
          "fullscreen",
          "fodeviceselection",
          //"hangup",
          //"profile",
          "chat",
          //"recording",
          //"livestreaming",
          "etherpad",
          "sharedvideo",
          "settings",
          "raisehand",
          "videoquality",
          "filmstrip",
          "feedback",
          "stats",
          "shortcuts",
          "tileview",
          "videobackgroundblur",
          "download",
          "help",
          "mute-everyone",
          //"security",
        ],
      },
    };
    api = new JitsiMeetExternalAPI(domain, options);
    api.executeCommand("toggleTileView");
    api.addEventListener("tileViewChanged", tileViewListener);
    window.jitsiAPI = api;

    return () => {
      api.removeEventListener("tileViewListener", tileViewListener);
    };
  });
</script>

<div bind:this={element} />
<!--iframe
    title="Jitsi meeting"
    allow="camera; microphone; fullscreen; display-capture"
    src="https://meet.jit.si/{$space.jitsi}"
    style="height: 700px; width: 100%; border: 0px;">
  </iframe-->
