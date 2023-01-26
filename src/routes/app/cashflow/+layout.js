import { redirect } from '@sveltejs/kit';


export async function load({ url }) {
  if (url.pathname === '/app/cashflow'){
    throw redirect(307, '/app/cashflow/ledger');
  } else {
    return {}
  }
}
