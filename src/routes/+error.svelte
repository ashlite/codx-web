<script context="module">
  throw new Error("@migration task: Replace error load function (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3293209)");

  // export function load({ error, status }) {
  //   return {
  //     props: {
  //       code: `${status}`,
  //       message: `${error.message}`
  //     }
  //   };
  // }
</script>

<script>
  export let code, message
</script>

<svelte:head>
  <title>Page Error</title>
</svelte:head>

<div class="hero min-h-screen bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-lg">
      <h1 class="text-9xl font-bold text-error">{code}</h1>
      <h2 class="text-2xl font-bold text-error">{message}</h2>
      <p class="py-6">Telah terjadi error, silahkan tekan tombol dibawah untuk kembali ke Home</p>
      <a href='/' class="btn btn-primary">Kembali ke home</a>
    </div>
  </div>
</div>