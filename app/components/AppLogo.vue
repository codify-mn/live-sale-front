<script setup lang="ts">
defineProps<{
  class?: string
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <NuxtLink
    to="/"
    class="flex items-center gap-2.5 group"
    :class="$props.class"
  >
    <div
      class="rounded-xl bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow duration-300"
      :class="{
        'w-7 h-7': size === 'sm',
        'w-9 h-9': size === 'md' || !size,
        'w-11 h-11': size === 'lg'
      }"
    >
      <UIcon
        name="i-lucide-zap"
        class="text-white"
        :class="{
          'w-3.5 h-3.5': size === 'sm',
          'w-5 h-5': size === 'md' || !size,
          'w-6 h-6': size === 'lg'
        }"
      />
    </div>
    <span
      class="font-bold text-gray-900 dark:text-white"
      :class="{
        'text-base': size === 'sm',
        'text-lg': size === 'md' || !size,
        'text-xl': size === 'lg'
      }"
    >
      Comment<span class="text-gradient">Boost</span>
    </span>
  </NuxtLink>
</template>
