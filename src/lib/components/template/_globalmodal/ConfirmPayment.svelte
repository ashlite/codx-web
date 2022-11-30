<script>
  import TextArea from "$lib/components/molecule/TextArea.svelte";
  import ModalSubmit from "$lib/components/molecule/ModalSubmit.svelte";
  import { globalModal, refreshPage } from "$lib/helper/store";
  import { post } from "$lib/helper/api";
  export let data
  let notes

  async function handleSubmit() {
    let sendBody
    if (data.mode == 'cash') {
      sendBody = {
        processor_id: 1,
        ref_processor: notes
      }
    } else {
      sendBody = {
        processor_id: 4,
        ref_processor: notes
      }
    }
    await post(`/sale/pay/${data.headerId}`, sendBody)
    globalModal.close()
    refreshPage.set(true)
  }
</script>

<div>
  <form class="flex flex-col gap-4" on:submit|preventDefault={() => handleSubmit()}>
    <TextArea labelTL="Payment Ref:" bind:value={notes}/>
    <div class="col-span-full">
      <ModalSubmit form />
    </div>
  </form>
</div>