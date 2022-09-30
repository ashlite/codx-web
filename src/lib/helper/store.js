import { writable, derived } from 'svelte/store'

export const bggSearchResult = writable()
export const collectionPagination = writable()
export const collectionDeleteId = writable(false)
export const collectionDeleteName = writable('')
export const listCollection = writable(false)
export const totalCollection = writable(false)
export const toggleModalCollectionEditor = writable(false)
export const refreshPage = writable(false) // request refresh ke subscriber
export const toggleMainDrawer = writable(true)

//Untuk keperluan Global Modal
function createModal(){
  const {set, subscribe} = writable(false)
  return{
    subscribe,
    close:() => set(false),
    collectionCreate:() => set({title: 'Create New Collection', type: 'createCollection', size:'lg'}),
    collectionFromBgg:(id) => set({title: 'Create New Collection', type: 'createCollection', size:'lg', data: {bggId: id}}),
    deleteConfirmation:(id, name, type) => set({title: 'Delete Confirmation', type: 'deleteConfirmation', size:'sm', data: {id, name, type}}),
    collectionEdit:(collection) => set({title: 'Edit Collection', type: 'editCollection', size:'lg', data: {collection}}),
    editProduct:(product, collection) => set({title: 'Product Editor', type: 'editProduct', size:'md', data: {product, collection}}),
    connectionEditor:(collection) => set({title: 'Connection Setting', type: 'connectionEditor', size:'lg', data: {collection}}),
    editCustomer:(customer) => set({title: 'Customer Editor', type: 'customerEditor', size:'md', data: {customer}}),
    editSupplier:(supplier) => set({title: 'Supplier Editor', type: 'supplierEditor', size:'md', data: {supplier}}),
    editVenue:(venue) => set({title: 'Venue Editor', type: 'venueEditor', size:'md', data: {venue}}),
    editForex:(forex) => set({title: 'Edit Forex', type: 'forexEditor', size:'sm', data: {...forex, edit:true}}),
    createForex:() => set({title: 'Create Forex', type: 'forexEditor', size:'sm', data: {}}),
    createPurchase:() => set({title: 'Create new Purchase', type: 'newPurchase', size:'md'}),
    editPurchase:(data) => set({title: 'Edit Purchase', type: 'newPurchase', size:'md', data: {...data}}),
    cancelConfirmation:(id) => set({title: 'Cancel Confirmation', type: 'cancelConfirmation', size:'sm', data: {id}}),
    addPurchaseProduct:(idrBuyRate, headerId) => set({title: 'Add Product to Purchase', type: 'addPurchaseProduct', size:'md', data:{idrBuyRate, headerId}}),
    addPurchaseNewCollection:(headerId, idrBuyRate = 0) => set({title: 'Add New Collection With This Purchase', type: 'createCollection', size:'lg', data: {headerId: headerId, idrBuyRate: idrBuyRate}}),
    createHeaderMovement:(purchaseId) => set({title: 'Create Header Movement', type: 'addHeaderMovement', size:'sm', data:{header_purchase_id: purchaseId}}),
    addMovement:() => set({title: 'Add Product Movement', type: 'addMovement', size:'sm'})
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
  function send (message, type, duration = 1800){
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