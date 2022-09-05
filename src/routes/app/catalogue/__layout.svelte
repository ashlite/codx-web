<script context="module">
  export async function load({ url }) {
    if (url.pathname === '/app/catalogue'){
      return {
        status: 307,
        redirect: '/app/catalogue/collection'
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
      href: '/app/catalogue/collection',
      name: 'Collection'
    },{
      shortcut: 'Digit2',
      kbd: 2,
      href: '/app/catalogue/product',
      name: 'Product'
    },{
      shortcut: 'Digit3',
      kbd: 3,
      href: '/app/catalogue/bgglibrary',
      name: 'BoardGameGeek'
    },
  ]
</script>

<div class='min-h-screen min-w-full relative'>
  <TopNavbar navData={navbarData} />
  <div class="relative m-6 z-0">
    <slot />
  </div>
</div>