export const post = async ({ request }) => {
  const jsonData = await request.json()
  const response = await fetch(`http://localhost:8000/idtokenauth?source=web`,{
    method: 'POST',
    mode: 'cors',
    headers:{
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:3000',
    },
    body: JSON.stringify({
      id_token: jsonData.id_token 
    }),
    withCredentials: true
  })
  const cookieData = response.headers.get('set-cookie')
  console.log(cookieData)

  return {
    headers: {
      'set-cookie': cookieData
    },
    body: {
      ...response.body,
    }
  }
}