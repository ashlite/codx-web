<script>
  import { globalModal, toastAlert, collectionRefresh } from '$lib/store'
  import { RingLoader } from 'svelte-loading-spinners'
  import {del} from '$lib/api'
  import { createEventDispatcher } from 'svelte'
  export let data

  const dispatch = createEventDispatcher()
  let deleteProcess = false

  async function DeleteItem() {
    deleteProcess = true
    try {
      await del(`/${data.type}/${data.id}`)
      toastAlert.success('Item deleted')
      collectionRefresh.set(true)
    } catch (error) {
      toastAlert.error(error)
    } finally {
      dispatch('message', {
        text: 'Deleted'
      })
      deleteProcess = false
      globalModal.close()
    }
  }
</script>

{#if deleteProcess}
  <h3 class="text-lg font-bold text-center">Processing Delete...</h3>
  <div class="mx-auto my-6 w-fit">
    <RingLoader size="100" color="#FF3E00" unit="px" duration="2s"/>
  </div>
{:else}
  <h3 class="text-lg text-center">Are you sure you want to delete <span class="font-bold text-warning">{data.name}</span>?</h3>
  <div class="grid grid-cols-3 gap-4 mx-auto my-6">
    <button aria-label="Cancel" class="btn btn-warning col-start-2" on:click={() => globalModal.close()}>
      <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path xmlns="http://www.w3.org/2000/svg" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="#0D0D0D"></path>
      </svg>
      Cancel
    </button>
    <button aria-label="Confirm" class="btn btn-success col-start-3" on:click={() => DeleteItem()}>
      <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path xmlns="http://www.w3.org/2000/svg" d="M20.6644 5.2526C21.0772 5.61952 21.1143 6.25159 20.7474 6.66437L10.0808 18.6644C9.89099 18.8779 9.61898 19 9.33334 19C9.04771 19 8.7757 18.8779 8.58593 18.6644L3.2526 12.6644C2.88568 12.2516 2.92286 11.6195 3.33565 11.2526C3.74843 10.8857 4.3805 10.9229 4.74742 11.3356L9.33334 16.4948L19.2526 5.33565C19.6195 4.92286 20.2516 4.88568 20.6644 5.2526Z" fill="#0D0D0D"></path>
        </svg>
      Confirm
    </button>
  </div>
{/if}