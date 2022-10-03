<script>
  import CellAction from "$lib/components/molecule/CellAction.svelte";
  import BadgePercentage from "$lib/components/atom/BadgePercentage.svelte";
  import { priceFormater } from "$lib/helper/tools";
	import { onMount } from "svelte";
  export let data
  let invoiceAmount = {}
  
  onMount(() => {
    invoiceAmount = totalAmount()
  })

  function totalAmount() {
    let totalForex = 0
    let totalIdr = 0
    let totalSellForex = 0
    let totalSellIdr = 0
    data.list_item.forEach(item => {
      totalForex += item.forex_buy * item.ordered_qty
      totalIdr += item.idr_buy_price * item.ordered_qty
      totalSellForex += item.forex_sell * item.ordered_qty
      totalSellIdr += item.idr_sell_price * item.ordered_qty
    })
    
    return {buyForex: totalForex, buyIdr: totalIdr, sellForex: totalSellForex, sellIdr: totalSellIdr}
  }
</script>

<div class="overflow-x-auto my-4">
  <table class="table w-full">
    <thead>
      <tr>
        <th>Description</th>
        <th>Amount Forex</th>
        <th>Amount IDR</th>
        <th>Action/Info</th>
      </tr>
    </thead>
    <tbody>
      <tr class='text-secondary'>
        <td>
          Total Selling value
        </td>
        <td>{priceFormater(invoiceAmount.sellForex, data.forex_symbol)}</td>
        <td>{priceFormater(invoiceAmount.sellIdr)}</td>
        <td>Calculated</td>
      </tr>
      <tr class='text-secondary'>
        <td>
          Total Amount of Purchased Items
        </td>
        <td>{priceFormater(invoiceAmount.buyForex, data.forex_symbol)}</td>
        <td>{priceFormater(invoiceAmount.buyIdr)}</td>
        <td>Calculated</td>
      </tr>
      <tr>
        <td>
          Total Modifier
        </td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>
          Net Margin with %
        </td>
        <td>{priceFormater(invoiceAmount.sellForex - invoiceAmount.buyForex, data.forex_symbol)}</td>
        <td>{priceFormater(invoiceAmount.sellIdr - invoiceAmount.buyIdr)}</td>
        <td><BadgePercentage value={Math.round((invoiceAmount.sellIdr - invoiceAmount.buyIdr)/invoiceAmount.sellIdr*100)} /></td>
      </tr>
    </tbody>
  </table>
</div>