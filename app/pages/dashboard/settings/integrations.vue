<script setup lang="ts">
const config = useRuntimeConfig()
const toast = useToast()

const { data: facebookStatus, refresh } = await useFetch(
    `${config.public.apiUrl}/api/connect/facebook/status`,
    {
        credentials: 'include'
    }
)

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
        await refresh()
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

        <UPageCard
            title="Facebook"
            description="Connect your Facebook Page to start live selling"
            variant="subtle"
        >
            <template #description>
                <div v-if="facebookStatus?.connected" class="mt-1 text-sm text-gray-500">
                    Connected to
                    <span class="font-medium text-gray-900 dark:text-white">{{
                        facebookStatus.page_name
                    }}</span>
                </div>
                <div v-else class="mt-1 text-sm text-gray-500">
                    Connect your Facebook Page to sync products and orders
                </div>
            </template>

            <div class="flex items-center justify-between mt-4">
                <div class="flex items-center gap-2">
                    <UIcon
                        size="2rem"
                        name="i-simple-icons-facebook"
                        class="text-xl text-blue-600 dark:text-blue-400"
                    />
                </div>

                <div v-if="facebookStatus?.connected">
                    <UButton
                        color="error"
                        variant="soft"
                        :loading="isDisconnecting"
                        @click="disconnect"
                        >Disconnect</UButton
                    >
                </div>
                <div v-else>
                    <UButton
                        icon="i-simple-icons-facebook"
                        @click="connect"
                        :loading="isConnecting"
                    >
                        <template v-if="isConnecting">
                            <UIcon name="i-heroicons-refresh-cw" class="animate-spin" />
                        </template>
                        Connect Page
                    </UButton>
                </div>
            </div>
        </UPageCard>
    </div>
</template>
