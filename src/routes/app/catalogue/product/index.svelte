<script>
  import { get } from '$lib/api'

  let listProduct = get(`/product/`)
</script>

<div class="overflow-x-auto">
  <table class="table table-compact w-full">
    <thead>
      <tr> 
        <th>Collection</th> 
        <th>Product</th>
        <th>SKU</th> 
        <th>Buy Price</th> 
        <th>Sell Price</th> 
      </tr>
    </thead>
    <tbody>
      {#await listProduct then value}
        {#each value.data as product}
          <tr>
            <td>{product.name}</td>
            <td>{product.product}</td>
            <td>{product.sku}</td>
            <td>{product.buy_price}</td>
            <td>{product.sell_price}</td>
          </tr>
        {/each}
      {/await}
    </tbody> 
  </table>
</div>