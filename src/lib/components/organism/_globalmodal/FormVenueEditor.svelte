<script>
  import { get, post, patch} from '$lib/helper/api'
  import { globalModal, toastAlert, refreshPage } from '$lib/helper/store'
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte';
  import { onMount } from 'svelte'
  export let data
  
  let dataVenue = { is_internal: true}
  let firstInput

  onMount(async () => {
    if (data.venue != undefined) {
      const response = await get(`/venue/${data.venue.id}`)
      dataVenue = response.data
    }
    firstInput.focus()
  })

  async function handleSubmit(){
    let response
    try {
      if (dataVenue.id == undefined) {
        response = await post(`/venue`, {venue: dataVenue})
      } else {
        response = await patch(`/venue/${dataVenue.id}`, {venue: dataVenue})
      }
      
      if (response.status == 200 || response.status == 201) {
        toastAlert.success('Success Submiting Venue')
        refreshPage.set(true)
        globalModal.close()
      } else {
        toastAlert.error('Failed to Save Venue')
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
      <div id="nama-venue" class="form-control w-full col-span-12">
        <label class="label" for="nama-venue">
          <span class="label-text">Venue Name<span class="text-error font-bold">*</span></span>
        </label>
        <input id="nama-venue" type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={dataVenue.name} bind:this={firstInput} required/>
      </div>
      <div id="alamat-venue" class="form-control w-full col-span-8">
        <label class="label" for="alamat-venue">
          <span class="label-text">Venue Address</span>
        </label>
        <input id="alamat-venue" type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={dataVenue.address}/>
      </div>
      <div id="city-venue" class="form-control w-full col-span-4">
        <label class="label" for="city-venue">
          <span class="label-text">Venue City</span>
        </label>
        <input id="city-venue" type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={dataVenue.city}/>
      </div>
      <div id="phone-venue" class="form-control w-full col-span-6">
        <label class="label" for="phone-venue">
          <span class="label-text">Phone Venue (format <span class="text-warning font-bold">6281xxxx/6231xxxx</span>)</span>
        </label>
        <input id="phone-venue" type="number" placeholder="Type here" class="input input-bordered w-full" bind:value={dataVenue.phone}/>
      </div>
      <div id="internal-venue" class="form-control w-full col-span-3">
        <label class="label cursor-pointer flex flex-col gap-4" for="internal-venue">
          <span class="label-text">Is Internal venue?<span class="text-error font-bold">*</span></span>
          <input id="internal-venue" type="checkbox" placeholder="Type here" class="toggle toggle-lg" bind:checked={dataVenue.is_internal} required/>
        </label>
      </div>
    </div>

    <ModalSubmit form />
  </form>
</div>