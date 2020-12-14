<script>
  import Audio from "./Audio.svelte";
</script>

<style>
  .logo {
    font-weight: normal;
    font-size: 2rem;
  }
  h1,
  p {
    color: white;
  }
  @media screen and (min-width: 768px) {
    p {
      width: 60%;
    }
  }
  .divider {
    font-size: 1rem;
  }
  .banner {
    flex: 1;
  }
</style>

<section class="banner">
  <h1 class="logo"><strong>post</strong>coronialism</h1>

  <p class="divider">.--. --- ... - -.-. --- .-. --- -. .. .- .-.. .. ... --</p>

  <p>
    is an open collective, study, solidarity and strategy group that commonly
    works on for the urgent spread of interdisciplinary care, the
    demilitarisation of the health education and labor sectors and the
    ecological, systematic and agnotological comorbidity of Capital.
  </p>
</section>

<section class="audio">
  <Audio />
</section>
