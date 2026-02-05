export const useCanvasStream = () => {
    const canvasRef = ref<HTMLCanvasElement | null>(null)
    const productName = ref('')
    const productImageUrl = ref<string | null>(null)

    let animationId: number | null = null
    let videoElement: HTMLVideoElement | null = null
    let productImage: HTMLImageElement | null = null
    let canvasStream: MediaStream | null = null

    const CANVAS_WIDTH = 720
    const CANVAS_HEIGHT = 1280

    const drawFrame = () => {
        try {
            const canvas = canvasRef.value
            if (!canvas || !videoElement) {
                animationId = requestAnimationFrame(drawFrame)
                return
            }

            const ctx = canvas.getContext('2d')
            if (!ctx) {
                animationId = requestAnimationFrame(drawFrame)
                return
            }

            // Skip frame if video isn't ready
            if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
                animationId = requestAnimationFrame(drawFrame)
                return
            }

            // Draw webcam frame scaled to fill canvas
            const videoAspect = videoElement.videoWidth / videoElement.videoHeight
            const canvasAspect = CANVAS_WIDTH / CANVAS_HEIGHT
            let sx = 0,
                sy = 0,
                sw = videoElement.videoWidth,
                sh = videoElement.videoHeight

            if (videoAspect > canvasAspect) {
                // Video is wider — crop sides
                sw = videoElement.videoHeight * canvasAspect
                sx = (videoElement.videoWidth - sw) / 2
            } else {
                // Video is taller — crop top/bottom
                sh = videoElement.videoWidth / canvasAspect
                sy = (videoElement.videoHeight - sh) / 2
            }

            ctx.drawImage(videoElement, sx, sy, sw, sh, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

            // Draw product overlay
            if (productName.value || productImage) {
                const padding = 12
                const margin = 20
                const imgSize = 80
                const bottomY = CANVAS_HEIGHT - margin

                // Calculate text metrics
                ctx.font = 'bold 24px sans-serif'
                const textMetrics = ctx.measureText(productName.value)
                const textHeight = 28

                // Calculate box dimensions
                const hasImage =
                    productImage && productImage.complete && productImage.naturalWidth > 0

                const contentWidth =
                    (hasImage ? imgSize + padding : 0) + (productName.value ? textMetrics.width : 0)
                const boxWidth = contentWidth + padding * 2
                const boxHeight = Math.max(hasImage ? imgSize : 0, textHeight) + padding * 2
                const boxX = margin
                const boxY = bottomY - boxHeight

                // Draw semi-transparent background
                ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
                ctx.beginPath()
                ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 8)
                ctx.fill()

                let offsetX = boxX + padding

                // Draw product image
                if (hasImage && productImage) {
                    console.log('productImage', productImage)
                    const imgY = boxY + (boxHeight - imgSize) / 2
                    ctx.drawImage(productImage, offsetX, imgY, imgSize, imgSize)
                    offsetX += imgSize + padding
                }

                // Draw product name
                if (productName.value) {
                    ctx.fillStyle = '#ffffff'
                    ctx.font = 'bold 24px sans-serif'
                    ctx.textBaseline = 'middle'
                    ctx.fillText(productName.value, offsetX, boxY + boxHeight / 2)
                }
            }
        } catch (error) {
            // Log error but don't stop the loop
            console.error('Error in drawFrame:', error)
        }

        animationId = requestAnimationFrame(drawFrame)
    }

    const start = (webcamStream: MediaStream): MediaStream => {
        const canvas = canvasRef.value
        if (!canvas) throw new Error('Canvas ref not set')

        canvas.width = CANVAS_WIDTH
        canvas.height = CANVAS_HEIGHT

        // Create hidden video element to play webcam stream
        videoElement = document.createElement('video')
        videoElement.srcObject = webcamStream
        videoElement.muted = true
        videoElement.playsInline = true
        videoElement.play()

        // Start drawing loop
        animationId = requestAnimationFrame(drawFrame)

        // Capture canvas as video stream
        canvasStream = canvas.captureStream(30)

        // Add audio tracks from webcam
        webcamStream.getAudioTracks().forEach((track) => {
            canvasStream!.addTrack(track)
        })

        return canvasStream
    }

    const stop = () => {
        if (animationId !== null) {
            cancelAnimationFrame(animationId)
            animationId = null
        }
        if (videoElement) {
            videoElement.pause()
            videoElement.srcObject = null
            videoElement = null
        }
        canvasStream = null
        productImage = null
    }

    const updateProduct = (name: string, imageUrl: string | null) => {
        productName.value = name

        if (imageUrl) {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.src = imageUrl

            img.onload = () => {
                productImage = img
                productImageUrl.value = imageUrl
            }

            img.onerror = () => {
                // Retry without CORS
                const fallbackImg = new Image()
                fallbackImg.onload = () => {
                    productImage = fallbackImg
                    productImageUrl.value = imageUrl
                }
                fallbackImg.onerror = () => {
                    // Silent fail - just don't show image
                    productImage = null
                    productImageUrl.value = null
                }
                fallbackImg.src = imageUrl
            }
        } else {
            productImage = null
            productImageUrl.value = null
        }
    }

    return {
        canvasRef,
        productName,
        productImageUrl,
        start,
        stop,
        updateProduct
    }
}
