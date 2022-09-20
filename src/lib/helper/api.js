import axios from 'axios'
import Cookie from 'js-cookie'
import { toastAlert } from '$lib/helper/store'

const axiosReq = axios.create({
  headers:{
    Authorization: `Bearer ${Cookie.get('codx_token')}`
  },
  withCredentials: true
})

export async function post(endpoint, data, option) {
  const url = `${import.meta.env.VITE_BACKEND}${endpoint}`
  try{
    const response = await axiosReq.post(url, data, option)
    if (response.status < 400){
      toastAlert.success('Operation Success')
      return response.data
    } else {
      toastAlert.error(`Error Status: ${response.status}. ${response.data}`)
      return {}
    } 
  } catch(error){
    toastAlert.error(error.detail)
    return {}
  }
}

export async function get(endpoint) {
  const url = `${import.meta.env.VITE_BACKEND}${endpoint}`
  try{
    const response = await axiosReq.get(url)
    if (response.status < 400){
      return response.data
    } else {
      toastAlert.error(`Error Status: ${response.status}. ${response.data}`)
      return {}
    }
  } catch(error){
    toastAlert.error(error.message)
    return {}
  } 
}

export async function download(endpoint) {
  const url = `${import.meta.env.VITE_BACKEND}${endpoint}`
  try{
    const response = await axiosReq.get(url, {responseType: 'arraybuffer'})
    if (response.status < 400){
      return response
    } else {
      toastAlert.error(`Error Status: ${response.status}. ${response.data}`)
      return {}
    }
  } catch(error){
    toastAlert.error(error.message)
    return {}
  } 
}

export async function patch(endpoint, data) {
  const url = `${import.meta.env.VITE_BACKEND}${endpoint}`
  try{
    const response = await axiosReq.patch(url, data)
    if (response.status < 400){
      toastAlert.success('Update Success')
      return response
    } else {
      toastAlert.error(`Error Status: ${response.status}. ${response.data}`)
      return {}
    }
  } catch(error){
    toastAlert.error(error.message)
    return{}
  } 
}

export async function del(endpoint) {
  const url = `${import.meta.env.VITE_BACKEND}${endpoint}`
  try{
    const response = await axiosReq.delete(url)
    if (response.status < 400){
      toastAlert.success('Item Deleted')
    } else {
      toastAlert.error(`Error Status: ${response.status}. ${response.data}`)
      return {}
    }
  } catch(error){
    toastAlert.error(error.response.data.detail)
    return{}
  } 
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