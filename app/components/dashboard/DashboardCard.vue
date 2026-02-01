<script setup lang="ts">
interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  hover: false,
  clickable: false
})

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6'
}
</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm"
    :class="[
      paddingClasses[padding],
      hover &&
        'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200',
      clickable && 'cursor-pointer'
    ]"
  >
    <slot />
  </div>
</template>
