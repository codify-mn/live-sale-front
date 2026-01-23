<script setup lang="ts">
import type { LiveSale } from '~/types';

const toast = useToast()
const config = useRuntimeConfig()
const route = useRoute()

const { data: live } = useFetch<LiveSale>(`${config.public.apiUrl}/api/live-sales/${route.params.liveID}`, {
    credentials: 'include'
})
const isStreaming = ref(false)
const streamStatus = ref<string>('Idle')
const videoRef = ref<HTMLVideoElement | null>(null)
let pc: RTCPeerConnection | null = null
let localStream: MediaStream | null = null



const startLive = async () => {
    streamStatus.value = 'Starting...'

    try {
        if (!live.value?.stream_url) throw new Error('No RTMP URL returned')

        // 2. Initialize WebRTC
        streamStatus.value = 'Accessing Camera...'
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

        if (videoRef.value) {
            videoRef.value.srcObject = localStream
        }

        streamStatus.value = 'Connecting...'
        pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        })

        // Add tracks
        localStream.getTracks().forEach(track => {
            if (localStream && pc) {
                pc.addTrack(track, localStream)
            }
        })

        // 3. Negotiate
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)

        // Wait for ICE gathering to complete (simple approach) or just send the offer
        await new Promise<void>(resolve => {
            if (pc?.iceGatheringState === 'complete') {
                resolve();
            } else {
                pc!.onicegatheringstatechange = () => {
                    if (pc?.iceGatheringState === 'complete') {
                        resolve();
                    }
                };
            }
            // Fallback timeout
            setTimeout(resolve, 1000)
        });


        const response = await fetch(`${config.public.apiUrl}/api/live-sales/${live.value?.id}/broadcast/negotiate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sdp: pc.localDescription?.sdp,
                rtmp_url: live.value?.stream_url,
            }),
            credentials: 'include'
        })

        if (!response.ok) {
            throw new Error("Server rejected offer: " + (await response.text()))
        }

        const data = await response.json()
        await pc.setRemoteDescription(
            new RTCSessionDescription({
                type: "answer",
                sdp: data.sdp,
            })
        )

        isStreaming.value = true
        streamStatus.value = 'Live'
        toast.add({ title: 'Success', description: 'Stream started successfully', color: 'success' })

    } catch (error: any) {
        console.error('Streaming error:', error)
        streamStatus.value = 'Error'
        toast.add({ title: 'Error', description: error.message || 'Failed to start stream', color: 'error' })
        stopStream()
    }
}

const stopStream = () => {
    streamStatus.value = 'Stopping...'
    if (pc) {
        pc.close()
        pc = null
    }
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
        localStream = null
    }
    if (videoRef.value) {
        videoRef.value.srcObject = null
    }
    isStreaming.value = false
    streamStatus.value = 'Idle'
}



</script>
<template>
    <div>
        <div v-if="live" class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <div class="aspect-video bg-black rounded-lg overflow-hidden relative mb-4">
                <video ref="videoRef" autoplay muted playsinline class="w-full h-full object-cover"></video>
                <div class="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded text-white text-sm font-medium">
                    {{ streamStatus }}
                </div>
            </div>
            <div class="flex justify-between items-center">
                <template v-if="live">
                    <div>
                        <h3 class="font-semibold">{{ live.id }}</h3>
                        <p class="text-sm text-gray-500">{{ live.status }}</p>
                    </div>
                    <UButton color="error" icon="i-heroicons-play" @click="startLive">
                        Start Stream</UButton>
                    <UButton color="error" icon="i-heroicons-stop" @click="stopStream">
                        Stop Stream</UButton>
                </template>
            </div>
        </div>
    </div>
</template>