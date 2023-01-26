import { redirect } from '@sveltejs/kit';


export async function load({ url }) {
  if (url.pathname === '/app/inventory'){
    throw redirect(307, '/app/inventory/purchase');
  } else {
    return {}
  }
}
