

<script>
	import { goto } from '$app/navigation';
  import TopNavbar from '$lib/components/molecule/TopNavbar.svelte'
	import { onMount } from 'svelte';

  let navbarData = [
    {
      shortcut: 'Digit1',
      kbd: 1,
      href: '/app/crm/customer',
      name: 'Customer'
    },{
      shortcut: 'Digit2',
      kbd: 2,
      href: '/app/crm/supplier',
      name: 'Supplier'
    },{
      shortcut: 'Digit3',
      kbd: 3,
      href: '/app/crm/venue',
      name: 'Venue'
    },
  ]

  onMount(() => {
    const access = JSON.parse(localStorage.access)
    const level = localStorage.level
    if (!access.crm.root && level < 20) goto('/unauthorized')
  })
</script>

<div class='min-h-screen min-w-full relative'>
  <TopNavbar navData={navbarData} />
  
  <div class="relative m-6 z-0">
    <slot />
  </div>
</div>