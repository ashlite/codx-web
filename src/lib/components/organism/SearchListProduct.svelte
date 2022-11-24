<script script>
  import SearchList from "$lib/components/molecule/SearchList.svelte";
  import BtnSuper from '$lib/components/atom/BtnSuper.svelte'
  import { get } from '$lib/helper/api'

  export let selectedProduct = {}
  let searchState = false
  let resultQuery = []
  let resultList = []

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
    selectedProduct = resultQuery[index]
  }

  function unlinkProduct(){
    selectedProduct = {}
  }
</script>

{#if selectedProduct.name == undefined}
  <SearchList first
    sideText="Product:"
    searchState={searchState}
    bind:resultList={resultList}
    on:querySubmit={e => handleSearch(e.detail)}
    on:selectSubmit={e => handleSelect(e.detail)}
  />
{:else}
  <BtnSuper block text={`(${selectedProduct.name}) ${selectedProduct.collection.name}`} on:click={() => unlinkProduct()} />
{/if}