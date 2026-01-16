<script setup lang="ts">
interface Props {
  title: string
  description?: string
  icon?: string
  to?: string
}

defineProps<Props>()
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer group"
  >
    <div
      v-if="icon"
      class="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex-shrink-0"
    >
      <UIcon :name="icon" class="w-5 h-5" />
    </div>

    <div class="flex-1 min-w-0">
      <h4 class="text-sm font-semibold text-gray-900 dark:text-white truncate">
        {{ title }}
      </h4>
      <p v-if="description" class="text-sm text-gray-500 dark:text-gray-400 truncate">
        {{ description }}
      </p>
    </div>

    <UIcon
      name="i-lucide-chevron-right"
      class="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-shrink-0"
    />
  </NuxtLink>

  <div
    v-else
    class="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
  >
    <div
      v-if="icon"
      class="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex-shrink-0"
    >
      <UIcon :name="icon" class="w-5 h-5" />
    </div>

    <div class="flex-1 min-w-0">
      <h4 class="text-sm font-semibold text-gray-900 dark:text-white truncate">
        {{ title }}
      </h4>
      <p v-if="description" class="text-sm text-gray-500 dark:text-gray-400 truncate">
        {{ description }}
      </p>
    </div>

    <slot name="action" />
  </div>
</template>
