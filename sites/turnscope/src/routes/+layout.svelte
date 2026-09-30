<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

<!-- The footer stays at the bottom of a short page. -->
<div class="flex min-h-svh flex-col [&>main]:flex-1">
  {@render children()}
</div>
