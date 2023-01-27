<script>
  import {page} from '$app/stores'
</script>

<svelte:head>
  <title>Page Error</title>
</svelte:head>

<div class="hero min-h-screen bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-lg">
      <h1 class="text-9xl font-bold text-error">{$page.status}</h1>
      <h2 class="text-2xl font-bold text-error">{$page.error.message}</h2>
      <p class="py-6">Telah terjadi error, silahkan tekan tombol dibawah untuk kembali ke Home</p>
      <a href='/' class="btn btn-primary">Kembali ke home</a>
    </div>
  </div>
</div>