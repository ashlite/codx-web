<script>
  import { get, post, patch} from '$lib/api'
  import { globalModal, toastAlert, refreshPage } from '$lib/store'
  import { onMount } from 'svelte'
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
        <input id="phone-customer" type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={dataCustomer.mobile}/>
      </div>
      <div id="email-customer" class="form-control w-full col-span-6">
        <label class="label" for="email-customer">
          <span class="label-text">Email Customer</span>
        </label>
        <input id="email-customer" type="email" placeholder="Type here" class="input input-bordered w-full" bind:value={dataCustomer.email}/>
      </div>
    </div>
  
    <div class="flex gap-4 flex-row-reverse mt-6">
      <button aria-label="Confirm" class="btn btn-success w-1/5" type="submit">
        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path xmlns="http://www.w3.org/2000/svg" d="M3 5C3 3.89543 3.89543 3 5 3H9H15H16.5858C17.1162 3 17.6249 3.21071 18 3.58579L20.7071 6.29289C20.8946 6.48043 21 6.73478 21 7V19C21 20.1046 20.1046 21 19 21H15H9H5C3.89543 21 3 20.1046 3 19V5ZM9 19H15V13H9V19ZM17 19H19V7.41421L17 5.41421V7C17 8.10457 16.1046 9 15 9H9C7.89543 9 7 8.10457 7 7V5H5V19H7V13C7 11.8954 7.89543 11 9 11H15C16.1046 11 17 11.8954 17 13V19ZM9 5V7H15V5H9Z" fill="#0D0D0D"></path>
        </svg>
        Save
      </button>
      <button aria-label="Confirm" class="btn btn-warning w-1/5" on:click={() => globalModal.close()}>
        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path xmlns="http://www.w3.org/2000/svg" d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM7.79289 7.79289C8.18342 7.40237 8.81658 7.40237 9.20711 7.79289L12 10.5858L14.7929 7.79289C15.1834 7.40237 15.8166 7.40237 16.2071 7.79289C16.5976 8.18342 16.5976 8.81658 16.2071 9.20711L13.4142 12L16.2071 14.7929C16.5976 15.1834 16.5976 15.8166 16.2071 16.2071C15.8166 16.5976 15.1834 16.5976 14.7929 16.2071L12 13.4142L9.20711 16.2071C8.81658 16.5976 8.18342 16.5976 7.79289 16.2071C7.40237 15.8166 7.40237 15.1834 7.79289 14.7929L10.5858 12L7.79289 9.20711C7.40237 8.81658 7.40237 8.18342 7.79289 7.79289Z" fill="#0D0D0D"></path>
          </svg>
        Cancel
      </button>
    </div>
  </form>
</div>