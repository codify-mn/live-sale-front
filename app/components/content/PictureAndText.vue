<script setup lang="ts">
defineProps<{
  reverse?: boolean
}>()
</script>

<template>
  <div class="grid lg:grid-cols-2 gap-8 items-center" :class="{ 'lg:flex-row-reverse': reverse }">
    <div class="prose prose-primary dark:prose-invert max-w-none">
      <slot name="text" />
    </div>
    <div>
      <slot name="picture" />
    </div>
  </div>
</template>
