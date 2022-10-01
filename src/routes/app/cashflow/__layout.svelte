<script context="module">
  export async function load({ url }) {
    if (url.pathname === '/app/cashflow'){
      return {
        status: 307,
        redirect: '/app/cashflow/ledger'
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
      href: '/app/cashflow/ledger',
      name: 'Ledger'
    },{
      shortcut: 'Digit2',
      kbd: 2,
      href: '/app/cashflow/summary',
      name: 'Summary'
    },
  ]
</script>

<div class='min-h-screen min-w-full relative'>
  <TopNavbar navData={navbarData} />
  <div class="relative m-6 z-0">
    <slot />
  </div>
</div>