<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v'
import { TextMorph } from 'torph'

export type ButtonStatus = 'idle' | 'loading' | 'success' | 'error'

const props = withDefaults(
    defineProps<{
        status?: ButtonStatus
        label?: string
        loadingLabel?: string
        successLabel?: string
        errorLabel?: string
        disabled?: boolean
        type?: 'button' | 'submit' | 'reset'
    }>(),
    {
        status: 'idle',
        label: 'Submit',
        loadingLabel: 'Processing...',
        successLabel: 'Done',
        errorLabel: 'Failed',
        type: 'button'
    }
)

const emit = defineEmits<{
    click: [event: MouseEvent]
}>()

const springTransition = {
    type: 'spring' as const,
    mass: 4,
    stiffness: 800,
    damping: 80,
    restDelta: 0.0001
}

const bgColor: Record<ButtonStatus, string> = {
    idle: '#18181b',
    loading: '#18181b',
    success: '#166534',
    error: '#7f1d1d'
}

const isDisabled = computed(() => props.status === 'loading' || props.disabled)
const hasIcon = computed(() => props.status !== 'idle')

const currentLabel = computed(() => {
    switch (props.status) {
        case 'loading':
            return props.loadingLabel!
        case 'success':
            return props.successLabel!
        case 'error':
            return props.errorLabel!
        default:
            return props.label!
    }
})

const morphRef = ref<HTMLElement | null>(null)
let morphInstance: InstanceType<typeof TextMorph> | null = null

onMounted(() => {
    morphInstance = new TextMorph({
        element: morphRef.value!,
        duration: 600,
        ease: 'cubic-bezier(0.41, 1.03, 0.6, 1.03)'
    })
    morphInstance.update(currentLabel.value)
})
onUnmounted(() => morphInstance?.destroy())

watch(currentLabel, (val) => morphInstance?.update(val))
</script>

<template>
    <motion.button
        class="badge"
        :type="type"
        :disabled="isDisabled"
        :animate="{ backgroundColor: bgColor[status ?? 'idle'] }"
        :transition="springTransition"
        @click="!isDisabled && emit('click', $event)"
    >
        <!-- Icon — popLayout removes it from flow instantly so the badge reflows via layout -->
        <AnimatePresence mode="popLayout" :initial="false">
            <motion.span
                v-if="hasIcon"
                :key="status"
                class="icon"
                :initial="{ opacity: 0, scale: 0.6 }"
                :animate="{ opacity: 1, scale: 1 }"
                :exit="{
                    opacity: 0,
                    scale: 0.6,
                    transition: springTransition
                }"
                :transition="{
                    delay: 0.1,
                    ...springTransition
                }"
            >
                <!-- Spinner -->
                <svg
                    v-if="status === 'loading'"
                    class="spinner"
                    width="16"
                    height="16"
                    viewBox="0 0 23 23"
                    fill="none"
                >
                    <path
                        d="M21.313 11.406C21.313 16.878 16.878 21.313 11.406 21.313"
                        stroke="currentColor"
                        stroke-width="3"
                        stroke-linecap="round"
                    />
                    <path
                        opacity="0.2"
                        d="M11.406 21.313C16.878 21.313 21.313 16.878 21.313 11.406C21.313 5.935 16.878 1.5 11.406 1.5C5.935 1.5 1.5 5.935 1.5 11.406C1.5 16.878 5.935 21.313 11.406 21.313Z"
                        stroke="currentColor"
                        stroke-width="3"
                    />
                </svg>

                <!-- Checkmark -->
                <svg
                    v-else-if="status === 'success'"
                    width="16"
                    height="16"
                    viewBox="0 0 21 21"
                    fill="none"
                >
                    <path
                        d="M20.9 10.45C20.9 4.68 16.22 0 10.45 0C4.68 0 0 4.68 0 10.45C0 16.22 4.68 20.9 10.45 20.9C16.22 20.9 20.9 16.22 20.9 10.45Z"
                        fill="currentColor"
                    />
                    <path
                        d="M6.1 10.98L8.84 13.64L14.8 7.84"
                        stroke="rgba(0,0,0,0.7)"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>

                <!-- X mark -->
                <svg
                    v-else-if="status === 'error'"
                    width="16"
                    height="16"
                    viewBox="0 0 21 21"
                    fill="none"
                >
                    <path
                        d="M20.9 10.45C20.9 4.68 16.22 0 10.45 0C4.68 0 0 4.68 0 10.45C0 16.22 4.68 20.9 10.45 20.9C16.22 20.9 20.9 16.22 20.9 10.45Z"
                        fill="currentColor"
                    />
                    <path
                        d="M7 7L14 14M14 7L7 14"
                        stroke="rgba(0,0,0,0.7)"
                        stroke-width="2.5"
                        stroke-linecap="round"
                    />
                </svg>
            </motion.span>
        </AnimatePresence>

        <span ref="morphRef" class="label" />
    </motion.button>
</template>

<style scoped>
.badge {
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 18px;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #18181b;
    color: #fff;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.01em;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    outline: none;
    -webkit-appearance: none;
}

.badge:hover:not(:disabled) {
    border-color: rgba(255, 255, 255, 0.18);
    filter: brightness(1.1);
}

.badge:active:not(:disabled) {
    filter: brightness(0.9);
    transform: scale(0.98);
}

.badge:focus-visible {
    box-shadow:
        0 0 0 2px #fff,
        0 0 0 4px rgba(255, 255, 255, 0.3);
}

.badge:disabled {
    cursor: not-allowed;
    opacity: 0.55;
}

.icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
}

.spinner {
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.label {
    display: inline-block;
    line-height: 1;
}
</style>
