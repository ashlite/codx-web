<script>
  import { globalModal, toastAlert, refreshPage } from '$lib/helper/store'
  import { RingLoader } from 'svelte-loading-spinners'
  import { del } from '$lib/helper/api'
  import { createEventDispatcher } from 'svelte'
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte'
  export let data

  const dispatch = createEventDispatcher()
  let deleteProcess = false

  async function DeleteItem() {
    deleteProcess = true
    await del(`/${data.type}/${data.id}`)
    refreshPage.set(true)
    dispatch('message', {
      text: 'Deleted'
    })
    deleteProcess = false
    globalModal.close()
  }
</script>

{#if deleteProcess}
  <h3 class="text-lg font-bold text-center">Processing Delete...</h3>
  <div class="mx-auto my-6 w-fit">
    <RingLoader size="100" color="#FF3E00" unit="px" duration="2s"/>
  </div>
{:else}
  <h3 class="text-lg text-center">Are you sure you want to delete <span class="font-bold text-warning">{data.name}</span>?</h3>
  <ModalSubmit on:submit={() => DeleteItem()}/>
{/if}