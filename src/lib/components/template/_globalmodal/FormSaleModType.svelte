<script>
  import { get, patch, post } from '$lib/helper/api'
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte'
  import TextInput from '$lib/components/molecule/TextInput.svelte'
  import NumberInput from '$lib/components/molecule/NumberInput.svelte'
  import Toggle from '$lib/components/atom/Toggle.svelte'
  import TextArea from '$lib/components/molecule/TextArea.svelte'
  import { globalModal, refreshPage } from '$lib/helper/store'
  import { onMount } from 'svelte'

  export let data = { id:0 }
  let saleType = data.id > 0 ? data.sale_type : ''
  let defaultMod = data.id > 0 ? data.default_mod : 0
  let isPercentage = data.id > 0 ? data.is_percentage : false
  let notes = data.id > 0 ? data.notes : ''

  async function handleSubmit() {
    if (data.id > 0) {
      await patch(`/sale/mod/${data.id}`, {
        sale_type: saleType,
        default_mod: defaultMod,
        is_percentage: isPercentage,
        notes: notes
      })
    } else {
      await post('/sale/mod', {
        sale_type: saleType,
        default_mod: defaultMod,
        is_percentage: isPercentage,
        notes: notes
      })
    }
    refreshPage.set(true)
    globalModal.close()
  }
</script>

<div>
  <form class="flex flex-col gap-4" on:submit|preventDefault={() => handleSubmit()}>
    <TextInput labelTL="Type/Name" bind:value={saleType} />
    <NumberInput labelTL="Default Modifier" bind:value={defaultMod} min={-99999999} />
    <Toggle label="Value as Percentage?" bind:checked={isPercentage} />
    <TextArea labelTL="Notes" bind:value={notes} />
    
    <div class="col-span-full">
      <ModalSubmit form />
    </div>
  </form>
</div>