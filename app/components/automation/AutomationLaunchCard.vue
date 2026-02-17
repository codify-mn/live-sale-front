<script setup lang="ts">
import type {
    Automation,
    FlowType,
    AutomationTone,
    AutomationScope
} from '~/composables/useAutomation'

interface Props {
    flowType: FlowType
    automation?: Automation | null
    disabled?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
    toggle: [isActive: boolean]
    'update-tone': [tone: AutomationTone]
    'update-scope': [scope: AutomationScope]
    'update-like-comments': [value: boolean]
}>()

const { getToneLabel, getScopeLabel } = useAutomation()

interface FlowConfig {
    icon: string
    title: string
    tagline: string
    bgActive: string
    bgInactive: string
    borderActive: string
    iconBgActive: string
    iconBgInactive: string
    iconColor: string
    selectedBtnClass: string
    steps: { icon: string; label: string }[]
}

const flowConfig: Record<FlowType, FlowConfig> = {
    simple: {
        icon: 'i-lucide-message-square-text',
        title: 'Энгийн',
        tagline: 'Текст мессежээр баталгаажуулна',
        bgActive: 'bg-blue-50/60 dark:bg-blue-950/20',
        bgInactive: 'bg-white dark:bg-gray-900',
        borderActive: 'border-blue-400 dark:border-blue-500',
        iconBgActive: 'bg-blue-100 dark:bg-blue-900/40',
        iconBgInactive: 'bg-gray-100 dark:bg-gray-800',
        iconColor: 'text-blue-500',
        selectedBtnClass: 'bg-blue-500 text-white',
        steps: [
            { icon: 'i-lucide-message-circle', label: 'Коммент' },
            { icon: 'i-lucide-package', label: 'Захиалга' },
            { icon: 'i-lucide-send', label: 'Текст мессеж' }
        ]
    },
    checkout: {
        icon: 'i-lucide-credit-card',
        title: 'Checkout',
        tagline: 'Төлбөр товчтой мессеж илгээнэ',
        bgActive: 'bg-amber-50/60 dark:bg-amber-950/20',
        bgInactive: 'bg-white dark:bg-gray-900',
        borderActive: 'border-amber-400 dark:border-amber-500',
        iconBgActive: 'bg-amber-100 dark:bg-amber-900/40',
        iconBgInactive: 'bg-gray-100 dark:bg-gray-800',
        iconColor: 'text-amber-500',
        selectedBtnClass: 'bg-amber-500 text-white',
        steps: [
            { icon: 'i-lucide-message-circle', label: 'Коммент' },
            { icon: 'i-lucide-package', label: 'Захиалга' },
            { icon: 'i-lucide-reply', label: 'Хариу' },
            { icon: 'i-lucide-credit-card', label: 'Төлбөр товч' }
        ]
    },
    full: {
        icon: 'i-lucide-layout-grid',
        title: 'Бүрэн',
        tagline: 'Бараа зурагтай + төлбөр товчтой',
        bgActive: 'bg-emerald-50/60 dark:bg-emerald-950/20',
        bgInactive: 'bg-white dark:bg-gray-900',
        borderActive: 'border-emerald-400 dark:border-emerald-500',
        iconBgActive: 'bg-emerald-100 dark:bg-emerald-900/40',
        iconBgInactive: 'bg-gray-100 dark:bg-gray-800',
        iconColor: 'text-emerald-500',
        selectedBtnClass: 'bg-emerald-500 text-white',
        steps: [
            { icon: 'i-lucide-message-circle', label: 'Коммент' },
            { icon: 'i-lucide-package', label: 'Захиалга' },
            { icon: 'i-lucide-reply', label: 'Хариу' },
            { icon: 'i-lucide-gallery-horizontal-end', label: 'Carousel' }
        ]
    }
}

// Tone-specific example messages
const toneExamples: Record<FlowType, Record<AutomationTone, { reply: string; brief?: string }>> = {
    simple: {
        professional: {
            reply: 'Сайн байна уу.\nЗахиалга: #ORD-1042\nЦамц x2: ₮59,800\nТөлбөр төлөх: checkout линк'
        },
        friendly: {
            reply: 'Сайн байна уу! 😊\nЗахиалга хүлээн авлаа!\n#ORD-1042\nЦамц x2: ₮59,800\nБаярлалаа! 🙏'
        },
        playful: { reply: 'Ёо! 🎉\nЗахиалга орлоо!\n#ORD-1042\nЦамц x2: ₮59,800\nАмжилт! ✌️' }
    },
    checkout: {
        professional: { brief: 'Захиалга бүртгэгдлээ: #ORD-1043. Мессежээ шалгана уу.' },
        friendly: { brief: 'Баярлалаа! 😊 #ORD-1043 бүртгэгдлээ. Мессежээ шалгаарай!' },
        playful: { brief: 'Ёо захиалга орлоо! 🎉 #ORD-1043 — мессежээ шалгаарай!' }
    },
    full: {
        professional: { brief: 'Захиалга бүртгэгдлээ: #ORD-1044. Мессежээ шалгана уу.' },
        friendly: { brief: 'Баярлалаа! 😊 #ORD-1044 бүртгэгдлээ. Мессежээ шалгаарай!' },
        playful: { brief: 'Ёо захиалга орлоо! 🎉 #ORD-1044 — мессежээ шалгаарай!' }
    }
}

const tones: AutomationTone[] = ['professional', 'friendly', 'playful']
const scopes: AutomationScope[] = ['always_on', 'live_only']

const config = computed(() => flowConfig[props.flowType])
const isActive = computed(() => props.automation?.is_active ?? false)
const currentTone = computed(() => props.automation?.tone ?? 'professional')
const currentScope = computed(() => props.automation?.scope ?? 'always_on')
const likeComments = computed(() => props.automation?.like_comments ?? true)
const example = computed(() => toneExamples[props.flowType][currentTone.value])

function onToggle(value: boolean) {
    emit('toggle', value)
}

function selectTone(tone: AutomationTone) {
    if (!props.automation || props.disabled) return
    if (tone !== currentTone.value) emit('update-tone', tone)
}

function selectScope(scope: AutomationScope) {
    if (!props.automation || props.disabled) return
    if (scope !== currentScope.value) emit('update-scope', scope)
}

function toggleLikeComments() {
    if (!props.automation || props.disabled) return
    emit('update-like-comments', !likeComments.value)
}
</script>

<template>
    <div
        class="relative rounded-xl border-2 p-5 transition-all duration-200 flex flex-col"
        :class="[
            isActive
                ? [config.borderActive, config.bgActive, 'shadow-sm']
                : ['border-gray-200 dark:border-gray-700', config.bgInactive]
        ]"
    >
        <!-- Header -->
        <div class="flex items-start justify-between gap-3 mb-1">
            <div class="flex items-center gap-3">
                <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    :class="isActive ? config.iconBgActive : config.iconBgInactive"
                >
                    <UIcon
                        :name="config.icon"
                        class="w-5 h-5"
                        :class="isActive ? config.iconColor : 'text-gray-400'"
                    />
                </div>
                <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white text-base">
                        {{ config.title }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ config.tagline }}
                    </p>
                </div>
            </div>
            <USwitch :model-value="isActive" :loading="disabled" @update:model-value="onToggle" />
        </div>

        <!-- Process steps -->
        <div class="my-3 flex items-center gap-1.5 flex-wrap">
            <template v-for="(step, i) in config.steps" :key="i">
                <div
                    class="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800/60"
                >
                    <UIcon :name="step.icon" class="w-3 h-3 text-gray-400" />
                    <span class="text-[11px] font-medium text-gray-600 dark:text-gray-300">{{
                        step.label
                    }}</span>
                </div>
                <UIcon
                    v-if="i < config.steps.length - 1"
                    name="i-lucide-chevron-right"
                    class="w-3 h-3 text-gray-300 dark:text-gray-600 flex-shrink-0"
                />
            </template>
        </div>

        <!-- Visual example -->
        <div class="mb-4 flex-1">
            <p
                class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2"
            >
                Жишээ
            </p>

            <!-- Facebook comment -->
            <div
                class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2.5 mb-2"
            >
                <div class="flex items-center gap-2 mb-1.5">
                    <div class="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <span class="text-[11px] font-semibold text-gray-700 dark:text-gray-300"
                        >Болд</span
                    >
                </div>
                <p class="text-xs text-gray-800 dark:text-gray-200 ml-7">Цамц 2ш авъя</p>
                <div class="flex items-center gap-3 ml-7 mt-1.5">
                    <span
                        class="flex items-center gap-0.5 text-[10px] transition-colors"
                        :class="likeComments ? 'text-blue-500 font-semibold' : 'text-gray-400'"
                    >
                        <UIcon name="i-lucide-thumbs-up" class="w-3 h-3" />
                        Like
                    </span>
                    <span class="text-[10px] text-gray-400">Reply</span>
                </div>
            </div>

            <!-- Simple: text message in Messenger -->
            <div
                v-if="flowType === 'simple'"
                class="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 p-2.5"
            >
                <div class="flex items-center gap-1.5 mb-1.5">
                    <UIcon name="i-lucide-send" class="w-3 h-3 text-blue-500" />
                    <span class="text-[10px] font-semibold text-blue-600 dark:text-blue-400"
                        >Messenger</span
                    >
                </div>
                <p
                    class="text-[11px] text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed ml-[18px]"
                >
                    {{ example.reply }}
                </p>
            </div>

            <!-- Checkout: private reply + button template -->
            <template v-if="flowType === 'checkout'">
                <div
                    class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 p-2.5 mb-2"
                >
                    <div class="flex items-center gap-1.5 mb-1">
                        <UIcon name="i-lucide-reply" class="w-3 h-3 text-gray-400" />
                        <span class="text-[10px] font-semibold text-gray-500 dark:text-gray-400"
                            >Private reply</span
                        >
                    </div>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400 ml-[18px]">
                        {{ example.brief }}
                    </p>
                </div>
                <div
                    class="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-2.5"
                >
                    <div class="flex items-center gap-1.5 mb-1.5">
                        <UIcon name="i-lucide-credit-card" class="w-3 h-3 text-amber-500" />
                        <span class="text-[10px] font-semibold text-amber-600 dark:text-amber-400"
                            >Messenger template</span
                        >
                    </div>
                    <div class="ml-[18px] space-y-1.5">
                        <p class="text-[11px] text-gray-600 dark:text-gray-300">
                            Цамц x2 — ₮59,800
                        </p>
                        <div
                            class="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-amber-500 text-white text-[10px] font-semibold"
                        >
                            <UIcon name="i-lucide-external-link" class="w-2.5 h-2.5" />
                            Төлбөр төлөх
                        </div>
                    </div>
                </div>
            </template>

            <!-- Full: private reply + carousel -->
            <template v-if="flowType === 'full'">
                <div
                    class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 p-2.5 mb-2"
                >
                    <div class="flex items-center gap-1.5 mb-1">
                        <UIcon name="i-lucide-reply" class="w-3 h-3 text-gray-400" />
                        <span class="text-[10px] font-semibold text-gray-500 dark:text-gray-400"
                            >Private reply</span
                        >
                    </div>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400 ml-[18px]">
                        {{ example.brief }}
                    </p>
                </div>
                <div
                    class="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5"
                >
                    <div class="flex items-center gap-1.5 mb-2">
                        <UIcon
                            name="i-lucide-gallery-horizontal-end"
                            class="w-3 h-3 text-emerald-500"
                        />
                        <span
                            class="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
                            >Messenger carousel</span
                        >
                    </div>
                    <!-- Mini carousel cards -->
                    <div class="ml-[18px] flex gap-1.5 overflow-hidden">
                        <!-- Order card -->
                        <div
                            class="min-w-[100px] rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-1.5 flex-shrink-0"
                        >
                            <p
                                class="text-[10px] font-semibold text-gray-700 dark:text-gray-200 mb-0.5"
                            >
                                Захиалга
                            </p>
                            <p class="text-[9px] text-gray-500">Цамц x2</p>
                            <p class="text-[9px] text-gray-500 mb-1">₮59,800</p>
                            <div
                                class="px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[8px] font-semibold text-center"
                            >
                                Төлбөр төлөх
                            </div>
                        </div>
                        <!-- Product card 1 -->
                        <div
                            class="min-w-[80px] rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-1.5 flex-shrink-0"
                        >
                            <div
                                class="w-full h-8 rounded bg-gray-100 dark:bg-gray-700 mb-1 flex items-center justify-center"
                            >
                                <UIcon
                                    name="i-lucide-image"
                                    class="w-3 h-3 text-gray-300 dark:text-gray-500"
                                />
                            </div>
                            <p class="text-[9px] font-medium text-gray-600 dark:text-gray-300">
                                Бараа 1
                            </p>
                            <p class="text-[9px] text-gray-400">₮29,900</p>
                        </div>
                        <!-- Product card 2 -->
                        <div
                            class="min-w-[80px] rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-1.5 flex-shrink-0"
                        >
                            <div
                                class="w-full h-8 rounded bg-gray-100 dark:bg-gray-700 mb-1 flex items-center justify-center"
                            >
                                <UIcon
                                    name="i-lucide-image"
                                    class="w-3 h-3 text-gray-300 dark:text-gray-500"
                                />
                            </div>
                            <p class="text-[9px] font-medium text-gray-600 dark:text-gray-300">
                                Бараа 2
                            </p>
                            <p class="text-[9px] text-gray-400">₮45,000</p>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <!-- Settings row -->
        <div class="space-y-2.5">
            <!-- Tone selector -->
            <div class="flex items-center flex-wrap gap-y-1.5">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400 mr-2 w-20"
                    >Өнгө аяс</span
                >
                <div class="inline-flex gap-1">
                    <button
                        v-for="tone in tones"
                        :key="tone"
                        class="px-2.5 py-1 text-xs rounded-md font-medium transition-colors"
                        :class="
                            currentTone === tone
                                ? config.selectedBtnClass
                                : automation
                                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-default'
                        "
                        :disabled="!automation"
                        @click="selectTone(tone)"
                    >
                        {{ getToneLabel(tone) }}
                    </button>
                </div>
            </div>

            <!-- Scope selector -->
            <div class="flex items-center flex-wrap gap-y-1.5">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400 mr-2 w-20"
                    >Хамрах</span
                >
                <div class="inline-flex gap-1">
                    <button
                        v-for="scope in scopes"
                        :key="scope"
                        class="px-2.5 py-1 text-xs rounded-md font-medium transition-colors"
                        :class="
                            currentScope === scope
                                ? config.selectedBtnClass
                                : automation
                                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-default'
                        "
                        :disabled="!automation"
                        @click="selectScope(scope)"
                    >
                        {{ getScopeLabel(scope) }}
                    </button>
                </div>
            </div>

            <!-- Like comments toggle -->
            <div class="flex items-center gap-2">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400 w-20"
                    >Коммент Like</span
                >
                <button
                    class="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md font-medium transition-colors"
                    :class="
                        likeComments
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : automation
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-default'
                    "
                    :disabled="!automation"
                    @click="toggleLikeComments"
                >
                    <UIcon name="i-lucide-thumbs-up" class="w-3 h-3" />
                    {{ likeComments ? 'Идэвхтэй' : 'Идэвхгүй' }}
                </button>
            </div>
        </div>

        <!-- Stats -->
        <div
            v-if="automation && automation.trigger_count > 0"
            class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50 flex items-center gap-1.5 text-xs text-gray-400"
        >
            <UIcon name="i-lucide-activity" class="w-3.5 h-3.5" />
            {{ automation.trigger_count }} удаа ажилласан
        </div>
    </div>
</template>
