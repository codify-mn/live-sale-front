import { createSharedComposable } from '@vueuse/core'

export interface ShopSettings {
    auto_reply: boolean
    reply_message: string
    payment_method: string
    comment_prefix: string
    allow_overselling: boolean
    delivery_fee: number
    delivery_note: string
    free_delivery_over: number
    bank_name: string
    bank_account_number: string
    bank_account_name: string
}

export interface ShopData {
    id: number
    name: string
    phone_number: string
    owner_id: number
    is_active: boolean
    picture: string
    description: string
    settings: ShopSettings
}

const _useShopSettings = () => {
    const config = useRuntimeConfig()
    const toast = useToast()

    const shop = ref<ShopData | null>(null)
    const isLoading = ref(false)
    const isSaving = ref(false)
    const error = ref<string | null>(null)

    const fetchShop = async () => {
        isLoading.value = true
        error.value = null

        try {
            const data = await $fetch<ShopData>(`${config.public.apiUrl}/api/shops/my`, {
                credentials: 'include'
            })
            shop.value = data
        } catch (err: any) {
            if (err.status !== 404) {
                error.value = 'Дэлгүүрийн мэдээлэл ачаалахад алдаа гарлаа'
                console.error('Failed to fetch shop:', err)
            }
        } finally {
            isLoading.value = false
        }
    }

    const updateShop = async (updates: Partial<ShopData>) => {
        isSaving.value = true
        error.value = null

        try {
            const data = await $fetch<ShopData>(`${config.public.apiUrl}/api/shops/my`, {
                method: 'PUT',
                credentials: 'include',
                body: updates
            })
            shop.value = data
            toast.add({
                title: 'Амжилттай',
                description: 'Тохиргоо хадгалагдлаа.',
                icon: 'i-lucide-check',
                color: 'success'
            })
            return data
        } catch (err: any) {
            error.value = 'Тохиргоо хадгалахад алдаа гарлаа'
            toast.add({
                title: 'Алдаа',
                description: 'Тохиргоо хадгалахад алдаа гарлаа.',
                icon: 'i-lucide-x',
                color: 'error'
            })
            console.error('Failed to update shop:', err)
            throw err
        } finally {
            isSaving.value = false
        }
    }

    return {
        shop,
        isLoading,
        isSaving,
        error,
        fetchShop,
        updateShop
    }
}

export const useShopSettings = createSharedComposable(_useShopSettings)
