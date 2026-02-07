<script setup lang="ts">
import type { Automation } from '~/composables/useAutomation'

interface Props {
    automation: Automation
}

defineProps<Props>()
const emit = defineEmits<{
    toggle: [id: number, isActive: boolean]
    delete: [id: number]
}>()

const { getFlowLabel, getToneLabel, getScopeLabel, getFlowColor, getToneColor } = useAutomation()

const deleteConfirmOpen = ref(false)

function confirmDelete(id: number) {
    deleteConfirmOpen.value = false
    emit('delete', id)
}
</script>

<template>
    <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all hover:shadow-sm">
        <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                    <h3 class="font-semibold text-gray-900 dark:text-white truncate">
                        {{ automation.name }}
                    </h3>
                    <UBadge :color="getFlowColor(automation.flow_type)" variant="subtle" size="xs">
                        {{ getFlowLabel(automation.flow_type) }}
                    </UBadge>
                </div>

                <div class="flex items-center gap-2 flex-wrap">
                    <UBadge :color="getToneColor(automation.tone)" variant="outline" size="xs">
                        {{ getToneLabel(automation.tone) }}
                    </UBadge>
                    <UBadge color="neutral" variant="outline" size="xs">
                        {{ getScopeLabel(automation.scope) }}
                    </UBadge>
                    <span class="text-xs text-gray-400 ml-1">
                        {{ automation.trigger_count }} удаа ажилласан
                    </span>
                </div>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0">
                <USwitch
                    :model-value="automation.is_active"
                    size="sm"
                    @update:model-value="emit('toggle', automation.id, $event)"
                />

                <UButton
                    icon="i-lucide-trash-2"
                    variant="ghost"
                    color="error"
                    size="xs"
                    @click="deleteConfirmOpen = true"
                />
            </div>
        </div>

        <!-- Delete confirmation -->
        <UModal v-model:open="deleteConfirmOpen">
            <template #body>
                <div class="text-center space-y-3">
                    <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 mx-auto flex items-center justify-center">
                        <UIcon name="i-lucide-trash-2" class="w-6 h-6 text-red-500" />
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        Устгах уу?
                    </h3>
                    <p class="text-sm text-gray-500">
                        "{{ automation.name }}" автоматжуулалтыг устгахдаа итгэлтэй байна уу?
                    </p>
                </div>
            </template>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <UButton variant="ghost" color="neutral" @click="deleteConfirmOpen = false">
                        Болих
                    </UButton>
                    <UButton color="error" @click="confirmDelete(automation.id)">
                        Устгах
                    </UButton>
                </div>
            </template>
        </UModal>
    </div>
</template>
