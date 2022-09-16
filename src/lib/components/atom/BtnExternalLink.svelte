<script>
  import Icon from '@iconify/svelte'
  export let href
</script>

<a class="btn btn-info" href={href}>
  <Icon icon="uil:external-link-alt" width="30" height="30" />
</a>