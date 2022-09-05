<script>
  import { get, post, patch} from '$lib/helper/api'
  import { globalModal, toastAlert, refreshPage } from '$lib/helper/store'
  import { onMount } from 'svelte'
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte';
  export let data
  
  let dataCustomer = {}
  let firstInput

  onMount(async () => {
    if (data.customer != undefined) {
      const response = await get(`/customer/${data.customer.id}`)
      dataCustomer = response.data
    }
    firstInput.focus()
  })

  async function handleSubmit(){
    let response
    try {
      if (dataCustomer.id == undefined) {
        response = await post(`/customer`, dataCustomer)
      } else {
        response = await patch(`/customer/${dataCustomer.id}`, dataCustomer)
      }
      
      if (response.status == 200 || response.status == 201) {
        toastAlert.success('Success Submiting Customer')
        refreshPage.set(true)
        globalModal.close()
      } else {
        toastAlert.error('Failed to Save Customer')
      }

    } catch(error){
      console.log(error)
      toastAlert.error(error.message)
    }
  }

  
</script>

<div class="pb-20">
  <form on:submit|preventDefault = {() => handleSubmit()}>
    <div class="grid grid-cols-12 gap-4">
      <div id="nama-customer" class="form-control w-full col-span-12">
        <label class="label" for="nama-customer">
          <span class="label-text">Customer Name<span class="text-error font-bold">*</span></span>
        </label>
        <input id="nama-customer" type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={dataCustomer.name} bind:this={firstInput} required/>
      </div>
      <div id="alamat-customer" class="form-control w-full col-span-12">
        <label class="label" for="alamat-customer">
          <span class="label-text">Customer Address</span>
        </label>
        <input id="alamat-customer" type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={dataCustomer.address}/>
      </div>
      <div id="phone-customer" class="form-control w-full col-span-6">
        <label class="label" for="phone-customer">
          <span class="label-text">Phone Number (format <span class="text-warning font-bold">6281xxxx/6231xxxx</span>)</span>
        </label>
        <input id="phone-customer" type="number" placeholder="Type here" class="input input-bordered w-full" bind:value={dataCustomer.mobile}/>
      </div>
      <div id="email-customer" class="form-control w-full col-span-6">
        <label class="label" for="email-customer">
          <span class="label-text">Email Customer</span>
        </label>
        <input id="email-customer" type="email" placeholder="Type here" class="input input-bordered w-full" bind:value={dataCustomer.email}/>
      </div>
    </div>
  
    <ModalSubmit form />
  </form>
</div>