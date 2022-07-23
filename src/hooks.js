import * as jose from 'jose'
import cookie from 'cookie'

export async function handle({ event, resolve }) {
  const cookieData = event.request.headers.get('cookie')
  const { codx_token } = cookie.parse(cookieData)
  if (codx_token){
    // const parsedCookie = JSON.parse(cookie)
    const claims = jose.decodeJwt(codx_token)
    if (Date(claims.exp) < Date.now()) {
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

export function getSession({ locals }) {
	return locals.user ? {
		user:{
			name: locals.user.name,
			email: locals.user.email,
			avatar: locals.user.avatar,
			level: locals.user.level
		}
	} : {}
}