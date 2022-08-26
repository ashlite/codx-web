<script>
  import PaginationNav from "$lib/components/PaginationNav.svelte"
  import { shortcut } from "$lib/shortcut"
import { globalModal } from "$lib/store";
</script>

<div class="w-full min-h-screen pt-2 pb-4 px-4">
  <h1 class="text-5xl font-bold text-primary text-center">Stock Purchase</h1>
  
  <div class="divider my-2"/>
  
  <div class="flex flex-row justify-between items-center gap-4 mb-2">
    <div class="stat w-32">
      <div class="stat-title">Total Items</div>
      <div class="stat-value text-primary">100</div>
    </div>
    <div class="dropdown w-full w-60">
      <button class="btn gap-2 w-full btn-md">
        Date Selector
      </button>
      <!-- dropdown content -->
      <div class="dropdown-content card card-compact w-64 p-2 shadow bg-primary text-primary-content">
        <div class="card-body">
          <h3 class="card-title">Card title!</h3>
          <p>you can use any element as a dropdown.</p>
        </div>
      </div>
    </div>
    <div class="form-control w-full max-w-xs">
      <label class="label" for="purchase_status">
        <span class="label-text">Purchase Status</span>
      </label>
      <select id="purchase-status" class="select select-bordered select-sm">
        <option selected>All Status</option>
        <option>In Progress</option>
        <option>Finish</option>
      </select>
    </div>
    <div class="w-60">
      <button class="btn btn-primary btn-md w-full" use:shortcut={{alt:true, shift:true, code:'KeyN' }} on:click={() => globalModal.createPurchase()}>
        Create Purchase
        <span class="ml-4">
          <kbd class="kbd kbd-xs text-base-content">N</kbd>
        </span>
      </button>
    </div>
  </div>
  <PaginationNav />

  <div class="overflow-x-auto">
    <table class="table w-full">
      <thead>
        <tr>
          <th>Id</th>
          <th>Date</th>
          <th>Supplier</th>
          <th>Total Purchase</th>
          <th>Approval</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
      <tfoot>
        <tr>
          <th>Id</th>
          <th>Date</th>
          <th>Supplier</th>
          <th>Total Purchase</th>
          <th>Approval</th>
          <th>Action</th>
        </tr>
      </tfoot>
    </table>
  </div>
</div>