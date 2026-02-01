<script setup lang="ts">
import type { LiveSale } from '~/types'

const toast = useToast()
const config = useRuntimeConfig()
const route = useRoute()

const webrtc = useWebRTC()

const live = await $fetch<LiveSale>(
  `${config.public.apiUrl}/api/live-sales/${route.params.liveID}`,
  {
    credentials: 'include'
  }
)

provide('live', live)
provide('addedProducts', ref(live.products))

// const comments = await $fetch<LiveSaleComment[]>(`${config.public.apiUrl}/api/live-sales/${route.params.liveID}/comments`, {
//     credentials: 'include'
// })
</script>
<template>
  <div class="h-[calc(100vh)] w-full flex gap-4 p-4">
    <!-- Main Video Area -->
    <div class="flex-1 md:max-w-1/3">
      <ProductList />
    </div>
    <div class="flex flex-1 flex-col min-w-0 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
      <div class="flex-1 relative bg-black rounded-lg overflow-hidden mb-4 min-h-0">
        <video
          :ref="webrtc.videoRef"
          autoplay
          muted
          playsinline
          class="w-full h-full object-contain"
        ></video>
        <div
          class="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded text-white text-sm font-medium z-10"
        >
          {{ webrtc.streamStatus }}
        </div>
      </div>

      <div
        class="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm"
      >
        <div>
          <h3 class="font-semibold text-lg">{{ live.id }}</h3>
          <!-- Assuming live object has title or we use ID for now -->
          <p class="text-sm text-gray-500">
            <span
              class="inline-block w-2 h-2 rounded-full mr-2"
              :class="webrtc.isStreaming.value ? 'bg-green-500' : 'bg-gray-400'"
            ></span>
            {{ webrtc.streamStatus }}
          </p>
        </div>
        <div class="flex gap-2">
          <template v-if="!webrtc.isStreaming.value">
            <UButton color="primary" icon="i-heroicons-play-solid" @click="webrtc.startLive(live)">
              Start Stream
            </UButton>
          </template>
          <template v-else>
            <UButton color="error" icon="i-heroicons-stop-solid" @click="webrtc.stopStream">
              Stop Stream
            </UButton>
          </template>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div
      class="max-w-80 shrink-0 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col gap-2"
    >
      <LiveStats :live="live" :is-streaming="webrtc.isStreaming.value" />
      <LiveComments />
    </div>
  </div>
</template>
