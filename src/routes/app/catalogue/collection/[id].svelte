<script>
  import { get } from '$lib/api'
  import { page } from '$app/stores'
  import { onMount, onDestroy } from 'svelte'
  import { decodeHTML } from 'entities'
  import { marginCalc, priceFormater } from '$lib/tools'
  import { globalModal, collectionRefresh } from '$lib/store'

  let collection

  const unsubscribe = collectionRefresh.subscribe(value => {
    if (value){
      RefreshData()
      collectionRefresh.set(false)
    }
  })
  onDestroy(unsubscribe)
  
  onMount(() => RefreshData())

  async function RefreshData(){
    let response = await get(`/collection/${$page.params.id}`)
    if (response.status == 200){
      collection = response.data
    }
  }
  
</script>

{#if collection != undefined}
  <div class="border-b-2 border-accent pb-2 mb-4">
    <h1 class="text-3xl font-bold">{collection.released} - {decodeHTML(collection.name)}</h1>
  </div>
  <div class="grid grid-cols-12 gap-4">
    
    <!-- Image row span-->
    <div class="col-span-4 row-span-4 row-start-1 col-start-1 max-h-80">
      {#if collection.cover != undefined}
        <img src={collection.cover} alt="Collection Cover" class="object-contain" />
      {:else}
        <img src="https://dummyimage.com/1000x1000/edb200/ffffff&text=NO+IMG" alt="No Img Fallback" class="object-contain"/>
      {/if}
    </div>
    <!-- Row 1 data -->
    <div class="col-span-3 flex gap-2">
      <p class="text-xl font-bold">Category:</p>
      <span class="text-xl">{collection.category}</span>
    </div>
    <div class="col-span-3 flex gap-2">
      <p class="text-xl font-bold">ID BGG:</p>
      {#if collection.bgg_id != undefined}
        <a href="https://boardgamegeek.com/boardgame/{collection.bgg_id}" target="_blank" class="link link-primary text-xl">{collection.bgg_id}</a>
      {:else}
        <span>N/A</span>
      {/if}
    </div>
    <div class="col-span-2">
      <button class="btn btn-sm btn-warning w-full" on:click={()=> globalModal.collectionEdit(collection)}>
        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path xmlns="http://www.w3.org/2000/svg" d="M16.2929 3.29289C16.6834 2.90237 17.3166 2.90237 17.7071 3.29289L20.7071 6.29289C21.0976 6.68342 21.0976 7.31658 20.7071 7.70711L11.7071 16.7071C11.5196 16.8946 11.2652 17 11 17H8C7.44772 17 7 16.5523 7 16V13C7 12.7348 7.10536 12.4804 7.29289 12.2929L16.2929 3.29289ZM9 13.4142V15H10.5858L18.5858 7L17 5.41421L9 13.4142ZM3 7C3 5.89543 3.89543 5 5 5H10C10.5523 5 11 5.44772 11 6C11 6.55228 10.5523 7 10 7H5V19H17V14C17 13.4477 17.4477 13 18 13C18.5523 13 19 13.4477 19 14V19C19 20.1046 18.1046 21 17 21H5C3.89543 21 3 20.1046 3 19V7Z" fill="#0D0D0D"></path>
        </svg>
        Edit
      </button>
    </div>

    <!-- Row 2 Game Data -->
    {#if collection.category == 'Core Game' || collection.category == 'Core & Expansion' || collection.category == "Expansion"}
      <div class="col-span-8">
        <div class="stats shadow">
          <div class="stat">
            <div class="stat-title">Total Players</div>
            {#if collection.min_player == collection.max_player || collection.max_player == undefined}
              <div class="stat-value text-secondary">{collection.min_player}</div>
            {:else if collection.min_player == undefined}
              <div class="stat-value text-secondary">N/A</div>
            {:else}
              <div class="stat-value text-secondary">{collection.min_player} - {collection.max_player}</div>
            {/if}
          </div>
          
          <div class="stat">
            <div class="stat-title">Duration (Minutes)</div>
            {#if collection.min_playtime == collection.max_playtime || collection.max_playtime == undefined}
              <div class="stat-value text-secondary">{collection.min_playtime}</div>
            {:else if collection.min_playtime == undefined}
              <div class="stat-value text-secondary">N/A</div>
            {:else}
              <div class="stat-value text-secondary">{collection.min_playtime} - {collection.max_playtime}</div>
            {/if}
          </div>
          
          <div class="stat">
            <div class="stat-title">Minimal Ages</div>
            {#if collection.min_age !=  undefined}
              <div class="stat-value text-secondary">{collection.min_age}</div>
            {:else}
              <div class="stat-value text-secondary">N/A</div>
            {/if}
          </div>

          <div class="stat">
            <div class="stat-title">Difficulties</div>
            {#if collection.game_difficulties !=  undefined && collection.game_difficulties > 0}
              <div class="stat-value text-secondary">{collection.game_difficulties}</div>
            {:else}
              <div class="stat-value text-secondary">N/A</div>
            {/if}
          </div>
          
        </div>
      </div>
    {/if}

    <!-- Row 3 Game Description -->
    <div class="col-span-8 flex gap-2 max-h-60 overflow-y-scroll">
      {#if collection.description != undefined}
        <p class="textarea w-full whitespace-pre-wrap">{decodeHTML(collection.description)}</p>        
      {:else}
        <p class="text-xl font-bold">No Description</p>
      {/if}
    </div>
  </div>

  <div class="bg-secondary rounded-md py-2 px-4">
    <h2 class="font-bold text-2xl text-secondary-content">Product List</h2>
  </div>
  <div class="">
    <table class="table w-full">
      <!-- head -->
      <thead>
        <tr>
          <th>Pic</th>
          <th>Name</th>
          <th>Buy Price</th>
          <th>Sell Price</th>
          <th>Margin</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {#if collection.product != undefined}
          {#each collection.product as product}
            <tr>
              <td> 
                <div class="avatar">
                  <div class="w-24 h-24 rounded">
                    {#if product.product_image != undefined}
                      <img src={product.product_image} alt="Product" class="object-contain" />
                    {:else}
                      <img src="https://dummyimage.com/300x300/edb200/ffffff&text=NO+IMG" alt="No Img Fallback" class="object-contain"/>
                    {/if}
                  </div>
                </div>
              </td>
              <td>{product.name}</td>
              <td>{priceFormater(product.buy_price)}</td>
              <td>{priceFormater(product.sell_price)}</td>
              <td>
                <div>{priceFormater(marginCalc(product.buy_price, product.sell_price, 'nominal'))}</div>
                {#if marginCalc(product.buy_price, product.sell_price, 'percent') > 25}
                  <div class="badge badge-success font-bold">{marginCalc(product.buy_price, product.sell_price, 'percent')}%</div>
                {:else if marginCalc(product.buy_price, product.sell_price, 'percent') > 5}
                  <div class="badge badge-warning font-bold">{marginCalc(product.buy_price, product.sell_price, 'percent')}%</div>
                {:else}
                  <div class="badge badge-error font-bold">{marginCalc(product.buy_price, product.sell_price, 'percent')}%</div>
                {/if}
              </td>
              <td>
                <button class="btn btn-md btn-warning">
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path xmlns="http://www.w3.org/2000/svg" d="M16.2929 3.29289C16.6834 2.90237 17.3166 2.90237 17.7071 3.29289L20.7071 6.29289C21.0976 6.68342 21.0976 7.31658 20.7071 7.70711L11.7071 16.7071C11.5196 16.8946 11.2652 17 11 17H8C7.44772 17 7 16.5523 7 16V13C7 12.7348 7.10536 12.4804 7.29289 12.2929L16.2929 3.29289ZM9 13.4142V15H10.5858L18.5858 7L17 5.41421L9 13.4142ZM3 7C3 5.89543 3.89543 5 5 5H10C10.5523 5 11 5.44772 11 6C11 6.55228 10.5523 7 10 7H5V19H17V14C17 13.4477 17.4477 13 18 13C18.5523 13 19 13.4477 19 14V19C19 20.1046 18.1046 21 17 21H5C3.89543 21 3 20.1046 3 19V7Z" fill="#0D0D0D"></path>
                  </svg>
                </button>
                <button class="btn btn-md btn-error">
                  <svg viewBox="0 0 24 24" class="h-6 w-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path xmlns="http://www.w3.org/2000/svg" d="M7 4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V6H18.9897C18.9959 5.99994 19.0021 5.99994 19.0083 6H21C21.5523 6 22 6.44772 22 7C22 7.55228 21.5523 8 21 8H19.9311L19.0638 20.1425C18.989 21.1891 18.1182 22 17.0689 22H6.93112C5.88184 22 5.01096 21.1891 4.9362 20.1425L4.06888 8H3C2.44772 8 2 7.55228 2 7C2 6.44772 2.44772 6 3 6H4.99174C4.99795 5.99994 5.00414 5.99994 5.01032 6H7V4ZM9 6H15V4H9V6ZM6.07398 8L6.93112 20H17.0689L17.926 8H6.07398ZM10 10C10.5523 10 11 10.4477 11 11V17C11 17.5523 10.5523 18 10 18C9.44772 18 9 17.5523 9 17V11C9 10.4477 9.44772 10 10 10ZM14 10C14.5523 10 15 10.4477 15 11V17C15 17.5523 14.5523 18 14 18C13.4477 18 13 17.5523 13 17V11C13 10.4477 13.4477 10 14 10Z" fill="#0D0D0D"></path>
                  </svg>
                </button>
              </td>
            </tr>
          {/each}
        {/if}
        <tr>
          <td colspan="6">
            <button class="btn btn-sm btn-success">
              <svg viewBox="0 0 24 24" class="h-6 w-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path xmlns="http://www.w3.org/2000/svg" d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z" fill="#0D0D0D"></path>
              </svg> 
              Add new Product
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
{/if}