import { redirect } from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export function load({ locals }) {

  if (locals.user) {
    throw redirect(307, '/app')
  } else {
    return {
      login: false
    }
  }
}