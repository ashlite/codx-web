<script>
  import { onMount } from 'svelte'
  import { session } from '$app/stores'
  import { goto } from '$app/navigation'
  import { RingLoader } from 'svelte-loading-spinners'
  import Cookie from 'js-cookie'
  import * as jose from 'jose'
  let gsiReady = false
  let mounted = false
  let loginProcess = false

  function gsiLoaded(){
    gsiReady = true
    if (mounted && !session.user){
      displayGsi()
    }
  }

  onMount(() => {
    mounted = true
    if (gsiReady && !session.user) {
      displayGsi()
    }
  })

  function displayGsi(){
    google.accounts.id.initialize({
      client_id: "343313188023-pmn379a74r9vg95gq0nkh2mfs2qoehln.apps.googleusercontent.com",
      callback: handleCredentialResponse,
      cancel_on_tap_outside: false,
    })
    google.accounts.id.prompt()
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
      if (responseJson.forwardBody.user_level > 0) {
        Cookie.remove('g_state')
        const claims = jose.decodeJwt(responseJson.forwardBody.access_token)
        $session.user = {
          name: claims.name,
          email: claims.email,
          avatar: claims.avatar,
          level: claims.level,
        }
        goto('/app')
      } else {
        goto('/unauthorized')
      } 
    }
  }

</script>

<svelte:head>
  <script src="https://accounts.google.com/gsi/client" async defer on:load={gsiLoaded}></script>
</svelte:head>

<div class="hero min-h-screen bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-lg">
      {#if loginProcess}
        <RingLoader size="200" color="#FF3E00" unit="px" duration="2s"/>
      {:else}
        <h1 class="text-6xl font-bold">Codx Web</h1>
        <p class="py-6">Aplikasi codx internal, khusus untuk karyawan yang memiliki hak akses.</p>
        <p class="py-6">Silahkan pilih user google yang mau anda gunakan untuk login, jika tidak silahkan tekan tombol dibawah.</p>
        {#if $session.user}
          <button class="btn btn-secondary" on:click={() => goto('/app')}>Go to App</button>
        {:else}
          <button class="btn btn-primary" on:click={() => displayGsi()}>Sign In / Sign Up</button>
        {/if}
      {/if}
    </div>
  </div>
</div>