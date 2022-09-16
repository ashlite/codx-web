<script>
  import Icon from '@iconify/svelte'
  import { get, patch } from '$lib/helper/api'
  import { refreshPage, globalModal } from '$lib/helper/store'
  import { afterNavigate } from '$app/navigation'
  import CellAction from '$lib/components/molecule/CellAction.svelte'
  import BtnAddNew from '$lib/components/atom/BtnAddNew.svelte'
  import EditableInput from '$lib/components/atom/EditableInput.svelte'

  let listForex = []

  afterNavigate(() => RefreshData())
  $: $refreshPage && RefreshData()

  async function RefreshData(){
    let response = await get('/forex')
    listForex = response
    refreshPage.set(false)
  }

  async function updateForex(newData){
    let response = await patch(`/forex/${newData.forex_symbol}`, {forex: newData})
    refreshPage.set(true)
  }
</script>

<h1 class="text-4xl font-bold">Forex Setting</h1>
<div class="alert alert-info shadow-lg my-4">
  <div>
    <Icon icon="uil:info-circle" width="60" height="60"/>
    <span>Sifat dari forex hanya sebagai referensi nilai default kurs mata uang. Karena nilai hanya referensi, user bisa mengubah nilai yang digunakan sesuai keinginan ketika menggunakan forex di sistem. <span class="font-bold">Buy IDR</span> berarti nilai tukar kurs mata uang asing ketika user "membeli" produk. <span class="font-bold">Sell IDR</span> berarti nilai tukar kurs mata uang asing ketika user "menjual" produk. </span>
  </div>
</div>

<div>
  <div class="flex flex-row my-4">
    <BtnAddNew text="Forex" on:click={() => globalModal.createForex()}/>
  </div>
  <div class="overflow-x-auto">
    <table class="table w-full">
      <!-- head -->
      <thead>
        <tr>
          <th></th>
          <th>Forex Symbol</th>
          <th>Forex Name</th>
          <th>Buy Rate</th>
          <th>Sell Rate</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {#each listForex as forex, i}
          <tr>
            <td>{i+1}</td>
            <td>{forex.forex_symbol}</td>
            <td>{forex.forex_name}</td>
            <td>
              <EditableInput value={forex.idr_buy_rate} dataId={forex} on:editableSubmit={e => updateForex({...forex, idr_buy_rate: e.detail.newValue})}/>
            </td>
            <td>
              <EditableInput value={forex.idr_sell_rate} dataId={forex} on:editableSubmit={e => updateForex({...forex, idr_sell_rate: e.detail.newValue})}/>
            </td>
            <td>
              <CellAction edit
                on:edit={() => globalModal.editForex(forex)}
              />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>