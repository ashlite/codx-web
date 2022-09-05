<script>
  import { page } from '$app/stores'
  import { shortcut } from '$lib/helper/shortcut'
  import ToggleMenuDrawer from '$lib/components/atom/ToggleMenuDrawer.svelte'
  export let navData

</script>

<div class="navbar fixed top-0 bg-base-200 z-10">
  <div class="navbar-start">
    <ul class="menu menu-horizontal gap-4 p-0">
      <li>
        <ToggleMenuDrawer />
      </li>
      {#each navData as nav}
        <li>
          <a sveltekit:prefetch use:shortcut={{alt:true, shift:true, code: nav.shortcut }} href={nav.href} class={$page.url.pathname.includes(`${nav.href}`) ? "active" : ""}>
            {nav.name}
            <kbd class="kbd kbd-xs text-base-content">{nav.kbd}</kbd>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</div>
<br>
<br>