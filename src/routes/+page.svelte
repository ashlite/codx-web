<script>
  import { onMount } from 'svelte'
  // import { session } from '$app/stores'
  import { goto } from '$app/navigation'
  import { RingLoader } from 'svelte-loading-spinners'
  import * as jose from 'jose'
  export let data

  let gsiReady = false
  let mounted = false
  let loginProcess = false

  function gsiLoaded(){
    gsiReady = true
    if (mounted && !data.user){
      displayGsi()
    }
  }

  onMount(() => {
    mounted = true
    if (gsiReady && !data.user) {
      displayGsi()
    }
  })

  function displayGsi(){
    google.accounts.id.initialize({
      client_id: "343313188023-pmn379a74r9vg95gq0nkh2mfs2qoehln.apps.googleusercontent.com",
      callback: handleCredentialResponse,
      cancel_on_tap_outside: false,
    })
    google.accounts.id.renderButton(
      document.getElementById("googleButton"),
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  async function handleCredentialResponse(response) {
    loginProcess = true
    let responseXdocToken = await fetch(`/login`,{
      method: 'POST',
      body: JSON.stringify({
        id_token: response.credential 
      }),
      withCredentials: true
    })
    let responseJson = await responseXdocToken.json()
    console.log(responseJson)
    if (responseXdocToken.status === 200){
      if (responseJson.user_level > 0) {
        localStorage.access = JSON.stringify(responseJson.access)
        localStorage.level = responseJson.user_level
        // const claims = jose.decodeJwt(responseJson.forwardBody.access_token)
        // $session.user = {
        //   name: claims.name,
        //   email: claims.email,
        //   avatar: claims.avatar,
        //   level: claims.level,
        // }
        goto('/app')
      } else {
        goto('/unauthorized')
      } 
    }
  }

</script>

<svelte:head>
  <script src="https://accounts.google.com/gsi/client" async defer on:load={gsiLoaded()}></script>
</svelte:head>

<div class="hero min-h-screen bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-lg min-w-lg">
      {#if loginProcess}
        <RingLoader size="200" color="#FF3E00" unit="px" duration="2s"/>
      {:else}
        <h1 class="text-6xl font-bold">Codx Web</h1>
        <p class="py-6">Aplikasi codx internal, khusus untuk karyawan yang memiliki hak akses. Silahkan pilih user google yang mau anda gunakan untuk login.</p>
        {#if data.user}
          <button class="btn btn-secondary" on:click={() => goto('/app')}>Go to App</button>
        {:else}
          <div class="flex w-full justify-center">
            <div id="googleButton" class="bg-transparent" />
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div>
<svg class="-mt-32 waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
  <defs>
    <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
  </defs>
  <g class="parallax">
    <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
    <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
    <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
    <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
  </g>
</svg>

<style>
  .waves {
    position:relative;
    width: 100%;
    height:15vh;
    margin-bottom:-7px; /*Fix for safari gap*/
    min-height:100px;
    max-height:150px;
  }

  .content {
    position:relative;
    height:20vh;
    text-align:center;
    background-color: white;
  }

  /* Animation */

  .parallax > use {
    animation: move-forever 25s cubic-bezier(.55,.5,.45,.5)     infinite;
  }
  .parallax > use:nth-child(1) {
    animation-delay: -2s;
    animation-duration: 7s;
  }
  .parallax > use:nth-child(2) {
    animation-delay: -3s;
    animation-duration: 10s;
  }
  .parallax > use:nth-child(3) {
    animation-delay: -4s;
    animation-duration: 13s;
  }
  .parallax > use:nth-child(4) {
    animation-delay: -5s;
    animation-duration: 20s;
  }
  @keyframes move-forever {
    0% {
    transform: translate3d(-90px,0,0);
    }
    100% { 
      transform: translate3d(85px,0,0);
    }
  }
  /*Shrinking for mobile*/
  @media (max-width: 768px) {
    .waves {
      height:40px;
      min-height:40px;
    }
    .content {
      height:30vh;
    }
    h1 {
      font-size:24px;
    }
  }
</style>
