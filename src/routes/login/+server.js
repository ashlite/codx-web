export const get = async () => {
  return new Response()
}

export const post = async ({ request }) => {
  const jsonData = await request.json()
  const resData = await fetch(`${import.meta.env.VITE_BACKEND}/idtokenauth?source=web`,{
    method: 'POST',
    mode: 'cors',
    headers:{
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': 'http://localhost:3000',
    },
    body: JSON.stringify({
      id_token: jsonData.id_token 
    }),
    withCredentials: true
  })
  const cookieData = resData.headers.get('set-cookie')
  const forwardBody = await resData.json()
  const headersData = new Headers()
  headersData.append('set-cookie', cookieData)

  return new Response(JSON.stringify(forwardBody), headersData)
}