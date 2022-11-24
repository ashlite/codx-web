<script>
  import SearchList from "$lib/components/molecule/SearchList.svelte";
  import BtnSuper from "$lib/components/atom/BtnSuper.svelte";
  import { get } from "$lib/helper/api";

  export let selectedCustomer = {}
  let searchState = false
  let resultList = []
  let resultQuery = []

  async function handleSearch(query) {
    searchState = true
    const response = await get(`/customer?q=${query}`)
    if (response.length > 0) {
      resultQuery = response
      resultList = response.map(item => `${item.name} (${item.mobile} / ${item.email})`)
    }
    searchState = false 
  }

  function handleSelect(index) {
    selectedCustomer = resultQuery[index]
  }

  function unlinkCustomer() {
    selectedCustomer = {}
  }
</script>

{#if selectedCustomer.id == undefined}
  <SearchList first
    sideText="Customer:"
    searchState={searchState}
    bind:resultList={resultList}
    on:querySubmit={e => handleSearch(e.detail)}
    on:selectSubmit={e => handleSelect(e.detail)}
  />
{:else}
  <BtnSuper block text={`${selectedCustomer.name}`} on:click={() => unlinkCustomer()} />
{/if}