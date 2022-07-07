import Cookies from 'js-cookie'
let token = Cookies.get('codx-token')

export async function post(endpoint, data) {
  const url = `http://localhost:8000${endpoint}`
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
  const url = `http://localhost:8000${endpoint}`
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
  const url = `http://localhost:8000${endpoint}`
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
  const url = `http://localhost:8000${endpoint}`
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
  const url = `http://localhost:8000/logout`
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