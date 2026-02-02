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
    class="flex items-center gap-4 p-4 rounded-2xl border border-amber-200/60 dark:border-amber-800/30 bg-amber-50/40 dark:bg-amber-900/10 backdrop-blur-sm hover:bg-amber-50/60 dark:hover:bg-amber-900/20 hover:border-amber-300/60 dark:hover:border-amber-700/40 transition-all duration-200 cursor-pointer group"
  >
    <div
      v-if="icon"
      class="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100/80 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex-shrink-0"
    >
      <UIcon :name="icon" class="w-5 h-5" />
    </div>

    <div class="flex-1 min-w-0">
      <h4 class="text-sm font-semibold text-gray-900 dark:text-white truncate">
        {{ title }}
      </h4>
      <p v-if="description" class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
        {{ description }}
      </p>
    </div>

    <UIcon
      name="i-lucide-chevron-right"
      class="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-all duration-200 group-hover:translate-x-0.5 flex-shrink-0"
    />
  </NuxtLink>

  <div
    v-else
    class="flex items-center gap-4 p-4 rounded-2xl border border-amber-200/60 dark:border-amber-800/30 bg-amber-50/40 dark:bg-amber-900/10 backdrop-blur-sm"
  >
    <div
      v-if="icon"
      class="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100/80 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex-shrink-0"
    >
      <UIcon :name="icon" class="w-5 h-5" />
    </div>

    <div class="flex-1 min-w-0">
      <h4 class="text-sm font-semibold text-gray-900 dark:text-white truncate">
        {{ title }}
      </h4>
      <p v-if="description" class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
        {{ description }}
      </p>
    </div>

    <slot name="action" />
  </div>
</template>
