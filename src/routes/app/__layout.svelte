<script context="module">
	export function load({ session }) {
		if (!session.user) {
			return {
				status: 307,
				redirect: `/unauthorized`
			}
		}
		return {
      status: 200,
      props:{
        user: session.user
      }
    }
	}
</script>

<script>
  export let user
  import { page } from '$app/stores'
  import ToastAlert from '$lib/components/organism/ToastAlert.svelte'
  import GlobalModal from '$lib/components/organism/GlobalModal.svelte'
  import { toggleMainDrawer } from '$lib/helper/store'
  import { fly } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'
</script>

<ToastAlert />
<GlobalModal />

<div class="flex flex-row flex-nowrap w-screen max-h-screen fixed">
  {#if $toggleMainDrawer}
  <div id="sidebar" class="indicator" transition:fly="{{delay: 250, duration: 400, x: -200, opacity: 0, easing: quintOut}}">
    <div class="bg-base-300">
      <ul class="menu p-4 overflow-y-auto w-80 bg-base-300 text-base-content">
        <div class="flex flex-row my-4">
          <div class="basis-1/4">
            <div class="avatar">
              <div class="w-16 rounded-full">
                <img src={`https://avatars.dicebear.com/api/adventurer-neutral/${user.name}.svg`} alt="user avatar"/>
              </div>
            </div>
          </div>
          <div class="basis-3/4 ml-4">
            <div class="text-md">{user.name}</div>
            <div class="text-xs font-bold text-primary">{user.email}</div>
            <a class="btn btn-accent btn-xs text-xs font-bold" href="/app/logout">LOGOUT</a>
          </div>
        </div>
        <div class="bg-warning text-neutral p-2 font-bold" >Shortcut: 
          <kbd class="kbd kbd-xs text-base-content">Alt</kbd>
          +
          <kbd class="kbd kbd-xs text-base-content">Shift</kbd>
          +
          <kbd class="kbd kbd-xs text-base-content">...</kbd>
        </div>
        <div class="form-control w-full max-w-xs mb-8" id="theme-selector">
          <label class="label" for="theme-selector" >
            <span class="label-text">Theme Selector</span>
          </label>
          <select data-choose-theme class="select select-bordered w-full max-w-xs select-sm">
            <option value="halloween">Halloween</option>
            <option value="dracula">Dracula</option>
            <option value="luxury">Luxury</option>
            <option value="cupcake">Cupcake</option>
            <option value="retro">Retro</option>
            <option value="autumn">Autumn</option>
          </select>
        </div>
        <li><a sveltekit:prefetch href='/app/catalogue/collection' class={$page.url.pathname.includes('/catalogue') ? "active" : ""}>Catalogue</a></li>
        <li><a sveltekit:prefetch href='/app/crm/customer' class={$page.url.pathname.includes('/crm') ? "active" : ""}>CRM</a></li>
        <li><a sveltekit:prefetch href='/app/inventory' class={$page.url.pathname.includes('/inventory') ? "active" : ""}>Inventory</a></li>
        <li><a sveltekit:prefetch href='/app/cashflow' class={$page.url.pathname.includes('/cashflow') ? "active" : ""}>Cashflow</a></li>
        <li><a sveltekit:prefetch href='/app/setting' class={$page.url.pathname.includes('/setting') ? "active" : ""}>Setting</a></li>
        <li><a sveltekit:prefetch href='/app/access' class={$page.url.pathname.includes('/access') ? "active" : ""}>User & Access</a></li>
      </ul>
    </div>
  </div>
  {/if}
  <div id="content" class="flex flex-col items-center justify-center overflow-y-auto grow">
    <!-- Page content here -->
    <slot />
  </div>
</div>