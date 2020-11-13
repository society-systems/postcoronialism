<script>
  import { onMount } from "svelte";
  import WaveSurfer from "wavesurfer";

  let waveform;

  onMount(() => {
    let wavesurfer = WaveSurfer.create({
      container: waveform,
    });
    wavesurfer.load(
      "http://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3"
    );
    wavesurfer.on("ready", function () {
      wavesurfer.play();
    });
  });
</script>

<style>
  h1,
  p {
    color: white;
    width: 60%;
  }

  h1 {
    font-weight: normal;
    font-size: 2rem;
  }

  p {
    font-size: 1.5rem;
  }

  .divider {
    font-size: var(--size-s);
  }
</style>

<div>
  <h1><strong>post</strong>coronialism</h1>

  <p class="divider">♡ ♥ ♠ ♣ © ☞ 〠♬♩ ♫ ☆ ☎ ■♪$☆●＋＊，＋◇◆</p>

  <p>
    is an open collective, study, solidarity and strategy group that commonly
    works on for the urgent spread of interdisciplinary care, the
    demilitarisation of the health education and labor sectors and the
    ecological, systematic and agnotological comorbitity of Capital.
  </p>

  <div id="waveform" bind:this={waveform} />
</div>
