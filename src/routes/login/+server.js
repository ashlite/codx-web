export const GET = async () => {
  return new Response()
}

export const POST = async ({ request, cookies }) => {
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
  const bodyData = await resData.json()
  cookies.set('codx_token', bodyData.access_token, {path: '/'})

  return new Response(JSON.stringify(bodyData))
}