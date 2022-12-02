<script>
  import { priceFormater, durationFormater } from "$lib/helper/tools"

  export let priceData = {
    grace_period: 0,
    error_period: 0,
    cycle_time: 0,
    cycle_price: 0,
    cycle_start: 0,
    min_price: 0,
    max_price: 0
  }
</script>

<div class="flex flex-col">
  <div>Grace Period: <span>{durationFormater(priceData.grace_period)}</span></div>
  <div>Error Period: <span>{durationFormater(priceData.error_period)}</span></div>
  <div>Cycle Time: <span>{durationFormater(priceData.cycle_time)}</span></div>
  <div>Cycle Start: <span>{durationFormater(priceData.cycle_start)}</span></div>
  <div>Cycle Price: <span>{priceFormater(priceData.cycle_price)}</span></div>
  <div>Min Price: <span>{priceFormater(priceData.min_price)}</span></div>
  <div>Max Price: <span>{priceFormater(priceData.max_price)}</span></div>
</div>