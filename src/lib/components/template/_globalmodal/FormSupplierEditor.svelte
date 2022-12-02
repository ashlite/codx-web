<script>
  import { get, post, patch} from '$lib/helper/api'
  import { globalModal, toastAlert, refreshPage } from '$lib/helper/store'
  import { onMount } from 'svelte'
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte'
  export let data
  
  let dataSupplier = {}
  let firstInput

  onMount(async () => {
    if (data.supplier != undefined) {
      const response = await get(`/supplier/${data.supplier.id}`)
      dataSupplier = response
    }
    firstInput.focus()
  })

  async function handleSubmit(){
    let response
    if (dataSupplier.id == undefined) {
      response = await post(`/supplier`, {supplier: dataSupplier})
    } else {
      response = await patch(`/supplier/${dataSupplier.id}`, {supplier: dataSupplier})
    }
    if (Object.keys(response).length > 0){
      refreshPage.set(true)
      globalModal.close()
    }
  }

  
</script>

<div class="pb-20">
  <form on:submit|preventDefault = {() => handleSubmit()}>
    <div class="grid grid-cols-12 gap-4">
      <div id="nama-supplier" class="form-control w-full col-span-12">
        <label class="label" for="nama-supplier">
          <span class="label-text">Supplier Name<span class="text-error font-bold">*</span></span>
        </label>
        <input id="nama-supplier" type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={dataSupplier.supplier_name} bind:this={firstInput} required/>
      </div>
      <div id="negara-supplier" class="form-control w-full col-span-6">
        <label class="label" for="negara-supplier">
          <span class="label-text">Supplier Country<span class="text-error font-bold">*</span></span>
        </label>
        <input id="negara-supplier" type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={dataSupplier.country} required/>
      </div>
      <div id="alamat-supplier" class="form-control w-full col-span-6">
        <label class="label" for="alamat-supplier">
          <span class="label-text">Supplier Address</span>
        </label>
        <input id="alamt-supplier" type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={dataSupplier.address}/>
      </div>
      <div id="email-supplier" class="form-control w-full col-span-6">
        <label class="label" for="email-supplier">
          <span class="label-text">Supplier Email</span>
        </label>
        <input id="email-supplier" type="email" placeholder="Type here" class="input input-bordered w-full" bind:value={dataSupplier.email}/>
      </div>
      <div id="phone-supplier" class="form-control w-full col-span-6">
        <label class="label" for="phone-supplier">
          <span class="label-text">Phone Number (format <span class="text-warning font-bold">6281xxxx/6231xxxx</span>)</span>
        </label>
        <input id="phone-supplier" type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={dataSupplier.mobile}/>
      </div>
      <div id="notes-supplier" class="form-control w-full col-span-12">
        <label class="label" for="notes-supplier">
          <span class="label-text">Notes </span>
        </label>
        <input id="notes-supplier" type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={dataSupplier.notes}/>
      </div>

      <div class="divider col-span-12">Contact Person</div>
      
      <div id="nama-cp" class="form-control w-full col-span-12">
        <label class="label" for="nama-cp">
          <span class="label-text">Supplier CP Name</span>
        </label>
        <input id="nama-cp" type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={dataSupplier.cp_name}/>
      </div>
      <div id="email-cp" class="form-control w-full col-span-6">
        <label class="label" for="email-cp">
          <span class="label-text">Supplier CP Email</span>
        </label>
        <input id="email-cp" type="email" placeholder="Type here" class="input input-bordered w-full" bind:value={dataSupplier.cp_email}/>
      </div>
      <div id="phone-cp" class="form-control w-full col-span-6">
        <label class="label" for="phone-cp">
          <span class="label-text">Supplier CP Mobile (format <span class="text-warning font-bold">6281xxxx/6231xxxx</span>)</span>
        </label>
        <input id="phone-cp" type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={dataSupplier.cp_mobile}/>
      </div>
    </div>

    <ModalSubmit form />
  
  </form>
</div>