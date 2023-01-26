<script context="module">
  import Cookies from 'js-cookie'
  import { logout } from '$lib/helper/api'
  import { session } from '$app/stores'
  export async function load() {
    await logout()
    Cookies.remove('codx_token')
    session.user = null
    return {
      status: 307,
      redirect : '/unauthorized'
    }
  }
</script>