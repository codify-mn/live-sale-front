export type OverlayLayout = 'banner' | 'card'

interface ProductOverlayData {
    name: string
    price: number
    salePrice: number | null
    imageUrl: string | null
}

export const useCanvasStream = () => {
    const canvasRef = ref<HTMLCanvasElement | null>(null)
    const productName = ref('')
    const productImageUrl = ref<string | null>(null)
    const overlayLayout = ref<OverlayLayout>('banner')

    let animationId: number | null = null
    let videoElement: HTMLVideoElement | null = null
    let productImage: HTMLImageElement | null = null
    let canvasStream: MediaStream | null = null
    let productPrice = 0
    let productSalePrice: number | null = null

    const CANVAS_WIDTH = 720
    const CANVAS_HEIGHT = 1280

    const drawBannerOverlay = (ctx: CanvasRenderingContext2D) => {
        const padding = 16
        const margin = 16
        const imgSize = 72
        const boxX = margin
        const boxY = margin
        const boxWidth = CANVAS_WIDTH - margin * 2
        const hasImage = productImage && productImage.complete && productImage.naturalWidth > 0

        // Measure text to determine box height
        ctx.font = 'bold 26px sans-serif'
        const nameHeight = 30
        const priceHeight = 24
        const hasSale = productSalePrice != null && productSalePrice > 0
        const textBlockHeight = nameHeight + 4 + priceHeight
        const contentHeight = Math.max(hasImage ? imgSize : 0, textBlockHeight)
        const boxHeight = contentHeight + padding * 2

        // Semi-transparent background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        ctx.beginPath()
        ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 12)
        ctx.fill()

        let offsetX = boxX + padding

        // Product image
        if (hasImage && productImage) {
            const imgY = boxY + (boxHeight - imgSize) / 2
            ctx.save()
            ctx.beginPath()
            ctx.roundRect(offsetX, imgY, imgSize, imgSize, 8)
            ctx.clip()
            ctx.drawImage(productImage, offsetX, imgY, imgSize, imgSize)
            ctx.restore()
            offsetX += imgSize + padding
        }

        // Product name
        const textY = boxY + padding
        if (productName.value) {
            ctx.fillStyle = '#ffffff'
            ctx.font = 'bold 26px sans-serif'
            ctx.textBaseline = 'top'
            ctx.textAlign = 'left'

            // Truncate name if too long
            const maxTextWidth = boxWidth - (offsetX - boxX) - padding
            let displayName = productName.value
            while (ctx.measureText(displayName).width > maxTextWidth && displayName.length > 3) {
                displayName = displayName.slice(0, -1)
            }
            if (displayName !== productName.value) displayName += '...'
            ctx.fillText(displayName, offsetX, textY)
        }

        // Price line
        const priceY = textY + nameHeight + 4
        if (hasSale) {
            // Sale price (highlighted)
            ctx.fillStyle = '#fbbf24'
            ctx.font = 'bold 24px sans-serif'
            ctx.textBaseline = 'top'
            ctx.textAlign = 'left'
            const salePriceText = formatCurrency(productSalePrice!)
            ctx.fillText(salePriceText, offsetX, priceY)

            // Original price (strikethrough)
            const salePriceWidth = ctx.measureText(salePriceText).width
            const origX = offsetX + salePriceWidth + 12
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
            ctx.font = '20px sans-serif'
            const origText = formatCurrency(productPrice)
            ctx.fillText(origText, origX, priceY + 2)
            // Strikethrough line
            const origWidth = ctx.measureText(origText).width
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.moveTo(origX, priceY + 12)
            ctx.lineTo(origX + origWidth, priceY + 12)
            ctx.stroke()
        } else if (productPrice > 0) {
            ctx.fillStyle = '#ffffff'
            ctx.font = 'bold 24px sans-serif'
            ctx.textBaseline = 'top'
            ctx.textAlign = 'left'
            ctx.fillText(formatCurrency(productPrice), offsetX, priceY)
        }
    }

    const drawCardOverlay = (ctx: CanvasRenderingContext2D) => {
        const padding = 16
        const imgSize = 100
        const hasImage = productImage && productImage.complete && productImage.naturalWidth > 0
        const hasSale = productSalePrice != null && productSalePrice > 0

        // Measure needed height
        const nameHeight = 28
        const priceHeight = 24
        const gap = 8
        let contentHeight = padding
        if (hasImage) contentHeight += imgSize + gap
        if (productName.value) contentHeight += nameHeight + gap
        contentHeight += priceHeight
        contentHeight += padding

        const boxWidth = 320
        const boxX = (CANVAS_WIDTH - boxWidth) / 2
        const boxY = 16

        // Background with slight blur effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)'
        ctx.beginPath()
        ctx.roundRect(boxX, boxY, boxWidth, contentHeight, 16)
        ctx.fill()

        // Subtle border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.roundRect(boxX, boxY, boxWidth, contentHeight, 16)
        ctx.stroke()

        let currentY = boxY + padding

        // Centered product image
        if (hasImage && productImage) {
            const imgX = boxX + (boxWidth - imgSize) / 2
            ctx.save()
            ctx.beginPath()
            ctx.roundRect(imgX, currentY, imgSize, imgSize, 10)
            ctx.clip()
            ctx.drawImage(productImage, imgX, currentY, imgSize, imgSize)
            ctx.restore()
            currentY += imgSize + gap
        }

        // Centered product name
        if (productName.value) {
            ctx.fillStyle = '#ffffff'
            ctx.font = 'bold 24px sans-serif'
            ctx.textBaseline = 'top'
            ctx.textAlign = 'center'
            const centerX = boxX + boxWidth / 2

            // Truncate if needed
            const maxTextWidth = boxWidth - padding * 2
            let displayName = productName.value
            while (ctx.measureText(displayName).width > maxTextWidth && displayName.length > 3) {
                displayName = displayName.slice(0, -1)
            }
            if (displayName !== productName.value) displayName += '...'
            ctx.fillText(displayName, centerX, currentY)
            currentY += nameHeight + gap
        }

        // Centered price
        const centerX = boxX + boxWidth / 2
        if (hasSale) {
            ctx.font = 'bold 24px sans-serif'
            const salePriceText = formatCurrency(productSalePrice!)
            const salePriceWidth = ctx.measureText(salePriceText).width

            ctx.font = '18px sans-serif'
            const origText = formatCurrency(productPrice)
            const origWidth = ctx.measureText(origText).width

            const totalWidth = salePriceWidth + 10 + origWidth
            const startX = centerX - totalWidth / 2

            // Sale price
            ctx.fillStyle = '#fbbf24'
            ctx.font = 'bold 24px sans-serif'
            ctx.textBaseline = 'top'
            ctx.textAlign = 'left'
            ctx.fillText(salePriceText, startX, currentY)

            // Original price (strikethrough)
            const origX = startX + salePriceWidth + 10
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
            ctx.font = '18px sans-serif'
            ctx.fillText(origText, origX, currentY + 3)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.moveTo(origX, currentY + 12)
            ctx.lineTo(origX + origWidth, currentY + 12)
            ctx.stroke()
        } else if (productPrice > 0) {
            ctx.fillStyle = '#ffffff'
            ctx.font = 'bold 24px sans-serif'
            ctx.textBaseline = 'top'
            ctx.textAlign = 'center'
            ctx.fillText(formatCurrency(productPrice), centerX, currentY)
        }
    }

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
                sw = videoElement.videoHeight * canvasAspect
                sx = (videoElement.videoWidth - sw) / 2
            } else {
                sh = videoElement.videoWidth / canvasAspect
                sy = (videoElement.videoHeight - sh) / 2
            }

            ctx.drawImage(videoElement, sx, sy, sw, sh, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

            // Draw product overlay
            if (productName.value || productImage) {
                if (overlayLayout.value === 'card') {
                    drawCardOverlay(ctx)
                } else {
                    drawBannerOverlay(ctx)
                }
            }
        } catch (error) {
            console.error('Error in drawFrame:', error)
        }

        animationId = requestAnimationFrame(drawFrame)
    }

    const start = (webcamStream: MediaStream): MediaStream => {
        const canvas = canvasRef.value
        if (!canvas) throw new Error('Canvas ref not set')

        canvas.width = CANVAS_WIDTH
        canvas.height = CANVAS_HEIGHT

        videoElement = document.createElement('video')
        videoElement.srcObject = webcamStream
        videoElement.muted = true
        videoElement.playsInline = true
        videoElement.play()

        animationId = requestAnimationFrame(drawFrame)

        canvasStream = canvas.captureStream(30)

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

    const updateProduct = (data: ProductOverlayData) => {
        productName.value = data.name
        productPrice = data.price
        productSalePrice = data.salePrice
        data.imageUrl =
            'https://scontent.fuln6-3.fna.fbcdn.net/v/t39.30808-1/550217404_1302201694757883_1162368186793065237_n.jpg?stp=cp0_dst-jpg_s50x50_tt6&_nc_cat=105&ccb=1-7&_nc_sid=f907e8&_nc_ohc=JSCzT8wTqd0Q7kNvwHrLlL8&_nc_oc=Adn_tk51xotvH3mdjTHPus2LMYUOZAH03LIAWjwHt0oOvvRJ5zeq1TAa8-_dKFxpW_2ravRJSzNMTSiNtzfyYOgP&_nc_zt=24&_nc_ht=scontent.fuln6-3.fna&edm=AGaHXAAEAAAA&_nc_gid=nafZ-pJ1-HlSGjKbh8Uldg&_nc_tpa=Q5bMBQEEyi5shJBsKqcY6pek-chgyhjMpIAwSyNBYEI6POJPEJfcqsgf8nGqvSfAFCAoaarhRKSI9ff6yw&oh=00_AfusUjmWX30ZPBqSO0vD3kOTD8135HfTGVyA6QkPqhf5XQ&oe=698995C6'

        const _imageUrl = data.imageUrl
        if (_imageUrl) {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.src = _imageUrl

            img.onload = () => {
                productImage = img
                productImageUrl.value = _imageUrl
            }

            img.onerror = () => {
                const fallbackImg = new Image()
                fallbackImg.onload = () => {
                    productImage = fallbackImg
                    productImageUrl.value = _imageUrl
                }
                fallbackImg.onerror = () => {
                    productImage = null
                    productImageUrl.value = null
                }
                fallbackImg.src = _imageUrl
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
        overlayLayout,
        start,
        stop,
        updateProduct
    }
}
