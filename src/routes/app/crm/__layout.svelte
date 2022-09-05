<script context="module">
  export async function load({ url }) {
    if (url.pathname === '/app/crm'){
      return {
        status: 307,
        redirect: '/app/crm/customer'
      }
    } else {
      return {}
    }
  }
</script>

<script>
  import TopNavbar from '$lib/components/molecule/TopNavbar.svelte'

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
</script>

<div class='min-h-screen min-w-full relative'>
  <TopNavbar navData={navbarData} />
  
  <div class="relative m-6 z-0">
    <slot />
  </div>
</div>