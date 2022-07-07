<script>
  export let idModal
  export let idBGG = null
</script>

<input type="checkbox" id={idModal} class="modal-toggle" />
<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Boardgame {idBGG}</h3>
    <p class="py-4">You've been selected for a chance to get one year of subscription to use Wikipedia for free!</p>
    <div class="modal-action">
      <label for={idModal} class="btn">Yay!</label>
    </div>
  </div>
</div>
