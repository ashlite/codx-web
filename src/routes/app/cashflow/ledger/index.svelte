<script>
  import DatePicker from "$lib/components/organism/DatePicker.svelte";
  import MonthPicker from "$lib/components/organism/MonthPicker.svelte";
  import BtnAddNew from "$lib/components/atom/BtnAddNew.svelte";
  import CellAction from "$lib/components/molecule/CellAction.svelte";
  import { globalModal, refreshPage} from "$lib/helper/store"
	import { afterNavigate } from "$app/navigation";
	import { get } from "$lib/helper/api";
	import { dateFormater, priceFormater } from "$lib/helper/tools";

  let listLedger = []
  let selectedDate = new Date()

  afterNavigate(RefreshData)

  $: $refreshPage && RefreshData()

  function updateRange(data){
    dateRange = data
    RefreshData()
  }

  async function RefreshData() {
    const datemin = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1, 0,0,0,0)
    const datemax = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999)
    listLedger = await get(`/cashflow?createmin=${dateFormater(datemin, 'isoDateTime')}&createmax=${dateFormater(datemax, 'isoDateTime')}&skip=0&limit=1000`)
    refreshPage.set(false)
  }

  function changeMonth(date) {
    selectedDate = date
    refreshPage.set(true)
  }
</script>

<div class="min-h-screen pt-4 pb-8">
  <div class="flex flex-row gap-4">
    <div>
      <!-- <DatePicker noRange noDaily defaultMonth={Date.now()} on:pickerSubmit={e => updateRange(e.detail)}/> -->
      <MonthPicker on:monthSubmit={e => changeMonth(e.detail)} />
    </div>
    <div>
      <BtnAddNew text="Cashflow" on:click={() => globalModal.addCashflow()}/>
    </div>
  </div>

  <div class="overflow-x-auto mt-4">
    <table class="table w-full">
      <thead>
        <tr class="text-center">
          <th>Date</th>
          <th>Type</th>
          <th>Forex Amount</th>
          <th>Real Amount</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {#each listLedger as ledger}
          <tr>
            <td class="text-center">{dateFormater(ledger.created_at)}</td>
            <td class="text-center tooltip cursor-help tooltip-accent" data-tip={ledger.notes}>{ledger.type.flow_type}</td>
            <td class="text-right">
              {ledger.forex_symbol != undefined ? priceFormater(ledger.forex_amount, ledger.forex_symbol) : 0}
            </td>
            <td class="text-right">{priceFormater(ledger.flow_amount)}</td>
            <td><CellAction edit remove
              on:remove={() => globalModal.deleteConfirmation(ledger.id, `cashflow id ${ledger.id}`, 'cashflow')} 
              on:edit={() => globalModal.editCashflow(ledger)} />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>