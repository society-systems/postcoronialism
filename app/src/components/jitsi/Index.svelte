<script>
  import { onMount } from "svelte";

  export let name;
  export let key;
  export let detached = false;
  export let showPlaceholder = true;
  export let width = "100%";
  export let height = "500px";
  export let detachedWidth = "250px";
  export let detachedHeight = "250px";
  export let onLeave;

  let api;
  let jitsiElement;
  let tileView;

  $: currentHeight = detached ? detachedHeight : height;

  $: {
    if (api) {
      if (detached) {
        if (tileView) {
          api.executeCommand("toggleTileView");
        }
        jitsiElement.style.height = currentHeight;
        jitsiElement.querySelector("iframe").style.height = currentHeight;
      } else {
        jitsiElement.style.height = currentHeight;
        jitsiElement.querySelector("iframe").style.height = currentHeight;
      }
    }
  }

  function handleDetach() {
    detached = !detached;
  }

  function handleLeave() {
    api.executeCommand("hangup");
    if (onLeave) onLeave();
  }

  onMount(() => {
    function tileViewListener({ enabled }) {
      tileView = enabled;
    }

    const domain = "meet.jit.si";
    const options = {
      roomName: key,
      width,
      height,
      parentNode: jitsiElement,
      userInfo: {
        displayName: name,
      },
      configOverwrite: {
        prejoinPageEnabled: false,
      },
      interfaceConfigOverwrite: {
        HIDE_INVITE_MORE_HEADER: true,
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

<style>
  .meeting,
  .placeholder {
    background: darkslategray;
  }

  .detached .meeting {
    position: fixed;
    z-index: 1;
    bottom: var(--size-m);
    right: var(--size-m);
  }

  .placeholder {
    display: none;
  }

  .detached .placeholder {
    display: flex;
    color: var(--color-primary);
    background: var(--color-neutral);
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  ul {
    display: flex;
    justify-content: flex-end;
    margin: 0;
    padding: 0;
  }

  li {
    list-style-type: none;
    margin-left: var(--size-xs);
  }
</style>

<div class="container" class:detached>
  <div
    class="meeting"
    style="width: {detached ? detachedWidth : width}; height: {detached ? detachedHeight : height}">
    <div bind:this={jitsiElement} />
  </div>
  {#if showPlaceholder}
    <div class="placeholder" style="width: {width}; height: {height}">
      <p>The meeting room has been detached.</p>
      <button on:click={handleDetach}>Reattach</button>
    </div>
    <ul>
      <li>
        <button disabled={!api} on:click={handleLeave}>Leave Meeting</button>
      </li>
      <li><button disabled={!api} on:click={handleDetach}>Detach</button></li>
    </ul>
  {/if}
</div>
