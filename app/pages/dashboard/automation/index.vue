<script setup lang="ts">
import type {
    Automation,
    FlowType,
    AutomationTone,
    AutomationScope
} from '~/composables/useAutomation'

const { fetchAutomations, createAutomation, updateAutomation } = useAutomation()
const toast = useToast()

const automations = ref<Automation[]>([])
const loading = ref(true)
const togglingFlow = ref<FlowType | null>(null)
const showPostModal = ref(false)

const flowTypes: FlowType[] = ['simple', 'checkout', 'full']

const flowNameMap: Record<FlowType, string> = {
    simple: 'Энгийн автоматжуулалт',
    checkout: 'Checkout автоматжуулалт',
    full: 'Бүрэн автоматжуулалт'
}

function getAutomationByFlow(flowType: FlowType): Automation | null {
    return automations.value.find((a) => a.flow_type === flowType) ?? null
}

async function loadAutomations() {
    loading.value = true
    try {
        automations.value = await fetchAutomations()
    } catch {
        toast.add({ title: 'Автоматжуулалт ачаалахад алдаа гарлаа', color: 'error' })
    } finally {
        loading.value = false
    }
}

async function handleToggle(flowType: FlowType, isActive: boolean) {
    const existing = getAutomationByFlow(flowType)
    togglingFlow.value = flowType

    try {
        if (!existing && isActive) {
            // Create new automation for this flow type
            const created = await createAutomation({
                flow_type: flowType,
                tone: 'professional',
                scope: 'always_on'
            })
            // Deactivate others
            await deactivateOthers(created.id)
            await loadAutomations()
            toast.add({ title: `${flowNameMap[flowType]} идэвхжүүллээ`, color: 'success' })
        } else if (existing) {
            await updateAutomation(existing.id, { is_active: isActive })
            if (isActive) {
                await deactivateOthers(existing.id)
            }
            await loadAutomations()
            toast.add({
                title: isActive ? 'Идэвхжүүллээ' : 'Идэвхгүй боллоо',
                color: 'success'
            })
        }
    } catch {
        toast.add({ title: 'Алдаа гарлаа', color: 'error' })
    } finally {
        togglingFlow.value = null
    }
}

async function deactivateOthers(activeId: number) {
    const others = automations.value.filter((a) => a.id !== activeId && a.is_active)
    for (const a of others) {
        await updateAutomation(a.id, { is_active: false })
    }
}

async function handleUpdateTone(flowType: FlowType, tone: AutomationTone) {
    const existing = getAutomationByFlow(flowType)
    if (!existing) return

    try {
        await updateAutomation(existing.id, { tone })
        existing.tone = tone
    } catch {
        toast.add({ title: 'Өнгө аяс шинэчлэхэд алдаа гарлаа', color: 'error' })
    }
}

async function handleUpdateScope(flowType: FlowType, scope: AutomationScope) {
    const existing = getAutomationByFlow(flowType)
    if (!existing) return

    try {
        await updateAutomation(existing.id, { scope })
        existing.scope = scope
    } catch {
        toast.add({ title: 'Хамрах хүрээ шинэчлэхэд алдаа гарлаа', color: 'error' })
    }
}

async function handleUpdateLikeComments(flowType: FlowType, value: boolean) {
    const existing = getAutomationByFlow(flowType)
    if (!existing) return

    try {
        await updateAutomation(existing.id, { like_comments: value })
        existing.like_comments = value
    } catch {
        toast.add({ title: 'Тохиргоо шинэчлэхэд алдаа гарлаа', color: 'error' })
    }
}

onMounted(() => {
    loadAutomations()
})
</script>

<template>
    <div class="w-full h-full overflow-y-auto">
        <UDashboardPanel id="automation">
            <UDashboardNavbar title="dogshit">
                <template #title>
                    Автоматжуулалт
                    <UTooltip
                        text="Facebook коммент болон мессежэд автоматаар захиалга үүсгэж, хариу илгээнэ"
                        :delay-duration="200"
                    >
                        <UButton color="neutral" variant="ghost" icon="i-lucide-info" />
                    </UTooltip>
                </template>
                <template #right>
                    <UButton icon="i-lucide-share" @click="showPostModal = true">
                        Бараа нийтлэх
                    </UButton>
                </template>
            </UDashboardNavbar>

            <!-- Loading state -->
            <div v-if="loading" class="flex items-center justify-center py-20">
                <UIcon name="i-lucide-loader-2" class="w-6 h-6 animate-spin text-gray-400" />
            </div>

            <!-- Launch pad -->
            <div v-else class="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                <AutomationLaunchCard
                    v-for="ft in flowTypes"
                    :key="ft"
                    :flow-type="ft"
                    :automation="getAutomationByFlow(ft)"
                    :disabled="togglingFlow === ft"
                    @toggle="handleToggle(ft, $event)"
                    @update-tone="handleUpdateTone(ft, $event)"
                    @update-scope="handleUpdateScope(ft, $event)"
                    @update-like-comments="handleUpdateLikeComments(ft, $event)"
                />
            </div>
        </UDashboardPanel>

        <ProductPostModal v-model:open="showPostModal" />
    </div>
</template>
