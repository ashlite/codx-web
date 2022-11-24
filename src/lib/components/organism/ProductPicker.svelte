<script>
  import { createEventDispatcher } from "svelte";
  import SearchList from "$lib/components/molecule/SearchList.svelte";
  import { get } from '$lib/helper/api'

  let searchState = false
  let resultQuery = []
  let resultList = []
  const dispatch = createEventDispatcher()

  async function handleSearch(query){
    searchState = true
    const response = await get(`/product?q=${query}`)
    if (response.length > 0) {
      resultQuery = response
      resultList = response.map(item => `(${item.name}) ${item.collection.name} - ${item.collection.released}`)
    }
    searchState = false
  }

  function handleSelect(index){
    dispatch('selected', resultQuery[index])
  }

</script>

<SearchList first
  sideText="Product:"
  searchState={searchState}
  bind:resultList={resultList}
  on:querySubmit={e => handleSearch(e.detail)}
  on:selectSubmit={e => handleSelect(e.detail)}
/>