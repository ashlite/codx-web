<script>
  import BtnSuper from '$lib/components/atom/BtnSuper.svelte'
  import BtnIcon from '$lib/components/atom/BtnIcon.svelte'
  import BtnGroup from '$lib/components/atom/BtnGroup.svelte'
  import { createEventDispatcher, onMount } from 'svelte'
  import { toastAlert } from '$lib/helper/store'
  import { dateFormater } from '$lib/helper/tools'
  import { crossfade } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'

  export let noDaily = false
  export let noRange = false
  export let noMonthly = false
  export let defaultDate = false
  export let defaultMonth = false
  
  let buttonText = defaultDate ? `Date: ${dateFormater(defaultDate)}` : defaultMonth ? `Monthly: ${dateFormater(defaultMonth, 'monthly')}` : 'DATE SELECTOR'
  let today = new Date()
  let mode
  let inputDate
  let inputDate2
  let year
  let month
  let totalDate

  onMount(resetDate)

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
  const listDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const dispatch = createEventDispatcher()

  const [send, receive] = crossfade({
		duration: 800,
    easing: quintOut
	})
  
  function forward(data){
    dispatch('pickerSubmit', data)
    document.activeElement.blur()
  }

  function modYear(modifier){
    if (inputDate.getFullYear() <= 2021 && modifier < 0){
      toastAlert.warning('Waktu minimal adalah setelah tahun 2021')
    } else {
      inputDate.setFullYear(year + modifier)
      year = inputDate.getFullYear()
      if (mode == 'daily') totalDate = dateInMonth()
    }
  }
  
  function modMonth(modifier){
    const newMonth = month + modifier
    if (inputDate.getFullYear() <= 2021 && newMonth < 0){
      toastAlert.warning('Waktu minimal adalah setelah tahun 2021')
    } else {
      inputDate.setMonth(newMonth)
      month = inputDate.getMonth()
      if (newMonth < 0 || newMonth > 11) year = inputDate.getFullYear()
      totalDate = new Date(inputDate.getFullYear(), inputDate.getMonth() + 1, 0).getDate()
    }
    
    if (mode == 'daily') totalDate = dateInMonth()
  }

  function submitMonth(id){
    inputDate.setMonth(id, 1)
    inputDate.setHours(0,0,0,0)
    inputDate2 = new Date(inputDate)
    inputDate2.setMonth(id + 1, 0)
    buttonText = `Monthly: ${dateFormater(inputDate, 'monthly')}`
    forward({min: inputDate, max: inputDate2})
  }

  function submitDate(date){
    inputDate.setDate(date)
    buttonText = `Date: ${dateFormater(inputDate)}`
    forward([inputDate.toDateString(), inputDate.toDateString()])
    
  }

  function dateInMonth(){
    let dateInMonthArray = []
    let weeklyArray = []
    const dateIterator = new Date(year, month, 1)
    while (dateIterator.getMonth() == month){
      weeklyArray = []
      for(let i = 0; i < 7; i++){
        if(dateIterator.getDay() == i && dateIterator.getMonth() == month){
          weeklyArray.push(dateIterator.getDate())
          dateIterator.setDate(dateIterator.getDate() + 1)
        }
        else weeklyArray.push(false)
      }
      dateInMonthArray.push(weeklyArray)
    }
    return dateInMonthArray
  }

  function resetDate(){
    inputDate = new Date()
    year = inputDate.getFullYear()
    month = inputDate.getMonth()
    totalDate = dateInMonth()
  }
</script>

<div class="dropdown">
  <BtnSuper full text={buttonText} />
  <div tabindex="0" class="dropdown-content card divide-x p-2 shadow bg-base-200 text-info-content flex flex-row">
    <div class="flex flex-col gap-2 w-28 mx-2 shrink-0 grow-0">
      {#if !noDaily }
        <BtnSuper size="sm" block color={mode=='daily' ? 'primary' : 'secondary'} 
          on:click={() => mode = 'daily'} text={'Daily'} />
      {/if}
      {#if !noRange }
      <BtnSuper size="sm" block color={mode=='range' ? 'primary' : 'secondary'} 
        on:click={() => mode = 'range'} text={'Range'} />
      {/if}
      {#if !noMonthly}
      <BtnSuper size="sm" block color={mode=='monthly' ? 'primary' : 'secondary'} 
        on:click={() => mode = 'monthly'} text={'Monthly'} />
      {/if}
      <BtnSuper size="sm" block color="secondary" on:click={() => resetDate()} icon="uil:refresh" />
    </div>
    <div class="min-w-max">
      {#if mode == 'daily' && month != undefined}
        <div 
          class="flex flex-col justify-center p-2 gap-2" 
          in:send={{key:'daily'}}
          out:receive={{key:'daily'}}  
        >
          <BtnGroup>
            <BtnIcon icon="uil:angle-left" size="sm" color="info" on:click={() => modYear(-1)}/>
            <BtnSuper text={year} size="sm" grow/>
            <BtnIcon icon="uil:angle-right" size="sm" color="info" on:click={() => modYear(1)}/>
          </BtnGroup>
          <BtnGroup>
            <BtnIcon icon="uil:angle-left" size="sm" color="info" on:click={() => modMonth(-1)}/>
            <BtnSuper text={listMonth[month].name} size="sm" grow/>
            <BtnIcon icon="uil:angle-right" size="sm" color="info" on:click={() => modMonth(1)}/>
          </BtnGroup>
          <div class="">
            <table class="table table-compact w-full">
              <thead class="text-base-content">
                {#each listDay as day}
                  <th>{day}</th>
                {/each}
              </thead>
              <tbody>
                {#each totalDate as weekly}
                  <tr>
                    {#each weekly as daily }
                      <td>
                        {#if daily && daily == today.getDate() && month == today.getMonth() && year == today.getFullYear()}
                          <BtnSuper text={daily} color="primary" size='sm' full on:click={() => submitDate(daily)}/>
                        {:else if daily}
                          <BtnSuper text={daily} size='sm' full on:click={() => submitDate(daily)}/>
                        {/if}
                      </td>
                    {/each}
                  </tr>
                {/each}
              </tbody>
              <tfoot class="text-base-content">
                {#each listDay as day}
                  <th>{day}</th>
                {/each}
              </tfoot>
            </table>
          </div>
        </div>

      {:else if mode == 'monthly'}
        <div 
          class="flex flex-col justify-center p-2 gap-2 min-w-72" 
          in:send={{key:'monthly'}}
          out:receive={{key:'monthly'}} 
        >
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
      {/if}
    </div>
  </div>
</div>