<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

<!-- The footer stays at the bottom of a short page; the desktop drawn across it never scrolls it sideways. -->
<div class="flex min-h-svh flex-col overflow-x-clip [&>main]:flex-1">
  {@render children()}
</div>
