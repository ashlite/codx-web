<script>
  import Icon from "@iconify/svelte";
  import { createEventDispatcher } from "svelte";
  import TextInput from "$lib/components/molecule/TextInput.svelte";
  import BtnSuper from "$lib/components/atom/BtnSuper.svelte";
  import { refreshPage } from "$lib/helper/store";
  import { post, del } from '$lib/helper/api'
  import { toastAlert } from '$lib/helper/store'
	import { dateFormater } from "$lib/helper/tools";

  export let data = undefined // object approval purchase
  export let type
  export let headerId = 0 // purchase header id
  export let subText = 'Please approve this section if finish.'
  const dispatch = createEventDispatcher()
  let noteInput = false
  let approvalNote = ''

  async function handleSubmit(){
    if (headerId > 0){
      const requestBody = {
        notes: approvalNote,
        approval_type: type
      }
      console.log(requestBody)
      await post(`/purchase/approval/${headerId}`, requestBody)
      refreshPage.set(true)
      noteInput = false
    } else toastAlert.error('Invalid Header Purchase ID')
  }
  async function handleCancelApprove(){
    await del(`/purchase/approval/${headerId}?type=${type}`)
    refreshPage.set(true)
  }
</script>

{#if data == undefined}
  {#if noteInput == false}
    <div class="alert alert-error shadow-lg">
      <div>
        <Icon icon="uil:file-lock-alt" width="30" height="30" />
        <div>
          <h3 class="font-bold">Not Aprrove</h3>
          <div class="text-xs">{subText}</div>
        </div>
      </div>
      <div class="flex-none">
        <BtnSuper text="Approve" on:click={() => noteInput=true} />
      </div>
    </div>
  {:else}
    <form on:submit|preventDefault={() => handleSubmit()}>
      <div class="alert shadow-lg">
        <div class="w-3/5 gap-4">
          <Icon icon="uil:file-lock-alt" width="30" height="30" />
          <TextInput labelTL="Input Approval notes" labelTR="leave blank if there is no note" bind:value={approvalNote} limit=1000 />
        </div>
        <div class="flex-none">
          <BtnSuper text="Submit" type="submit" color="success" />
          <BtnSuper text="Cancel" color="warning" on:click={() => noteInput=false}/>
        </div>
      </div>
    </form>
  {/if}
{:else}
  <div class="alert alert-success shadow-lg">
    <div>
      <Icon icon="uil:file-lock-alt" width="30" height="30" />
      <div>
        <h3 class="font-bold">{`Approve by: ${data.user.first_name} ${data.user.last_name} (${data.user.email})`}</h3>
        <div class="text-xs">
          <span class="font-bold">Date: </span> {dateFormater(data.created_at)} - 
          <span class="font-bold">Notes: </span> {data.notes}
        </div>
      </div>
    </div>
    <div class="flex-none">
      <button class="btn" on:click={() => handleCancelApprove()}>Cancel Approval</button>
    </div>
  </div>
{/if}