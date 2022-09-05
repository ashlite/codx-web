<script context="module">
  export async function load({ url }) {
    if (url.pathname === '/app/crm'){
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
  import { page } from '$app/stores'
  import { shortcut } from '$lib/helper/shortcut'
  import TopNavbar from '$lib/components/molecule/TopNavbar.svelte'

  let navbarData = [
    {
      shortcut: 'Digit1',
      kbd: 1,
      href: '/app/inventory/purchase',
      name: 'Stock Purchase'
    },{
      shortcut: 'Digit2',
      kbd: 2,
      href: '/app/inventory/report',
      name: 'Inventory Report'
    },{
      shortcut: 'Digit3',
      kbd: 3,
      href: '/app/inventory/movement',
      name: 'Inventory Movement'
    },
  ]
</script>

<div class='min-h-screen min-w-full relative'>
  <TopNavbar navData={navbarData}/>
  <div class="relative m-6 z-0">
    <slot />
  </div>
</div>