<script>
  import SearchListProduct from '$lib/components/organism/SearchListProduct.svelte';
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte'
  import NumberInput from '$lib/components/molecule/NumberInput.svelte'
  import { post} from '$lib/helper/api'
	import { globalModal, refreshPage, toastAlert } from '$lib/helper/store';
  import { page } from '$app/stores';

  export let data = {}
  let product = {id:0}
  let qty = 0

  async function handleSubmit(){
    if (qty > 0 && product.id > 0) {
      const requestBody = {
        product_id: product.id,
        qty: qty
      }
      const response = await post(`/inventory/header/${$page.params.id}/movement`, requestBody)
      if (response) {
        globalModal.close()
        refreshPage.set(true)
      }
    } else toastAlert.error('qty must be greater than 0')
  }
</script>

<form on:submit|preventDefault={() => handleSubmit()}>
  <div class="grid grid-cols-2 gap-4">
    <div class="col-span-2">
      <SearchListProduct bind:selectedProduct={product} />
    </div>
    <NumberInput labelTL="Puchase Id" labelTR="autofill from above" skipFocus disabled bind:value={product.id}/>
    <NumberInput labelTL="Quantity" bind:value={qty}/>
  </div>
  <ModalSubmit form />
</form>