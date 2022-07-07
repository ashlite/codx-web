<script>
  export let xmlDataFull
  import BggBtn from "./BggBtn.svelte"
</script>

<div class="max-w-full">
  <table class="table table-fixed table-zebra w-full">
    <!-- head -->
    <thead>
      <tr>
        <th class="w-4">ID</th>
        <th class="w-4">Year</th>
        <th class="w-60">Name</th>
        <th class="w-24">Action</th>
      </tr>
    </thead>
    <tbody>
      {#each xmlDataFull as bg}
        <tr>
          <td>{bg.getAttribute('id')}</td>
          {#if bg.getElementsByTagName('yearpublished')[0] === undefined}
          <td>--</td>
          {:else}
          <td>{bg.getElementsByTagName('yearpublished')[0].getAttribute('value')}</td>
          {/if}
          <td class="overflow-hidden">{bg.getElementsByTagName('name')[0].getAttribute('value')}</td>
          <td>
            <BggBtn id={bg.getAttribute('id')} type="both"/>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>