<script setup lang="ts">
import type { FlowType, AutomationTone, AutomationScope, CreateAutomationInput } from '~/composables/useAutomation'

const emit = defineEmits<{
    created: []
}>()

const isOpen = defineModel<boolean>('open', { default: false })

const { createAutomation } = useAutomation()
const toast = useToast()

const step = ref(1)
const loading = ref(false)

const form = reactive<CreateAutomationInput>({
    name: '',
    flow_type: 'simple',
    tone: 'professional',
    scope: 'always_on',
    keywords: []
})

const customKeywords = ref('')

const toneOptions: { value: AutomationTone; label: string; description: string }[] = [
    { value: 'professional', label: 'Албан ёсны', description: 'Товч, тодорхой мессеж' },
    { value: 'friendly', label: 'Найрсаг', description: 'Дулаан, emoji-тай мессеж' },
    { value: 'playful', label: 'Хөгжилтэй', description: 'Хөгжилтэй, энергитэй мессеж' }
]

const scopeOptions: { value: AutomationScope; label: string; description: string }[] = [
    { value: 'always_on', label: 'Үргэлж идэвхтэй', description: 'Бүх коммент, мессежэд хариулна' },
    { value: 'live_only', label: 'Зөвхөн Live үед', description: 'Зөвхөн Live нэвтрүүлэг явж байх үед' }
]

function selectFlow(flowType: FlowType) {
    form.flow_type = flowType
}

function nextStep() {
    if (step.value < 3) step.value++
}

function prevStep() {
    if (step.value > 1) step.value--
}

async function submit() {
    if (!form.name.trim()) {
        toast.add({ title: 'Нэр оруулна уу', color: 'error' })
        return
    }

    loading.value = true
    try {
        // Parse custom keywords if provided
        if (customKeywords.value.trim()) {
            form.keywords = customKeywords.value.split(',').map(k => k.trim()).filter(Boolean)
        }

        await createAutomation(form)
        toast.add({ title: 'Автоматжуулалт амжилттай үүсгэлээ', color: 'success' })
        emit('created')
        close()
    } catch (err: any) {
        toast.add({ title: 'Алдаа гарлаа', description: err?.data || err?.message, color: 'error' })
    } finally {
        loading.value = false
    }
}

function close() {
    isOpen.value = false
    step.value = 1
    form.name = ''
    form.flow_type = 'simple'
    form.tone = 'professional'
    form.scope = 'always_on'
    form.keywords = []
    customKeywords.value = ''
}
</script>

<template>
    <UModal v-model:open="isOpen" :title="'Шинэ Автоматжуулалт'" :ui="{ width: 'sm:max-w-xl' }">
        <template #body>
            <!-- Step indicators -->
            <div class="flex items-center justify-center gap-2 mb-6">
                <div
                    v-for="s in 3"
                    :key="s"
                    class="flex items-center gap-2"
                >
                    <div
                        class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
                        :class="s <= step
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500'"
                    >
                        {{ s }}
                    </div>
                    <div v-if="s < 3" class="w-8 h-px bg-gray-200 dark:bg-gray-700" />
                </div>
            </div>

            <!-- Step 1: Select flow -->
            <div v-if="step === 1" class="space-y-3">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Автоматжуулалтын төрлөө сонгоно уу
                </p>
                <FlowCard
                    v-for="ft in (['simple', 'checkout', 'full'] as FlowType[])"
                    :key="ft"
                    :flow-type="ft"
                    :selected="form.flow_type === ft"
                    @select="selectFlow(ft)"
                />
            </div>

            <!-- Step 2: Tone & Scope -->
            <div v-if="step === 2" class="space-y-6">
                <div>
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                        Мессежийн өнгө аяс
                    </label>
                    <div class="space-y-2">
                        <div
                            v-for="opt in toneOptions"
                            :key="opt.value"
                            class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
                            :class="form.tone === opt.value
                                ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'"
                            @click="form.tone = opt.value"
                        >
                            <div
                                class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                                :class="form.tone === opt.value ? 'border-primary-500' : 'border-gray-300 dark:border-gray-600'"
                            >
                                <div
                                    v-if="form.tone === opt.value"
                                    class="w-2 h-2 rounded-full bg-primary-500"
                                />
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ opt.label }}</p>
                                <p class="text-xs text-gray-500">{{ opt.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                        Хамрах хүрээ
                    </label>
                    <div class="space-y-2">
                        <div
                            v-for="opt in scopeOptions"
                            :key="opt.value"
                            class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
                            :class="form.scope === opt.value
                                ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'"
                            @click="form.scope = opt.value"
                        >
                            <div
                                class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                                :class="form.scope === opt.value ? 'border-primary-500' : 'border-gray-300 dark:border-gray-600'"
                            >
                                <div
                                    v-if="form.scope === opt.value"
                                    class="w-2 h-2 rounded-full bg-primary-500"
                                />
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ opt.label }}</p>
                                <p class="text-xs text-gray-500">{{ opt.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Step 3: Name & Keywords -->
            <div v-if="step === 3" class="space-y-4">
                <UFormField label="Автоматжуулалтын нэр">
                    <UInput
                        v-model="form.name"
                        placeholder="Жишээ: Коммент автомат"
                        size="lg"
                        class="w-full"
                    />
                </UFormField>

                <UFormField label="Түлхүүр үгс (заавал биш)" hint="Таслалаар тусгаарлана">
                    <UTextarea
                        v-model="customKeywords"
                        placeholder="авах, захиалах, buy, invoice"
                        :rows="2"
                        class="w-full"
                    />
                    <template #description>
                        <span class="text-xs text-gray-400">
                            Хоосон орхивол анхны тохиргоо: авах, захиалах, авъя, buy, invoice
                        </span>
                    </template>
                </UFormField>
            </div>
        </template>

        <template #footer>
            <div class="flex items-center justify-between w-full">
                <UButton
                    v-if="step > 1"
                    variant="ghost"
                    color="neutral"
                    @click="prevStep"
                >
                    Буцах
                </UButton>
                <div v-else />

                <div class="flex gap-2">
                    <UButton variant="ghost" color="neutral" @click="close">
                        Болих
                    </UButton>
                    <UButton
                        v-if="step < 3"
                        color="primary"
                        @click="nextStep"
                    >
                        Дараах
                    </UButton>
                    <UButton
                        v-else
                        color="primary"
                        :loading="loading"
                        @click="submit"
                    >
                        Үүсгэх
                    </UButton>
                </div>
            </div>
        </template>
    </UModal>
</template>
