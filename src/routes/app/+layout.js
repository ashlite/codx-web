import { redirect } from '@sveltejs/kit';


export function load({ session }) {
	if (!session.user) {
		throw redirect(307, `/unauthorized`);
	}
	return {
  user: session.user
}
}
