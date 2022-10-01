<script>
  import TextInput from "$lib/components/molecule/TextInput.svelte"
  import NumberInput from "$lib/components/molecule/NumberInput.svelte"
  import ModalSubmit from "$lib/components/molecule/ModalSubmit.svelte"
  import { post, patch } from '$lib/helper/api'
  import { refreshPage } from "$lib/helper/store"
  import { globalModal } from "$lib/helper/store"
	import { onMount } from "svelte";
  export let data = {
    forex_symbol:'',
    forex_name:'',
    idr_buy_rate:0,
    idr_sell_rate:0
  }

  // onMount(() => console.log(data))

  async function handleSubmit(){
    let response
    if (data.edit){
      response = await patch(`/forex/${data.forex_symbol}`,{forex: data}) 
    } else {
      response = await post('/forex', {forex: data})
    }

    if (response){
      refreshPage.set(true)
      globalModal.close()
    }
  }

</script>

<div>
  <form class="grid grid-cols-6 gap-x-4" on:submit|preventDefault={() => handleSubmit()}>
    <div class="col-span-2">
      <TextInput limit={6} bind:value={data.forex_symbol} labelTL="Forex Symbol" uppercase disabled={data.edit}/>
    </div>
    <div class="col-span-4">
      <TextInput limit={32} bind:value={data.forex_name} labelTL="Forex Name" />
    </div>
    <div class="col-span-3">
      <NumberInput bind:value={data.idr_buy_rate} labelTL="Buy Rate (IDR)" />
    </div>
    <div class="col-span-3">
      <NumberInput bind:value={data.idr_sell_rate} labelTL="Sell Rate (IDR)" />
    </div>

    <div class="col-span-full">
      <ModalSubmit form />
    </div>
  </form>
</div>