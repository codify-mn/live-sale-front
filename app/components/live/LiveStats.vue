<script setup lang="ts">
import type { LiveSale } from '~/types'

const props = defineProps<{
    live: LiveSale
    isStreaming: boolean
}>()

const revenue = ref(0)
const orders = ref(0)
const viewers = ref(156)

const duration = ref('00:00:00')
let timerInterval: NodeJS.Timeout | null = null
let startTime: number | null = null


const updateTimer = () => {
    if (!startTime) return
    const now = Date.now()
    const diff = Math.floor((now - startTime) / 1000)

    const hours = Math.floor(diff / 3600)
    const minutes = Math.floor((diff % 3600) / 60)
    const seconds = diff % 60

    duration.value = [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
    ].join(':')
}

watch(() => props.isStreaming, (streaming) => {
    if (streaming) {
        startTime = Date.now()
        timerInterval = setInterval(updateTimer, 1000)
    } else {
        if (timerInterval) {
            clearInterval(timerInterval)
            timerInterval = null
        }
    }
}, { immediate: true })

onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval)
})
</script>

<template>
    <div class="grid grid-cols-2 gap-4 mt-4 mx-2">
        <DashboardStatCard label="Захиалга" :value="orders" icon="i-heroicons-shopping-bag" icon-color="primary" />
        <DashboardStatCard label="Үзэгч" :value="viewers" icon="i-heroicons-users" icon-color="info" />
    </div>
</template>
