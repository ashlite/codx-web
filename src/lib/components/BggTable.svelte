<script>
  export let data
  import BggBtn from "./BggBtn.svelte"
  import {decodeXML} from 'entities'
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
      {#each data as bg}
        <tr>
          <td>{bg.id}</td>
          {#if bg.yearpublished === undefined}
          <td>--</td>
          {:else}
          <td>{bg.yearpublished.value}</td>
          {/if}
          <td class="overflow-hidden">{decodeXML(bg.name.value)}</td>
          <td>
            <BggBtn id={bg.id} type="both"/>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>