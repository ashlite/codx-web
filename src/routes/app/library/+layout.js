import { redirect } from '@sveltejs/kit';


export async function load({ url }) {
  if (url.pathname === '/app/library'){
    throw redirect(307, '/app/library/dashboard');
  } else {
    return {}
  }
}
