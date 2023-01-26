import { redirect } from '@sveltejs/kit';


export async function load({ url }) {
  if (url.pathname === '/app/catalogue'){
    throw redirect(307, '/app/catalogue/collection');
  } else {
    return {}
  }
}
