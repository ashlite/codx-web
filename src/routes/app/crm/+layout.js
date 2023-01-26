import { redirect } from '@sveltejs/kit';


export async function load({ url }) {
  if (url.pathname === '/app/crm'){
    throw redirect(307, '/app/crm/customer');
  } else {
    return {}
  }
}
