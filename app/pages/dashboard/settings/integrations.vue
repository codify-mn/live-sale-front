<script setup lang="ts">
const config = useRuntimeConfig()
const toast = useToast()
const { user, fetchUser } = useAuth()
const shop = useShop()

const isDisconnecting = ref(false)
const isConnecting = ref(false)

const disconnect = async () => {
    isDisconnecting.value = true
    try {
        await $fetch(`${config.public.apiUrl}/api/connect/facebook`, {
            method: 'DELETE',
            credentials: 'include'
        })
        toast.add({ title: 'Success', description: 'Facebook disconnected successfully' })
        await fetchUser()
    } catch (e) {
        toast.add({ title: 'Error', description: 'Failed to disconnect', color: 'error' })
    } finally {
        isDisconnecting.value = false
    }
}

const connect = async () => {
    isConnecting.value = true
    await navigateTo(`${config.public.apiUrl}/api/connect/facebook`, { external: true })
    // isConnecting.value = false
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <UPageCard
            title="Integrations"
            description="Manage your connected accounts"
            variant="naked"
            class="mb-4"
        />

        <UPageCard title="Facebook" variant="subtle">
            <div class="flex items-center justify-between gap-4">
                <p
                    v-if="user?.is_facebook_connected"
                    class="text-sm text-gray-500 dark:text-gray-400"
                >
                    Connected to
                    <span class="font-medium text-gray-900 dark:text-white">{{
                        shop?.facebook_page?.page_name
                    }}</span>
                </p>
                <p v-else class="text-sm text-gray-500 dark:text-gray-400">
                    Connect your Facebook Page to sync products and orders
                </p>
                <div class="flex items-center gap-2">
                    <UButton
                        :icon="
                            user?.is_facebook_connected
                                ? 'i-heroicons-arrow-path'
                                : 'i-simple-icons-facebook'
                        "
                        :label="user?.is_facebook_connected ? 'Reconnect' : 'Connect Page'"
                        :loading="isConnecting"
                        @click="connect"
                    />
                </div>
            </div>
        </UPageCard>
    </div>
</template>
