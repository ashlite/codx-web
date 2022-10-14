<script>
  import BtnSuper from '$lib/components/atom/BtnSuper.svelte'
  import BtnIcon from '$lib/components/atom/BtnIcon.svelte'
  import BtnGroup from '$lib/components/atom/BtnGroup.svelte'
  import { createEventDispatcher} from 'svelte'
  import { toastAlert } from '$lib/helper/store'
  import { dateFormater } from '$lib/helper/tools'

  export let defaultDate = false
  const today = new Date()
  let buttonText = defaultDate ? `${dateFormater(defaultDate)}`:`${dateFormater(today)}`
  let year = defaultDate ? defaultDate.getFullYear() : today.getFullYear()
  let month = defaultDate ? defaultDate.getMonth() : today.getMonth()
  let dateValue = defaultDate ? defaultDate : today
  let totalDate = dateInMonth()

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
  
  function forward(){
    dispatch('dateSubmit', dateValue)
    document.activeElement.blur()
  }

  function modYear(modifier){
    if (dateValue.getFullYear() <= 2021 && modifier < 0){
      toastAlert.warning('Waktu minimal adalah setelah tahun 2021')
    } else {
      dateValue.setFullYear(year + modifier)
      year = dateValue.getFullYear()
      totalDate = dateInMonth()
    }
  }
  
  function modMonth(modifier){
    const newMonth = month + modifier
    if (dateValue.getFullYear() <= 2021 && newMonth < 0){
      toastAlert.warning('Waktu minimal adalah setelah tahun 2021')
    } else {
      dateValue.setMonth(newMonth)
      month = dateValue.getMonth()
      if (newMonth < 0 || newMonth > 11) year = dateValue.getFullYear()
    }
    totalDate = dateInMonth()
  }

  function submitDate(date){
    dateValue.setFullYear(year,month,date)
    buttonText = `${dateFormater(dateValue)}`
    forward()
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

</script>

<div class="dropdown">
  <BtnSuper full text={buttonText} />
  <div tabindex="0" class="dropdown-content card divide-x p-2 shadow bg-base-200 text-info-content">
    <div class="min-w-max">
      <div class="flex flex-col justify-center p-2 gap-2">
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
    </div>
  </div>
</div>