import { redirect } from '@sveltejs/kit';
import Cookies from 'js-cookie'
import { logout } from '$lib/helper/api'
import { session } from '$app/stores'

export async function load() {
  await logout()
  Cookies.remove('codx_token')
  session.user = null
  throw redirect(307, '/unauthorized');
}
