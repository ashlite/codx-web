<script>
  import { toastAlert } from "$lib/helper/store"
  import { fade} from 'svelte/transition'
</script>

<div class="fixed z-[100] w-1/4 bottom-12 left-12">
  <div class='toast'>
    {#each $toastAlert as toast}
      <div class="alert shadow-lg my-2 {toast.type == 'info' ? 'alert-info' : toast.type == 'error' ? 'alert-error' : toast.type == 'warning' ? 'alert-warning' : 'alert-success'}" transition:fade>
        <div>
          <span>{toast.message}</span>
        </div>
      </div>
    {/each}
  </div>
</div>