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
  import TopNavbar from '$lib/components/molecule/TopNavbar.svelte'

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
</script>

<div class='min-h-screen min-w-full relative'>
  <TopNavbar navData={navbarData}/>
  <div class="relative m-6 z-0">
    <slot />
  </div>
</div>