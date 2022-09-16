<script>
  import { globalModal, refreshPage } from '$lib/helper/store'
  import { post } from '$lib/helper/api'
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte'
  export let data

  async function CancelSubmit() {
    await post(`/purchase/header/${data.id}/cancel`)
    refreshPage.set(true)
    globalModal.close()
  }
</script>

<h3 class="text-lg text-center">Are you sure you want to change <span class="font-bold text-warning">CANCEL</span> status of this process ?</h3>
<ModalSubmit on:submit={() => CancelSubmit()}/>
