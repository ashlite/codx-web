

<script>
	import { goto } from '$app/navigation';

  import TopNavbar from '$lib/components/molecule/TopNavbar.svelte'
	import { onMount } from 'svelte';
  let navbarData = [
    {
      shortcut: 'Digit1',
      kbd: 1,
      href: '/app/cashflow/ledger',
      name: 'Ledger'
    },{
      shortcut: 'Digit2',
      kbd: 2,
      href: '/app/cashflow/summary',
      name: 'Summary'
    },
  ]

  onMount(() => {
    const access = JSON.parse(localStorage.access)
    const level = localStorage.level
    if (!access.cashflow.root && level < 20) goto('/unauthorized')
  })
</script>

<div class='min-h-screen min-w-full relative'>
  <TopNavbar navData={navbarData} />
  <div class="relative m-6 z-0">
    <slot />
  </div>
</div>