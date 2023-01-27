import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
	if (!locals.user) {
		throw redirect(307, `/unauthorized`);
	}
	return {
    user: locals.user
  }
}
