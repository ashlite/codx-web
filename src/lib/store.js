import { writable } from 'svelte/store'

export const bggSearchResult = writable()
export const collectionPagination = writable()
export const collectionDeleteId = writable(false)
export const collectionDeleteName = writable('')