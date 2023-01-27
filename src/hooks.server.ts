import * as jose from 'jose'
import cookie from 'cookie'

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const codxToken = event.cookies.get('codx_token')
  if (codxToken && codxToken != undefined){
    const claims = await jose.decodeJwt(codxToken)
    const today = new Date()
    const expired = new Date(claims.exp * 1000)

    if (expired < today) {
      event.locals.user = null
    } else {
      event.locals.user = {
        name: claims.name,
        email: claims.email,
        avatar: claims.avatar,
        level: claims.level,
      }
    }
  } else {
    event.locals.user = null
  }

	return await resolve(event);
}