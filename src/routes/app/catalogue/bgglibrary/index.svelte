<script>
  import { onMount } from 'svelte'
  import { RingLoader } from 'svelte-loading-spinners'
  import BggSearch from '$lib/components/BggSearch.svelte'
  import BggCard from '$lib/components/BggCard.svelte'
  import BggTable from '$lib/components/BggTable.svelte'
  import { bggSearchResult } from '$lib/store'
  import {XMLParser} from 'fast-xml-parser'

  let bgData = false
  const parser = new XMLParser({
    ignoreAttributes : false,
    attributeNamePrefix : "",
  })

  onMount(() => {
    LoadBgg()
  })

  async function LoadBgg(){
    const response = await fetch(`https://boardgamegeek.com/xmlapi2/hot?type=boardgame`)
    const data = await response.text()
    bgData = parser.parse(data).items
    console.log(bgData)
  }
  
</script>

<BggSearch on:message={() => LoadBgg}/>
{#if $bggSearchResult}
  <h1 class="pb-8 text-5xl text-center">Search Result</h1>
  <BggTable data={$bggSearchResult} />
{:else}
  <h1 class="pb-8 text-5xl text-center">BoardGameGeek Top 50 Hotness</h1>
  <div class="flex flex-row flex-wrap gap-6">
    {#if bgData}
      {#each bgData.item as bg (bg.id)}
        <BggCard data={bg} />
      {/each}
    {:else}
      <div class="mx-auto my-6 w-fit">
        <RingLoader size="200" color="#FF3E00" unit="px" duration="2s"/>
      </div>
    {/if}
  </div>
{/if}