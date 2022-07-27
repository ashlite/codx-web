export const get = async () => {
  return{
    status:200
  }
}

export const post = async ({ request }) => {
  const jsonData = await request.json()
  const response = await fetch(`${import.meta.env.VITE_BACKEND}/idtokenauth?source=web`,{
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
  const forwardBody = await response.json()

  return {
    headers: {
      'set-cookie': cookieData
    },
    body: {
      forwardBody,
    }
  }
}