<script setup lang="ts">
import type { Automation } from '~/composables/useAutomation'

const { fetchAutomations, updateAutomation, deleteAutomation: deleteAutomationApi } = useAutomation()
const toast = useToast()

const automations = ref<Automation[]>([])
const loading = ref(true)
const isCreateModalOpen = ref(false)

async function loadAutomations() {
    loading.value = true
    try {
        automations.value = await fetchAutomations()
    } catch (err: any) {
        toast.add({ title: 'Автоматжуулалт ачаалахад алдаа гарлаа', color: 'error' })
    } finally {
        loading.value = false
    }
}

async function handleToggle(id: number, isActive: boolean) {
    try {
        await updateAutomation(id, { is_active: isActive })
        const item = automations.value.find(a => a.id === id)
        if (item) item.is_active = isActive
        toast.add({
            title: isActive ? 'Идэвхжүүллээ' : 'Идэвхгүй боллоо',
            color: 'success'
        })
    } catch (err: any) {
        toast.add({ title: 'Алдаа гарлаа', color: 'error' })
    }
}

async function handleDelete(id: number) {
    try {
        await deleteAutomationApi(id)
        automations.value = automations.value.filter(a => a.id !== id)
        toast.add({ title: 'Амжилттай устгалаа', color: 'success' })
    } catch (err: any) {
        toast.add({ title: 'Устгахад алдаа гарлаа', color: 'error' })
    }
}

function handleCreated() {
    loadAutomations()
}

onMounted(() => {
    loadAutomations()
})
</script>

<template>
    <div class="w-full h-full overflow-y-auto">
        <UDashboardPage>
            <UDashboardNavbar>
                <template #right>
                    <UButton
                        color="primary"
                        icon="i-lucide-plus"
                        @click="isCreateModalOpen = true"
                    >
                        Шинэ Автоматжуулалт
                    </UButton>
                </template>
                <template #title>
                    Автоматжуулалт
                    <UTooltip
                        text="Facebook коммент болон мессежэд автоматаар захиалга үүсгэж, хариу илгээнэ"
                        :delay-duration="200"
                    >
                        <UButton color="neutral" variant="ghost" icon="i-lucide-info" />
                    </UTooltip>
                </template>
            </UDashboardNavbar>

            <UDashboardPanel>
                <UDashboardPanelContent>
                    <!-- Loading state -->
                    <div v-if="loading" class="flex items-center justify-center py-20">
                        <UIcon name="i-lucide-loader-2" class="w-6 h-6 animate-spin text-gray-400" />
                    </div>

                    <!-- Empty state -->
                    <div
                        v-else-if="automations.length === 0"
                        class="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div class="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mb-4">
                            <UIcon name="i-lucide-bot" class="w-8 h-8 text-primary-500" />
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Автоматжуулалт алга байна
                        </h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
                            Facebook коммент болон Messenger мессежэд автоматаар хариулж,
                            захиалга үүсгэх автоматжуулалт тохируулаарай.
                        </p>
                        <UButton
                            color="primary"
                            icon="i-lucide-plus"
                            @click="isCreateModalOpen = true"
                        >
                            Эхний Автоматжуулалтаа Үүсгэх
                        </UButton>
                    </div>

                    <!-- Automation list -->
                    <div v-else class="space-y-3">
                        <AutomationListItem
                            v-for="automation in automations"
                            :key="automation.id"
                            :automation="automation"
                            @toggle="handleToggle"
                            @delete="handleDelete"
                        />
                    </div>
                </UDashboardPanelContent>
            </UDashboardPanel>
        </UDashboardPage>

        <AutomationCreateModal
            v-model:open="isCreateModalOpen"
            @created="handleCreated"
        />
    </div>
</template>
