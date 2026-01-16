<script setup lang="ts">
interface Props {
  name: string
  subtitle?: string
}

defineProps<Props>()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Өглөөний мэнд'
  if (hour < 18) return 'Өдрийн мэнд'
  return 'Оройн мэнд'
})
</script>

<template>
  <div class="flex items-start gap-4">
    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
      <UIcon name="i-lucide-sun" class="w-6 h-6 text-white" />
    </div>

    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ greeting }}, {{ name }}
      </h1>
      <p v-if="subtitle" class="text-gray-500 dark:text-gray-400 mt-1">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>
