<script>
  import { toastAlert } from "$lib/store"

</script>

<div class="alert alert-{toastAlert.type} shadow-lg">
  <div>
    <span>{toastAlert.message}</span>
  </div>
</div>