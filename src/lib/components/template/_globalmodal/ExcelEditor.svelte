<script>
  import BtnSuper from "$lib/components/atom/BtnSuper.svelte";
  import { download, post} from '$lib/helper/api'
  import handleDownloadResponse from '$lib/helper/donwloadFile'
	import { globalModal, refreshPage } from "$lib/helper/store";

  export let data
  let fileInput

  async function downloadExcel(){
    const response = await download(`/file/excel/down/${data}`)
    handleDownloadResponse(response.data, `template${data}.xlsx`)
  }

  async function uploadExcel(e){
    let formData = new FormData()
    const fileData = e.target.files[0]
    formData.append("payload", fileData)
    await post(`/file/excel/up/${data}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }}
    )
    refreshPage.set(true)
    globalModal.close()
  }
</script>

<div class="grid grid-cols-2 gap-x-8 gap-y-2">
  <div class="font-bold text-xl text-primary text-center">Download Excel Template</div>
  <div class="font-bold text-xl text-secondary text-center">Upload Edited Excel</div>
  <div>
    <BtnSuper size="lg" block color="primary" icon="uil:file-download" iconSize=55 on:click={() => downloadExcel()} />
  </div>
  <div>
    <input type="file" id="fileUpload" name="fileUpload" class="hidden"
      on:change={(e) => uploadExcel(e)} 
      bind:this={fileInput} />
    <BtnSuper size="lg" block color="secondary" icon="uil:file-upload" iconSize=55 on:click={() => fileInput.click()}/>
  </div>
</div>