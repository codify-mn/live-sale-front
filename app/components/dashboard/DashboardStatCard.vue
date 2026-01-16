<script setup lang="ts">
interface Props {
  label: string
  value: string | number
  subtitle?: string
  icon?: string
  iconColor?: 'primary' | 'success' | 'warning' | 'error' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: 'primary'
})

const iconColorClasses = {
  primary: 'text-primary-500 bg-primary-50 dark:bg-primary-900/20',
  success: 'text-green-500 bg-green-50 dark:bg-green-900/20',
  warning: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
  error: 'text-red-500 bg-red-50 dark:bg-red-900/20',
  info: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
}
</script>

<template>
  <DashboardCard padding="lg">
    <div class="space-y-3">
      <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {{ label }}
      </p>

      <div class="flex items-center gap-3">
        <div
          v-if="icon"
          class="w-10 h-10 rounded-lg flex items-center justify-center"
          :class="iconColorClasses[iconColor]"
        >
          <UIcon :name="icon" class="w-5 h-5" />
        </div>

        <span class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ value }}
        </span>
      </div>

      <p v-if="subtitle" class="text-sm text-gray-500 dark:text-gray-400">
        {{ subtitle }}
      </p>
    </div>
  </DashboardCard>
</template>
