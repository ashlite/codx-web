<!-- <script context="module">
  export async function load({ fetch }) {
    const response = await fetch(`https://boardgamegeek.com/xmlapi2/hot?type=boardgame`)
    const data = await response.text()
    
    return {
      status: response.status,
      props: {
        data
      }
    }
  }
</script> -->

<script>
  import { onMount } from 'svelte'
  import { RingLoader } from 'svelte-loading-spinners'
  import BggSearch from '$lib/components/BggSearch.svelte'
  import BggCard from '$lib/components/BggCard.svelte'
  import BggTable from '$lib/components/BggTable.svelte'
  import { bggSearchResult } from '$lib/store'

  let bgData = false

  onMount(() => {
    LoadBgg()
  })

  async function LoadBgg(){
    const response = await fetch(`https://boardgamegeek.com/xmlapi2/hot?type=boardgame`)
    const data = await response.text()
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(data,"text/xml")
    bgData = xmlDoc.getElementsByTagName('item')
  }
  
</script>

<BggSearch on:message={() => LoadBgg}/>
{#if $bggSearchResult}
  <h1 class="pb-8 text-5xl text-center">Search Result</h1>
  <BggTable xmlDataFull={$bggSearchResult} />
{:else}
  <h1 class="pb-8 text-5xl text-center">BoardGameGeek Top 50 Hotness</h1>
  <div class="flex flex-row flex-wrap gap-6">
    {#if bgData}
      {#each bgData as bg (bg.getAttribute('id'))}
        <BggCard xmlData={bg} />
      {/each}
    {:else}
      <div class="mx-auto my-6 w-fit">
        <RingLoader size="200" color="#FF3E00" unit="px" duration="2s"/>
      </div>
    {/if}
  </div>
{/if}