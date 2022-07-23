<script context="module">
  export async function load() {
    return {
      status: 307,
      redirect: '/app/catalogue/collection'
    }
  }
</script>

<!-- <script>
  import { listCollection, totalCollection, listCollectionCategory } from '$lib/store'
  
  if (!$totalCollection){
    totalCollection.set(get('/utils/count?collection=1'))
  }
  
  if(!$listCollection){
    listCollection.set(get('/collection?limit=10'))
  }

  if(!$listCollectionCategory){
    listCollectionCategory.set(get('/category'))
  }
</script> -->