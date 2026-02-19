export interface PostToFacebookInput {
    template: string
    bg_color: string
    caption: string
    watch_comments: boolean
}

export interface PostToFacebookResponse {
    post_id: string
    image_url: string
}

export interface GenerateCaptionResponse {
    caption: string
}

export function useProductPost() {
    const config = useRuntimeConfig()
    const apiUrl = config.public.apiUrl

    const getPreviewImageUrl = (productId: number, template: string, bgColor: string): string => {
        const encodedColor = encodeURIComponent(bgColor)
        return `${apiUrl}/api/products/${productId}/generate-image?template=${template}&bg_color=${encodedColor}`
    }

    const generateCaption = async (productId: number, customPrompt?: string): Promise<string> => {
        const body: Record<string, string> = {}
        if (customPrompt) {
            body.custom_prompt = customPrompt
        }

        const response = await $fetch<GenerateCaptionResponse>(
            `${apiUrl}/api/products/${productId}/generate-caption`,
            {
                method: 'POST',
                credentials: 'include',
                body
            }
        )
        return response.caption
    }

    const postToFacebook = async (
        productId: number,
        data: PostToFacebookInput
    ): Promise<PostToFacebookResponse> => {
        return await $fetch<PostToFacebookResponse>(
            `${apiUrl}/api/products/${productId}/post-facebook`,
            {
                method: 'POST',
                credentials: 'include',
                body: data
            }
        )
    }

    return {
        getPreviewImageUrl,
        generateCaption,
        postToFacebook
    }
}
