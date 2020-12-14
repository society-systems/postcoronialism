<script>
  import { onMount } from "svelte";
  import WaveSurfer from "wavesurfer.js";

  let waveform;
  let audioPlayer;
  let showPause;

  function onClick(e) {
    audioPlayer.playPause();
  }

  function onAudioPlay(e) {
    showPause = audioPlayer.isPlaying();
  }

  function onAudioPause(e) {
    showPause = audioPlayer.isPlaying();
  }

  function onAudioSeek(e) {
    if (audioPlayer.isPlaying()) {
      audioPlayer.play();
    }
  }

  onMount(() => {
    function onAudioReady() {
      audioPlayer = wavesurfer;
    }

    let wavesurfer = WaveSurfer.create({
      container: waveform,
      barWidth: 2,
      barHeight: 1,
      barGap: null,
      responsive: true,
      hideScrollbar: true,
      cursorWidth: 0,
      waveColor: "#f96400",
      progressColor: "#e1fe6e",
      normalize: true,
      height: 64,
    });
    wavesurfer.load("./assets/audio/welcome.mp3");
    wavesurfer.on("ready", onAudioReady);
    wavesurfer.on("play", onAudioPlay);
    wavesurfer.on("pause", onAudioPause);
    wavesurfer.on("seek", onAudioSeek);
    return () => {
      wavesurfer.un("ready", onAudioReady);
      wavesurfer.un("play", onAudioPlay);
      wavesurfer.un("pause", onAudioPause);
      wavesurfer.un("seek", onAudioSeek);
    };
  });
</script>

<style>
  .container {
    display: flex;
  }
  .controls {
    background: linear-gradient(
      90deg,
      var(--color-tertiary) 60%,
      rgba(255, 255, 255, 0) 100%
    );
    color: var(--color-secondary);
    padding: 0 1rem;
    text-align: left;
    flex: 1;
    display: flex;
    align-items: center;
  }
  .controls button {
    --size: 0.8rem;
    width: calc(1.8 * var(--size));
    height: calc(1.8 * var(--size));
    border-color: transparent transparent transparent var(--color-secondary);
    border-width: var(--size) 0 var(--size) calc(1.8 * var(--size));
    border-style: solid;
    padding: 0;
    background-color: transparent;
    transition: 100ms all ease;
    will-change: border-width;
  }
  .controls button.paused {
    border-style: double;
    border-width: 0px 0 0px calc(1.8 * var(--size));
  }
  .waveform {
    flex: 1;
  }
  @media screen and (max-width: 767px) {
    .controls {
      max-width: 20%;
    }
  }
</style>

<div class="container">
  <div class="controls">
    <button
      class:paused={showPause}
      on:click={onClick}
      disabled={!audioPlayer} />
  </div>
  <div id="waveform" class="waveform" bind:this={waveform} />
</div>
