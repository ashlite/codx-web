

<script>
  import { page } from '$app/stores'
  import { shortcut } from '$lib/helper/shortcut'
  import TopNavbar from '$lib/components/molecule/TopNavbar.svelte'
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

  let navbarData = [
    {
      shortcut: 'Digit1',
      kbd: 1,
      href: '/app/inventory/purchase',
      name: 'Purchase'
    },{
      shortcut: 'Digit2',
      kbd: 2,
      href: '/app/inventory/report',
      name: 'Report'
    },{
      shortcut: 'Digit3',
      kbd: 3,
      href: `/app/inventory/movement`,
      name: 'Movement'
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