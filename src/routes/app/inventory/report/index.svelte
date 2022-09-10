<script>
  import DatePicker from "$lib/components/organism/DatePicker.svelte";
</script>

<h1>Report Inventory - Inbound/Outbound/Transfer</h1>
<div class='my-4'>
  <DatePicker on:dateSubmit={e => console.log(e.detail)}/>
</div>