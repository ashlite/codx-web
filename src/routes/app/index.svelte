<script context="module">
  /** @type {import('./__types/[slug]').Load} */
  export async function load({ params, fetch, session, stuff }) {

    return {
      status: 307,
      redirect: '/app/catalogue/collection'
    }
  }
</script>