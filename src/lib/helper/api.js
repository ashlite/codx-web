import axios from 'axios'
import Cookie from 'js-cookie'

const axiosReq = axios.create({
  headers:{
    Authorization: `Bearer ${Cookie.get('codx_token')}`
  },
  withCredentials: true
})

export async function post(endpoint, data) {
  const url = `${import.meta.env.VITE_BACKEND}${endpoint}` 
  return await axiosReq.post(url, data)
}

export async function get(endpoint) {
  const url = `${import.meta.env.VITE_BACKEND}${endpoint}`
  return await axiosReq.get(url)
}

export async function patch(endpoint, data) {
  const url = `${import.meta.env.VITE_BACKEND}${endpoint}`
  return await axiosReq.patch(url, data)
}

export async function del(endpoint) {
  const url = `${import.meta.env.VITE_BACKEND}${endpoint}`
  return await axiosReq.delete(url)
}

export async function logout(){
  const url = `${import.meta.env.VITE_BACKEND}/logout`
  return await axiosReq.post(url)
}

export async function epost(endpoint, data){
  return await axios.post(endpoint, data)
}

export async function eget(endpoint){
  return await axios.get(endpoint)
}