<script setup lang="ts">
defineProps<{
  columns?: number
}>()
</script>

<template>
  <div
    class="grid gap-4"
    :style="{ gridTemplateColumns: `repeat(${columns || 3}, minmax(0, 1fr))` }"
  >
    <slot />
  </div>
</template>
