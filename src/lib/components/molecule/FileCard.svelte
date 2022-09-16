<script>
  import BtnSuper from "$lib/components/atom/BtnSuper.svelte";
  import { download, del } from '$lib/helper/api'
  import handleDownloadResponse from '$lib/helper/donwloadFile'
	import { refreshPage } from "$lib/helper/store";
  
  export let data

  async function handleDownload(){
    const response = await download(`/file/download/${data.id}`)
    handleDownloadResponse(response.data, data.name)
  }

  async function handleDelete(){
    await del(`/file/${data.id}`)
    refreshPage.set(true)
  }
</script>

<div class="card bg-base-300 shadow-xl">
  <div class="card-body p-4">
    <h2 class="card-title">{data.name}</h2>
    <div class="card-actions justify-end">
      <BtnSuper size="sm" icon="uil:file-download" color="success" on:click={() => handleDownload()} />
      <BtnSuper size="sm" icon="uil:file-times" color="error" on:click={() => handleDelete()} />
    </div>
  </div>
</div>