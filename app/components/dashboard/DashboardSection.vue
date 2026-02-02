<script setup lang="ts">
interface Props {
    title: string
    description?: string
    padding?: boolean
}

withDefaults(defineProps<Props>(), {
    padding: true
})
</script>

<template>
    <DashboardCard :padding="padding ? 'lg' : 'none'">
        <div :class="!padding && 'p-4 pb-0'">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ title }}
            </h3>
            <p v-if="description" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ description }}
            </p>
        </div>

        <div :class="padding ? 'mt-4' : 'p-4'">
            <slot />
        </div>
    </DashboardCard>
</template>
