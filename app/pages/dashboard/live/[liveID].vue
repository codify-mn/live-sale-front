<script setup lang="ts">
import type { LiveSale } from '~/types'

const toast = useToast()
const config = useRuntimeConfig()
const route = useRoute()

const webrtc = useWebRTC()

const { data: live } = useLazyFetch<LiveSale>(
    `${config.public.apiUrl}/api/live-sales/${route.params.liveID}`,
    {
        credentials: 'include'
    }
)

provide('live', live)
provide('addedProducts', ref(live.value?.products || []))

onBeforeUnmount(() => {
    webrtc.stopStream()
})

const facebookLiveUrl = computed(() => {
    if (live.value?.ref_id) {
        return `https://www.facebook.com/${live.value.ref_id}`
    }
    return null
})

const statusLabel = computed(() => {
    const labels: Record<string, string> = {
        idle: 'Offline',
        starting: 'Starting...',
        accessing_camera: 'Accessing Camera...',
        connecting: 'Connecting...',
        stopping: 'Stopping...',
        live: 'LIVE',
        error: 'Error'
    }
    return labels[webrtc.streamStatus.value] || webrtc.streamStatus.value
})
</script>
<template>
    <div class="h-[calc(100vh)] w-full flex gap-4 p-4">
        <!-- Product List -->
        <div class="flex-1 md:max-w-1/3">
            <ProductList />
        </div>

        <!-- Main Video Area -->
        <div class="flex flex-1 flex-col min-w-0 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 gap-4">
            <!-- Facebook Live Info Header -->
            <div
                class="flex items-center justify-between bg-white dark:bg-gray-900 px-4 py-3 rounded-lg shadow-sm"
            >
                <div class="flex items-center gap-3 min-w-0">
                    <div
                        class="shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
                    >
                        <UIcon
                            name="i-simple-icons-facebook"
                            class="text-blue-600 dark:text-blue-400 text-lg"
                        />
                    </div>
                    <div class="min-w-0">
                        <h2 class="font-semibold text-base truncate">
                            {{ live?.title || 'Untitled Live' }}
                        </h2>
                        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {{ live?.page?.name || `Page #${live?.page_id}` }}
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <UBadge
                        :color="webrtc.streamStatus.value === 'live' ? 'error' : 'neutral'"
                        :variant="webrtc.streamStatus.value === 'live' ? 'solid' : 'subtle'"
                        size="sm"
                    >
                        <span
                            v-if="webrtc.streamStatus.value === 'live'"
                            class="inline-block w-1.5 h-1.5 rounded-full bg-white mr-1.5 animate-pulse"
                        />
                        {{ statusLabel }}
                    </UBadge>
                    <UButton
                        v-if="facebookLiveUrl"
                        :to="facebookLiveUrl"
                        target="_blank"
                        color="primary"
                        variant="soft"
                        icon="i-heroicons-arrow-top-right-on-square"
                        size="sm"
                    >
                        Open on Facebook
                    </UButton>
                </div>
            </div>

            <!-- Video Player -->
            <div class="flex-1 grid grid-cols-2 gap-2">
                <div class="flex-1 bg-black relative rounded-lg overflow-hidden min-h-0">
                    <video
                        :ref="webrtc.videoRef"
                        autoplay
                        muted
                        playsinline
                        class="w-full h-full object-contain"
                    ></video>
                    <div
                        v-if="webrtc.streamStatus.value === 'live'"
                        class="absolute top-4 left-4 bg-red-600 px-2.5 py-1 rounded-md text-white text-xs font-bold tracking-wide z-10 flex items-center gap-1.5"
                    >
                        <span
                            class="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse"
                        />
                        LIVE
                    </div>
                    <div
                        v-else-if="webrtc.streamStatus.value !== 'idle'"
                        class="absolute top-4 left-4 bg-black/60 px-2.5 py-1 rounded-md text-white text-xs font-medium z-10"
                    >
                        {{ statusLabel }}
                    </div>
                </div>

                <div class="flex-1 bg-auto">
                    <LiveComments />
                </div>
            </div>

            <!-- Stream Controls -->
            <div
                class="flex justify-between items-center bg-white dark:bg-gray-900 px-4 py-3 rounded-lg shadow-sm"
            >
                <div class="flex items-center gap-3">
                    <span
                        class="inline-block w-2.5 h-2.5 rounded-full"
                        :class="
                            webrtc.isStreaming.value ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                        "
                    />
                    <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {{ statusLabel }}
                        </p>
                        <p
                            v-if="live?.description"
                            class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs"
                        >
                            {{ live?.description }}
                        </p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <template v-if="!webrtc.isStreaming.value">
                        <UButton
                            color="primary"
                            icon="i-heroicons-play-solid"
                            @click="webrtc.startLive(live)"
                        >
                            Start Stream
                        </UButton>
                    </template>
                    <template v-else>
                        <UButton
                            color="error"
                            icon="i-heroicons-stop-solid"
                            @click="webrtc.stopStream"
                        >
                            Stop Stream
                        </UButton>
                    </template>
                </div>
            </div>
        </div>

        <!-- Sidebar -->
        <!-- <div
      class="max-w-80 shrink-0 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col gap-2"
    >
      <template v-if="live">
        <LiveStats :live="live" :is-streaming="webrtc.isStreaming.value" />

        <LiveComments />
      </template>
      <template v-else>
        <USkeleton class="h-12 w-12 rounded-full" />

        <div class="grid gap-2">
          <USkeleton class="h-4 w-[250px]" />
          <USkeleton class="h-4 w-[200px]" />
        </div>
      </template>
    </div> -->
    </div>
</template>
