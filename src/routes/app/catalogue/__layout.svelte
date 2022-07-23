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
  import { page } from '$app/stores'
  import { shortcut } from '$lib/shortcut'
</script>

<div class='min-h-screen min-w-full relative'>
  <div class="navbar fixed top-0 bg-base-200 z-10">
    <div class="navbar-start">
      <ul class="menu menu-horizontal gap-4 p-0">
        <li>
          <a sveltekit:prefetch use:shortcut={{alt:true, shift:true, code:'Digit1' }} href="/app/catalogue/collection" class={$page.url.pathname.includes('/collection') ? "active" : ""}>
            Collection
            <kbd class="kbd kbd-xs text-base-content">1</kbd>
          </a>
        </li>
        <li>
          <a sveltekit:prefetch use:shortcut={{alt:true, shift:true, code:'Digit2' }} href="/app/catalogue/product" class={$page.url.pathname.includes('/product') ? "active" : ""}>
            Product
            <kbd class="kbd kbd-xs text-base-content">2</kbd>
          </a>
        </li>
        <li>
          <a sveltekit:prefetch use:shortcut={{alt:true, shift:true, code:'Digit3' }} href="/app/catalogue/bgglibrary" class={$page.url.pathname.includes('/bgglibrary') ? "active" : ""}>
            BoardGameGeek
            <kbd class="kbd kbd-xs text-base-content">3</kbd>
          </a>
        </li>
      </ul>
    </div>
  </div>
  <br>
  <br>
  <div class="relative m-6 z-0">
    <slot />
  </div>
</div>