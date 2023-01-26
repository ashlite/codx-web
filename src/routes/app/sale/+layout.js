import { redirect } from '@sveltejs/kit';


export async function load({ url }) {
  if (url.pathname === '/app/sale'){
    throw redirect(307, '/app/sale/opensale');
  } else {
    return {}
  }
}
