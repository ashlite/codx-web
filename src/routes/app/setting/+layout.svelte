<script context="module">
  export async function load({ url }) {
    if (url.pathname === '/app/inventory'){
      return {
        status: 307,
        redirect: '/app/inventory/purchase'
      }
    } else {
      return {}
    }
  }
</script>

<script>
	import { goto } from '$app/navigation';
  import TopNavbar from '$lib/components/molecule/TopNavbar.svelte'
	import { onMount } from 'svelte';

  let navbarData = [
    {
      shortcut: 'Digit1',
      kbd: 1,
      href: '/app/setting/general',
      name: 'General'
    },{
      shortcut: 'Digit2',
      kbd: 2,
      href: '/app/setting/forex',
      name: 'Forex'
    }
  ]

  onMount(() => {
    const access = JSON.parse(localStorage.access)
    const level = localStorage.level
    if (!access.setting.root && level < 20) goto('/unauthorized')
  })
</script>

<div class='min-h-screen min-w-full relative'>
  <TopNavbar navData={navbarData}/>
  <div class="relative m-6 z-0">
    <slot />
  </div>
</div>