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
  import ToastAlert from '$lib/components/ToastAlert.svelte'
  import GlobalModal from '$lib/components/GlobalModal.svelte'
</script>

<ToastAlert />
<GlobalModal />

<div class="drawer drawer-mobile">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col items-center justify-center">
    <!-- Page content here -->
    <label for="my-drawer" class="btn btn-primary drawer-button hidden">Open drawer</label>
    <slot />
  </div> 
  <div class="drawer-side bg-base-300">
    <label for="my-drawer" class="drawer-overlay"></label>
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
      <li><a sveltekit:prefetch href='/app/purchase' class={$page.url.pathname.includes('/purchase') ? "active" : ""}>Purchase</a></li>
    </ul>
  </div>
</div>
