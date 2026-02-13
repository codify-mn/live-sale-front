<script setup lang="ts">
defineProps<{
    title?: string
    description?: string
    icon?: string
    actionLabel?: string
    actionTo?: string
}>()

const emit = defineEmits<{
    action: []
}>()
</script>

<template>
    <div class="flex flex-col items-center justify-center py-16 text-center">
        <div
            class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4"
        >
            <UIcon :name="icon || 'i-lucide-receipt'" class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ title || 'Түүх байхгүй' }}
        </h3>
        <p class="text-gray-500 max-w-sm mb-6">
            {{ description || 'Та одоогоор ямар нэгэн төлбөр хийгээгүй байна.' }}
        </p>
        <UButton v-if="actionLabel" color="primary" :to="actionTo" @click="emit('action')">
            {{ actionLabel }}
        </UButton>
    </div>
</template>
