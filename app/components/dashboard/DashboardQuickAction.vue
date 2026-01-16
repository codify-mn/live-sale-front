<script setup lang="ts">
interface Props {
  title: string
  description?: string
  icon?: string
  to?: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'gray'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue'
})

const colorClasses = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  pink: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
  gray: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
}

const iconBgClasses = {
  blue: 'bg-blue-100 dark:bg-blue-800/30',
  green: 'bg-green-100 dark:bg-green-800/30',
  purple: 'bg-purple-100 dark:bg-purple-800/30',
  orange: 'bg-orange-100 dark:bg-orange-800/30',
  pink: 'bg-pink-100 dark:bg-pink-800/30',
  gray: 'bg-gray-200 dark:bg-gray-700'
}
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="block p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
    :class="colorClasses[color]"
  >
    <div
      v-if="icon"
      class="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
      :class="iconBgClasses[color]"
    >
      <UIcon :name="icon" class="w-5 h-5" />
    </div>

    <h4 class="font-semibold text-gray-900 dark:text-white">
      {{ title }}
    </h4>
    <p v-if="description" class="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
      {{ description }}
    </p>
  </NuxtLink>

  <div
    v-else
    class="p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
    :class="colorClasses[color]"
  >
    <div
      v-if="icon"
      class="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
      :class="iconBgClasses[color]"
    >
      <UIcon :name="icon" class="w-5 h-5" />
    </div>

    <h4 class="font-semibold text-gray-900 dark:text-white">
      {{ title }}
    </h4>
    <p v-if="description" class="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
      {{ description }}
    </p>
  </div>
</template>
