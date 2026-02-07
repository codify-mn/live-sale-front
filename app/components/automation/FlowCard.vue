<script setup lang="ts">
import type { FlowType } from '~/composables/useAutomation'

interface Props {
    flowType: FlowType
    selected: boolean
}

defineProps<Props>()
defineEmits<{
    select: []
}>()

const flowConfig: Record<FlowType, { icon: string; title: string; description: string; steps: string[] }> = {
    simple: {
        icon: 'i-lucide-message-square',
        title: 'Энгийн',
        description: 'Захиалга автоматаар үүсгэж, текст мессежээр баталгаажуулна',
        steps: ['Коммент/Мессеж', 'Захиалга үүсгэх', 'Текст мессеж']
    },
    checkout: {
        icon: 'i-lucide-credit-card',
        title: 'Checkout',
        description: 'Захиалга үүсгэж, төлбөр төлөх товчтой template мессеж илгээнэ',
        steps: ['Коммент/Мессеж', 'Захиалга үүсгэх', 'Checkout товч']
    },
    full: {
        icon: 'i-lucide-layout-grid',
        title: 'Бүрэн',
        description: 'Захиалга үүсгэж, бараа carousel + checkout template илгээнэ',
        steps: ['Коммент/Мессеж', 'Захиалга үүсгэх', 'Carousel + Checkout']
    }
}
</script>

<template>
    <div
        class="relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md"
        :class="selected
            ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 shadow-sm'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
        @click="$emit('select')"
    >
        <div
            v-if="selected"
            class="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center"
        >
            <UIcon name="i-lucide-check" class="w-4 h-4 text-white" />
        </div>

        <div class="flex items-start gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-800/30 flex items-center justify-center flex-shrink-0">
                <UIcon :name="flowConfig[flowType].icon" class="w-5 h-5 text-primary-500" />
            </div>
            <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">
                    {{ flowConfig[flowType].title }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {{ flowConfig[flowType].description }}
                </p>
            </div>
        </div>

        <div class="flex items-center gap-1.5 flex-wrap">
            <template v-for="(step, i) in flowConfig[flowType].steps" :key="i">
                <UBadge variant="subtle" color="neutral" size="xs">
                    {{ step }}
                </UBadge>
                <UIcon
                    v-if="i < flowConfig[flowType].steps.length - 1"
                    name="i-lucide-arrow-right"
                    class="w-3 h-3 text-gray-400"
                />
            </template>
        </div>
    </div>
</template>
