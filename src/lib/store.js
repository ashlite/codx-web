import { writable, derived } from 'svelte/store'

export const bggSearchResult = writable()
export const collectionPagination = writable()
export const collectionDeleteId = writable(false)
export const collectionDeleteName = writable('')
export const listCollection = writable(false)
export const totalCollection = writable(false)
export const toggleModalCollectionEditor = writable(false)

//Untuk keperluan Global Modal
function createModal(){
  const {set, subscribe} = writable(false)
  return{
    subscribe,
    close:() => set(false),
    open:(title) => set({title: title}),
    collectionEditor:() => set({title: 'Collection Editor', type: 'collectionEditor'}),
  }
}

export const globalModal = createModal(false)

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

// Untuk Keperluan Toast Notification
function createToast(){
  const _toast = writable([])
  function send (message, type = 'info', duration = 3000){
    _toast.update(state => {
      return [...state, {message, type, duration}]
    })
  }
  const toast = derived(_toast, ($_toast, set) => {
    set($_toast)
    if ($_toast.length > 0){
      const timer = setTimeout(()=> {
        _toast.update(state => {
          state.shift()
          return state
        })
      }, $_toast[0].duration)
      return () => {
        clearTimeout(timer)
      }
    }
  })
  const {subscribe} = toast
  return {
    subscribe,
    send,
    info: (msg, duration) => send(msg, 'info', duration),
    error: (msg, duration) => send(msg, 'error', duration),
    warning: (msg, duration) => send(msg, 'warning', duration),
    success: (msg, duration) => send(msg, 'success', duration),
  }
}

export const toastAlert = createToast()