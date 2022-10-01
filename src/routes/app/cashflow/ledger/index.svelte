<script>
  import DatePicker from "$lib/components/organism/DatePicker.svelte";
  import BtnSuper from "$lib/components/atom/BtnSuper.svelte";
  import BtnAddNew from "$lib/components/atom/BtnAddNew.svelte";
  import CellAction from "$lib/components/molecule/CellAction.svelte";
  import { globalModal } from "$lib/helper/store"
</script>

<div class="min-h-screen pt-4 pb-8">
  <div class="flex flex-row gap-4">
    <div>
      <DatePicker noRange noDaily defaultMonth={Date.now()} />
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
      </tbody>
    </table>
  </div>
</div>