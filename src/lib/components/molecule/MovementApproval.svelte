<script>
  import Icon from "@iconify/svelte";
  import BtnSuper from "$lib/components/atom/BtnSuper.svelte";
  import { refreshPage } from "$lib/helper/store";
  import { post} from '$lib/helper/api'
	import { dateFormater } from "$lib/helper/tools";

  export let data = undefined // object header movement

  async function finishing(){
    await post(`/inventory/header/${data.id}/finalize`)
    refreshPage.set(true)
  }

  async function canceling(){
    await post(`/inventory/header/${data.id}/cancel`)
    refreshPage.set(true)
  }
</script>

{#if data.id != undefined}
  {#if data.finish_at != undefined}
    <div class="alert alert-success shadow-lg">
      <div>
        <Icon icon="uil:file-lock-alt" width="30" height="30" />
        <div>
          <h3 class="font-bold">Finished by {data.finalized_user.first_name} {data.finalized_user.last_name}</h3>
          <div class="text-xs">
            <span class="font-bold">Finalized at: </span> {dateFormater(data.finish_at)}
          </div>
          <div class="text-xs">
            Movement is <span class="font-bold">applied</span> to count total product stock.
          </div>
        </div>
      </div>
      <div class="flex-none">
        <BtnSuper text="Revokes" on:click={() => finishing()} color="secondary" />
      </div>
    </div>
  {:else if data.canceled_at != undefined}
    <div class="alert alert-error shadow-lg">
      <div>
        <Icon icon="uil:file-lock-alt" width="30" height="30" />
        <div>
          <h3 class="font-bold">Canceled by {data.canceled_user.first_name} {data.canceled_user.last_name}</h3>
          <div class="text-xs">
            <span class="font-bold">Canceled at: </span> {dateFormater(data.canceled_at)}
          </div>
          <div class="text-xs">
            Movement is <span class="font-bold">not applied</span> to count product stock. The movement is canceled
          </div>
        </div>
      </div>
      <div class="flex-none">
        <BtnSuper text="Revokes" on:click={() => canceling()} color="secondary" />
      </div>
    </div>
  {:else}
    <div class="alert shadow-lg">
      <div>
        <Icon icon="uil:file-lock-alt" width="30" height="30" />
        <div>
          <h3 class="font-bold">On Progress</h3>
          <div class="text-xs">
            <span class="font-bold">Create at: </span> {dateFormater(data.create_at)}
          </div>
          <div class="text-xs">
            Movement is <span class="font-bold">not applied</span> to count product stock. Please proceed with clicking the right button.
          </div>
        </div>
      </div>
      <div class="flex-none">
        <BtnSuper text="Finish and Applied" on:click={() => finishing()} color="success" />
        <BtnSuper text="Cancel" on:click={() => canceling()} color="error" />
      </div>
    </div>
  {/if}
{/if}