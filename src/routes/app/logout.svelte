<script context="module">
  import Cookies from 'js-cookie'
  import { logout } from '$lib/api'
  export async function load() {
    await logout()
    Cookies.remove('codx_token')
  
    return {
      status: 307,
      redirect : '/'
    }
  }
</script>