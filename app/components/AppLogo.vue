<script setup lang="ts">
defineProps<{
  class?: string
}>()
</script>

<template>
  <NuxtLink to="/" class="flex items-center gap-2" :class="$props.class">
    <UIcon name="i-lucide-zap" class="size-6 text-primary" />
    <span class="font-bold text-lg">Singulatim</span>
  </NuxtLink>
</template>
