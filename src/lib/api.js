export async function post(endpoint, data) {
  const url = `${import.meta.env.VITE_BACKEND}${endpoint}`
  return fetch(url, {
		method: 'POST',
		credentials: 'include',
    mode: 'cors',
		headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain',

		},
    body: JSON.stringify(data)
	}).then((res) => res.json())

}

export async function get(endpoint) {
  const url = `${import.meta.env.VITE_BACKEND}${endpoint}`
	return fetch(url, {
		method: 'GET',
		credentials: 'include',
    mode: 'cors',
		headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain',
		}
	}).then((res) => res.json())
}

export async function patch(endpoint, data) {
  const url = `${import.meta.env.VITE_BACKEND}${endpoint}`
  return fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain',
    },
    body: JSON.stringify(data)
  }).then((res) => res.json())
}

export async function del(endpoint) {
  const url = `${import.meta.env.VITE_BACKEND}${endpoint}`
  return fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain',
    }
  }).then((res) => res.json())
}

export async function logout(){
  const url = `${import.meta.env.VITE_BACKEND}/logout`
  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain',
    }
  }).then((res) => res.json())
}