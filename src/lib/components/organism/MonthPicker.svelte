<script>
  import BtnSuper from '$lib/components/atom/BtnSuper.svelte'
  import BtnIcon from '$lib/components/atom/BtnIcon.svelte'
  import BtnGroup from '$lib/components/atom/BtnGroup.svelte'
  import { createEventDispatcher} from 'svelte'
  import { toastAlert } from '$lib/helper/store'
  import { dateFormater } from '$lib/helper/tools'

  const today = new Date()
  let dateValue = new Date()
  let buttonText = `${dateFormater(dateValue, 'monthly')}`
  let year = dateValue.getFullYear()
  const listMonth = [
    {id:0, name: 'Januari'},
    {id:1, name: 'Februari'},
    {id:2, name: 'Maret'},
    {id:3, name: 'April'},
    {id:4, name: 'Mei'},
    {id:5, name: 'Juni'},
    {id:6, name: 'Juli'},
    {id:7, name: 'Agustus'},
    {id:8, name: 'September'},
    {id:9, name: 'Oktober'},
    {id:10, name: 'November'},
    {id:11, name: 'Desember'},
  ]

  const dispatch = createEventDispatcher()  
  function forward(){
    dispatch('monthSubmit', dateValue)
    document.activeElement.blur()
  }

  function modYear(modifier){
    if (dateValue.getFullYear() <= 2021 && modifier < 0){
      toastAlert.warning('Waktu minimal adalah setelah tahun 2021')
    } else {
      dateValue.setFullYear(year + modifier)
      year = dateValue.getFullYear()
    }
  }

  function submitMonth(id){
    dateValue.setMonth(id)
    buttonText = `${dateFormater(dateValue, 'monthly')}`
    forward()
  }
</script>

<div class="dropdown">
  <BtnSuper full text={buttonText} />
  <div tabindex="0" class="dropdown-content card divide-x p-2 shadow bg-base-200 text-info-content">
    <div class="min-w-max">
      <div class="flex flex-col justify-center p-2 gap-2 min-w-72" >
        <BtnGroup>
          <BtnIcon icon="uil:angle-left" size="sm" color="info" on:click={() => modYear(-1)}/>
          <BtnSuper text={year} size="sm" grow/>
          <BtnIcon icon="uil:angle-right" size="sm" color="info" on:click={() => modYear(1)}/>
        </BtnGroup>
        <div class="grid grid-cols-3 gap-2">
          {#each listMonth as month}
            {#if month.id == today.getMonth() && year == today.getFullYear()}
              <BtnSuper text={month.name} color="primary" size="sm" on:click={() => submitMonth(month.id)} outline />
            {:else}
              <BtnSuper text={month.name} size="sm" on:click={() => submitMonth(month.id)} outline />
            {/if}
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>