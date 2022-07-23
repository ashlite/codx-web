import { writable } from 'svelte/store'

export const bggSearchResult = writable()
export const collectionPagination = writable()
export const collectionDeleteId = writable(false)
export const collectionDeleteName = writable('')
export const listCollection = writable(false)
export const totalCollection = writable(false)
export const toggleModalCollectionEditor = writable(false)
export const toastAlert = writable(false)

//Untuk keperluan Collection Editor
function createCollection(){
  const {subscribe, set} = writable({
    name: '',
    category: 'Core Game',
    released: 0,
    min_player: 0,
    max_player: 0,
    min_playtime: 0,
    max_playtime: 0,
    min_age: 0,
    bgg_id: '',
    game_difficulties: 0.0,
    cover: '',
    thumb_cover: '',
    description: '',
    master: [],
    slave: [],
    bgg_group: [],
  })
  return {
    subscribe,
    set,
    reset: () => {
      set({
        name: '',
        category: 'Core Game',
        released: 0,
        min_player: 0,
        max_player: 0,
        min_playtime: 0,
        max_playtime: 0,
        min_age: 0,
        bgg_id: '',
        game_difficulties: 0.0,
        cover: '',
        thumb_cover: '',
        description: '',
        master: [],
        slave: [],
        bgg_group: [],
      })
    }
  }
} 
export const collectionEditorData = createCollection()
export const listCollectionCategory = writable(false)