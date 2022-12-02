<script>
  import NumberInput from "$lib/components/molecule/NumberInput.svelte"
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
  <NumberInput 
    labelTL="Grace Period (s)"
    labelTR={durationFormater(priceData.grace_period)}
    tooltip="Harga 0 jika durasi dibawah param ini"
    min=0
    bind:value={priceData.grace_period} />
  <NumberInput
    labelTL="Error Period (s)"
    labelTR={durationFormater(priceData.error_period)}
    tooltip="Harga 0 dan invalid data jika durasi melebihi param ini, set 0 jika tidak ada error period"
    min=0
    bind:value={priceData.error_period} />
  <NumberInput 
    labelTL="Cycle Time (s)" 
    labelTR={durationFormater(priceData.cycle_time)}
    tooltip="Durasi 1 cycle harga"
    min=0
    bind:value={priceData.cycle_time} />
  <NumberInput 
    labelTL="Cycle Start (s)"
    labelTR={durationFormater(priceData.cycle_start)}
    tooltip="Perhitungan cycle akan dimulai setelah durasi melewati param ini"
    min=0
    bind:value={priceData.cycle_start} />
  <NumberInput 
    labelTL="Cycle Price (idr)"
    labelTR={priceFormater(priceData.cycle_price)}
    tooltip="Penambahan harga setiap cycle"
    min=0
    bind:value={priceData.cycle_price} />
  <NumberInput
    labelTL="Min Price (idr)"
    labelTR={priceFormater(priceData.min_price)}
    tooltip="Harga minimal billing"
    min=0
    bind:value={priceData.min_price} />
  <NumberInput
    labelTL="Max Price (idr)"
    labelTR={priceFormater(priceData.max_price)}
    tooltip="Harga maximal billing"
    min=0
    bind:value={priceData.max_price} />
</div>
