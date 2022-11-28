<script>
  import { del, get, post } from '$lib/helper/api'
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte'
  import NumberInput from '$lib/components/molecule/NumberInput.svelte'
  import TextArea from '$lib/components/molecule/TextArea.svelte'
  import Toggle from '$lib/components/atom/Toggle.svelte'
	import { onMount } from 'svelte'
  import { globalModal, refreshPage, toastAlert } from '$lib/helper/store'

  export let data = 0
  let cancelNote

  async function handleSubmit() {
    if (data > 0) {
      await del(`/sale/header/${data}`, {
        notes: cancelNote
      })
    } else {
      toastAlert.error('Wrong Sale ID, please check sale ID')
    }
    refreshPage.set(true)
    globalModal.close()
  }
</script>

<div>
  <form class="flex flex-col gap-4" on:submit|preventDefault={() => handleSubmit()}>
    <TextArea labelTL="Cancel Reason:" bind:value={cancelNote}/>
    <div class="col-span-full">
      <ModalSubmit form />
    </div>
  </form>
</div>