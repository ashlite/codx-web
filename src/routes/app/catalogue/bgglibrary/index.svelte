<script>
  import { onMount } from 'svelte'
  import { RingLoader } from 'svelte-loading-spinners'
  import BggCard from '$lib/components/organism/BggCard.svelte'
  import BggTable from '$lib/components/molecule/BggTable.svelte'
  import { bggSearchResult } from '$lib/helper/store'
  import {XMLParser} from 'fast-xml-parser'
  import SearchBar from '$lib/components/molecule/SearchBar.svelte'
  import { eget } from '$lib/helper/api'
  import { toastAlert } from '$lib/helper/store'
  import { afterNavigate } from '$app/navigation'
  import Status from '$lib/components/atom/Status.svelte'

  let bgData = false
  let searching = false
  let totalResult
  const parser = new XMLParser({
    ignoreAttributes : false,
    attributeNamePrefix : "",
  })

  afterNavigate(() => {
    LoadBggHot()
    bggSearchResult.set(false)
  })

  async function LoadBggHot(){
    const response = await eget(`https://boardgamegeek.com/xmlapi2/hot?type=boardgame`)
    const data = await response.data
    bgData = parser.parse(data).items
  }

  async function SearchBGG(query){
    if (query) {
      searching = true
      let stripQuery = query.replaceAll(' ', '+')
      try {
        const response = await eget(`https://boardgamegeek.com/xmlapi2/search?type=boardgame,boardgameexpansion&query=${stripQuery}`)
        const dataBgg = parser.parse(await response.data)
        console.log(dataBgg)
        totalResult = dataBgg.items.total
        if (totalResult > 1) {
          bggSearchResult.set(dataBgg.items.item)
        } else if (totalResult == 1) {
          bggSearchResult.set([dataBgg.items.item])
        } else {
          bggSearchResult.set([])
        }
      } catch (error) {
        toastAlert.error(error.message)
      } finally {
        searching = false
      }
    }
  }
  
</script>

<div class = "flex flex-row justify-center w-full mb-8 gap-4">
  <div class="flex flex-col gap-2 content-center ">
    <h2 class="text-3xl">Search Board Game Geek</h2>
    <SearchBar on:searchTrigger={e => SearchBGG(e.detail.searchQuery)} searchState={searching} searchTotal={totalResult}/>
  </div>
</div>
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