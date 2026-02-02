import type { LiveSale } from '~/types'

export enum StreamStatus {
    IDLE = 'idle',
    STARTING = 'starting',
    ACCESSING_CAMERA = 'accessing_camera',
    CONNECTING = 'connecting',
    STOPPING = 'stopping',
    LIVE = 'live',
    ERROR = 'error'
}

const closeDialogHandler = (event: Event) => {
    event.preventDefault()

    // Included for legacy support, e.g. Chrome/Edge < 119
    event.returnValue = true
}

export const useWebRTC = () => {
    const config = useRuntimeConfig()
    const toast = useToast()

    const isStreaming = ref(false)
    const streamStatus = ref<StreamStatus>(StreamStatus.IDLE)
    const videoRef = ref<HTMLVideoElement | null>(null)
    let pc: RTCPeerConnection | null = null
    let localStream: MediaStream | null = null

    const startLive = async (live: LiveSale) => {
        streamStatus.value = StreamStatus.STARTING

        try {
            window.addEventListener('beforeunload', closeDialogHandler)

            if (!live.stream_url) throw new Error('No RTMP URL returned')

            // 2. Initialize WebRTC
            streamStatus.value = StreamStatus.ACCESSING_CAMERA
            localStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    aspectRatio: 9 / 16
                },
                audio: true
            })

            if (videoRef.value) {
                videoRef.value.srcObject = localStream
            }

            streamStatus.value = StreamStatus.CONNECTING
            pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            })

            // Add tracks
            localStream.getTracks().forEach((track) => {
                if (localStream && pc) {
                    pc.addTrack(track, localStream)
                }
            })

            // 3. Negotiate
            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)

            // Wait for ICE gathering to complete (simple approach) or just send the offer
            await new Promise<void>((resolve) => {
                if (pc?.iceGatheringState === 'complete') {
                    resolve()
                } else {
                    pc!.onicegatheringstatechange = () => {
                        if (pc?.iceGatheringState === 'complete') {
                            resolve()
                        }
                    }
                }
                // Fallback timeout
                setTimeout(resolve, 1000)
            })

            const response = await fetch(
                `${config.public.apiUrl}/api/live-sales/${live.id}/broadcast/negotiate`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sdp: pc.localDescription?.sdp,
                        rtmp_url: live.stream_url
                    }),
                    credentials: 'include'
                }
            )

            if (!response.ok) {
                throw new Error('Server rejected offer: ' + (await response.text()))
            }

            const data = await response.json()
            await pc.setRemoteDescription(
                new RTCSessionDescription({
                    type: 'answer',
                    sdp: data.sdp
                })
            )

            isStreaming.value = true
            streamStatus.value = StreamStatus.LIVE
            toast.add({
                title: 'Success',
                description: 'Stream started successfully',
                color: 'success'
            })
        } catch (error: any) {
            console.error('Streaming error:', error)
            streamStatus.value = StreamStatus.ERROR
            toast.add({
                title: 'Error',
                description: error.message || 'Failed to start stream',
                color: 'error'
            })
            stopStream()
        }
    }

    const stopStream = () => {
        window.removeEventListener('beforeunload', closeDialogHandler)

        streamStatus.value = StreamStatus.STOPPING
        if (pc) {
            pc.close()
            pc = null
        }
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop())
            localStream = null
        }
        if (videoRef.value) {
            videoRef.value.srcObject = null
        }
        isStreaming.value = false
        streamStatus.value = StreamStatus.IDLE
    }

    return {
        isStreaming,
        streamStatus,
        videoRef,
        startLive,
        stopStream
    }
}
