<script setup lang="ts">
interface Props {
  planName: string
  isActive?: boolean
  daysRemaining?: number
  upgradeUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false
})
</script>

<template>
  <DashboardCard padding="lg">
    <div class="flex flex-col h-full">
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-500 dark:text-gray-400">Одоогийн багц</span>
        <button
          v-if="upgradeUrl"
          class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
        >
          <UIcon name="i-lucide-info" class="w-4 h-4" />
          Миний багц
        </button>
      </div>

      <div class="flex items-center gap-2 mt-2">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ planName }}
        </h3>
        <UBadge
          :color="isActive ? 'success' : 'warning'"
          variant="subtle"
          size="sm"
        >
          {{ isActive ? 'Идэвхтэй' : 'Идэвхгүй' }}
        </UBadge>
      </div>

      <div v-if="daysRemaining !== undefined" class="flex items-center gap-1.5 mt-2 text-sm">
        <span class="w-2 h-2 rounded-full" :class="daysRemaining > 7 ? 'bg-green-500' : 'bg-amber-500'" />
        <span class="text-gray-600 dark:text-gray-400">
          Багц дуусахад {{ daysRemaining }} хоног
        </span>
      </div>

      <div class="mt-auto pt-4">
        <UButton
          v-if="upgradeUrl"
          :to="upgradeUrl"
          color="primary"
          variant="outline"
          block
          icon="i-lucide-shopping-cart"
        >
          Багц авах
        </UButton>
      </div>
    </div>
  </DashboardCard>
</template>
