<script>
  export let data
  import BtnExternalLink from '$lib/components/atom/BtnExternalLink.svelte'
  import BtnAddNew from '$lib/components/atom/BtnAddNew.svelte'
  import { globalModal } from '$lib/helper/store'
  import {decodeXML, decodeHTML} from 'entities'
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
          <td class="overflow-hidden">{decodeHTML(decodeXML(bg.name.value))}</td>
          <td>
            <div class="flex flex-row gap-4">
              <BtnExternalLink href={`https://boardgamegeek.com/boardgame/${bg.id}`} />
              <BtnAddNew text='Collection' noShortcut on:click={() => globalModal.collectionFromBgg(bg.id)} />
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>