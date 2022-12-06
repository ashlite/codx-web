<script>
  import BtnAddNew from "$lib/components/atom/BtnAddNew.svelte"
  import SearchBar from "$lib/components/molecule/SearchBar.svelte"
  import { refreshPage } from "$lib/helper/store"
  import { afterNavigate } from "$app/navigation"

  let listCard = []
  let filterCard = []

  $: $refreshPage && RefreshData()

  afterNavigate(() => RefreshData())

  async function RefreshData() {
    const response = await get('/library/card')
    listCard = response
    filterCard = response
    refreshPage.set(false)
  }

  function cardSearch(query) {
    filterCard = listCard.filter(item => item.name.includes(query) )
  }
</script>

<div class="flex flex-row gap-8 items-center">
  <h1 class="text-4xl text-primary font-bold">Card Management</h1>
  <SearchBar on:searchTrigger={e => cardSearch(e.detail.searchQuery)} />
  <BtnAddNew text="New Card" />
</div>
<div class="overflow-x-auto">
  <table class="table w-full">
    <!-- head -->
    <thead>
      <tr>
        <th>Name</th>
        <th>Price Group</th>
        <th>ID</th>
      </tr>
    </thead>
    <tbody>
      {#each filterCard as cardData}
        <tr>
          <td>{cardData.name}</td>
          <td>{cardData.group_id}</td>
          <td>{cardData.id}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>