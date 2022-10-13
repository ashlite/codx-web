<script>
  import { refreshPage} from "$lib/helper/store"
	import { afterNavigate } from "$app/navigation"
  import { dateFormater } from '$lib/helper/tools'
  import TextInput from "$lib/components/molecule/TextInput.svelte"
  import NumberInput from "$lib/components/molecule/NumberInput.svelte"
  import { page } from '$app/stores'
  import { get, patch } from '$lib/helper/api'
  import BtnSuper from '$lib/components/atom/BtnSuper.svelte'
  import AccessEditor from '$lib/components/template/_access/AccessEditor.svelte'

  let user = false
  let access = false

  afterNavigate(RefreshData)

  $: $refreshPage && RefreshData()

  async function RefreshData() {
    user = await get(`/users/data/${$page.params.id}`)
    access = await user.user_access
    refreshPage.set(false)
  }
  
  async function saveData(){
    await patch(`/users/data/${$page.params.id}`, {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      user_level: user.user_level
    })
    refreshPage.set(true)
  }

  async function resetAccess(){
    await patch(`/users/access/${$page.params.id}?reset_access=1`, {})
    refreshPage.set(true)
  }

  async function saveAccess(){
    access.inventory.purchase.approval = JSON.parse('['+access.inventory.purchase.approval+']')
    console.log(access)
    await patch(`/users/access/${$page.params.id}`, {user_access:access})
    refreshPage.set(true)
  }

</script>

<div class="min-h-screen w-full p-4">
  {#if user}
    <div class="flex flex-row gap-4 items-center">
      <div class="avatar">
        <div class="w-24 rounded-full">
          <img src={`https://avatars.dicebear.com/api/adventurer-neutral/${user.first_name}%20${user.last_name}.svg`} alt="user avatar"/>
        </div>
      </div>
      <div>
        <h1 class="text-3xl font-bold text-primary">Data User {user.id}</h1>
        <h2 class="text-xl text-secondary">Join Date: {dateFormater(user.registered_at)}</h2>
      </div>
    </div>
    <form on:submit|preventDefault={() => saveData()}>
      <div class="grid grid-cols-2 gap-4">
        <div class="">
          <TextInput labelTL="First Name" required limit=64 bind:value={user.first_name} />
        </div>
        <div class="">
          <TextInput labelTL="Last Name" required limit=64 bind:value={user.last_name} />
        </div>
        <div class="">
          <TextInput labelTL="Email" required limit=100 bind:value={user.email} />
        </div>
        <div class="col-start-2">
          <NumberInput labelTL="Level" required bind:value={user.user_level} min=0 max=30 />
        </div>
      </div>
      <BtnSuper color="success" type="submit" text="Save data" />
    </form>

  {/if}
  
  <div class="divider"></div>
  <h1 class="text-3xl font-bold text-primary mb-4">Privilage Access</h1>
  <div class="flex flex-row gap-4">
    <BtnSuper text="Set Default Access to user" color="accent" on:click={() => resetAccess()}/>
    <BtnSuper text="Save Access" color="success" on:click={() => saveAccess()}/>
  </div>
  {#if access}
    <AccessEditor bind:access={access} />
  {:else}
    <h2 class="mt-2">User privilage access is not set. Please Set Default Access.</h2>
  {/if}
    
  
</div>