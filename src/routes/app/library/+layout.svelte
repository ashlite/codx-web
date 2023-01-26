<script context="module">
  export async function load({ url }) {
    if (url.pathname === '/app/library'){
      return {
        status: 307,
        redirect: '/app/library/dashboard'
      }
    } else {
      return {}
    }
  }
</script>

<script>
  import TopNavbar from '$lib/components/molecule/TopNavbar.svelte'
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

  let navbarData = [
    {
      shortcut: 'Digit1',
      kbd: 1,
      href: '/app/library/dashboard',
      name: 'Dashboard'
    },{
      shortcut: 'Digit2',
      kbd: 2,
      href: '/app/library/history',
      name: 'History'
    },{
      shortcut: 'Digit3',
      kbd: 3,
      href: `/app/library/pricegroup`,
      name: 'Price Group'
    },{
      shortcut: 'Digit4',
      kbd: 4,
      href: `/app/library/card`,
      name: 'Card Admin'
    },
  ]

  onMount(() => {
    const access = JSON.parse(localStorage.access)
    const level = localStorage.level
    if (!access.inventory.root && level < 20) goto('/unauthorized')
  })
</script>

<div class='min-h-screen min-w-full relative'>
  <TopNavbar navData={navbarData}/>
  <div class="relative m-6 z-0">
    <slot />
  </div>
</div>