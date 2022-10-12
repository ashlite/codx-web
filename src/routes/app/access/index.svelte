<script>
  import { globalModal, refreshPage} from "$lib/helper/store"
	import { afterNavigate } from "$app/navigation"
  import { dateFormater } from '$lib/helper/tools'
  import { get } from '$lib/helper/api'

  let listUser = []

  afterNavigate(RefreshData)

  $: $refreshPage && RefreshData()

  async function RefreshData() {
    listUser = await get(`/users/`)
    refreshPage.set(false)
  }

  function openUser(id) {
    window.open(`/app/access/${id}`, '_blank')
  }
</script>

<div class="min-h-screen w-full">
  <div class="overflow-x-auto mx-4">
    <table class="table w-full mt-6">
      <thead>
        <tr>
          <th>User</th>
          <th>Email</th>
          <th>Join Date</th>
          <th>Level</th>
        </tr>
      </thead>
      <tbody>
        {#each listUser as user}
          <tr class="hover" on:click={() => openUser(user.id)}>
            <td>
              <div class="flex flex-row gap-2 items-center">
                <div class="avatar">
                  <div class="w-16 rounded-full">
                    <img src={`https://avatars.dicebear.com/api/adventurer-neutral/${user.first_name}%20${user.last_name}.svg`} alt="user avatar"/>
                  </div>
                </div>
                <div class="text-lg">
                  {`${user.first_name} ${user.last_name}`}
                </div>
              </div>
            </td>
            <td>
              {user.email}
            </td>
            <td>
              {dateFormater(user.registered_at)}
            </td>
            <td class="text-primary font-bold">
              {user.user_level}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>