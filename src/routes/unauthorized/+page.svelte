<script>
import { onMount } from "svelte"
import Cookie from 'js-cookie'

  onMount(async () => {
    Cookie.remove('g_state')
  })
</script>

<div class="hero min-h-screen bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-lg">
      <h1 class="text-6xl font-bold text-error">UNAUTHORIZED ACCESS</h1>
      <p class="py-6">Akun anda tidak mendapatkan izin untuk mengakses aplikasi. Jika anda baru saja bergabung dengan aplikasi ini, silahkan tunggu admin untuk melakukan verifikasi akun anda.</p>
      <a href='/' class="btn btn-primary">Kembali ke home</a>
    </div>
  </div>
</div>