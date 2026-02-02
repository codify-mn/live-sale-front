<script setup lang="ts">
import type { LiveSale } from '~/types'

const config = useRuntimeConfig()
const toast = useToast()

const { data: lives, refresh } = await useFetch<LiveSale[]>(
    `${config.public.apiUrl}/api/live-sales`,
    {
        credentials: 'include'
    }
)

const isLiveModalOpen = ref(false)
const isLoading = ref(false)
const liveForm = reactive({
    title: '',
    description: ''
})

const createLive = async () => {
    try {
        if (!liveForm.title) {
            toast.add({
                title: 'Error',
                description: 'Title is required',
                color: 'error'
            })
            return
        }

        isLoading.value = true

        const { id } = await $fetch<LiveSale>(`${config.public.apiUrl}/api/live-sales/start-new`, {
            method: 'POST',
            body: liveForm,
            credentials: 'include'
        })

        navigateTo(`/app/live/${id}`)
    } catch (error) {
        console.error('Failed to create live:', error)
        toast.add({
            title: 'Error',
            description: 'Failed to create live',
            color: 'error'
        })
    } finally {
        isLoading.value = false
    }
}

const statusColor = (status: string) => {
    const map: Record<string, string> = {
        live: 'error',
        ended: 'neutral',
        scheduled: 'info',
        created: 'warning'
    }
    return map[status] || 'neutral'
}

const statusLabel = (status: string) => {
    const map: Record<string, string> = {
        live: 'LIVE',
        ended: 'Ended',
        scheduled: 'Scheduled',
        created: 'Created'
    }
    return map[status] || status
}

const facebookUrl = (live: LiveSale) => {
    if (live.ref_id) {
        return `https://www.facebook.com/${live.ref_id}`
    }
    return null
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('mn-MN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date)
}
</script>

<template>
    <div class="w-full h-full overflow-y-auto">
        <UDashboardPanel id="live-sales">
            <UDashboardNavbar title="Facebook Live">
                <template #right>
                    <UButton color="primary" icon="i-lucide-video" @click="isLiveModalOpen = true">
                        New Live
                    </UButton>
                </template>
            </UDashboardNavbar>

            <div class="p-6 space-y-6 overflow-y-auto">
                <!-- Live Sales List -->
                <div v-if="lives && lives.length > 0" class="space-y-3">
                    <NuxtLink
                        v-for="live in lives"
                        :key="live.id"
                        :to="`/app/live/${live.id}`"
                        class="block group"
                    >
                        <div
                            class="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700"
                        >
                            <!-- Facebook Icon -->
                            <div
                                class="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                                :class="
                                    live.status === 'live'
                                        ? 'bg-red-100 dark:bg-red-900/30'
                                        : 'bg-blue-100 dark:bg-blue-900/30'
                                "
                            >
                                <UIcon
                                    :name="
                                        live.status === 'live'
                                            ? 'i-lucide-radio'
                                            : 'i-simple-icons-facebook'
                                    "
                                    class="text-xl"
                                    :class="
                                        live.status === 'live'
                                            ? 'text-red-600 dark:text-red-400'
                                            : 'text-blue-600 dark:text-blue-400'
                                    "
                                />
                            </div>

                            <!-- Info -->
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2 mb-0.5">
                                    <h3
                                        class="font-semibold text-sm text-gray-900 dark:text-white truncate group-hover:text-primary-500 transition-colors"
                                    >
                                        {{ live.title || 'Untitled Live' }}
                                    </h3>
                                    <UBadge
                                        :color="statusColor(live.status) as any"
                                        :variant="live.status === 'live' ? 'solid' : 'subtle'"
                                        size="xs"
                                    >
                                        <span
                                            v-if="live.status === 'live'"
                                            class="inline-block w-1.5 h-1.5 rounded-full bg-white mr-1 animate-pulse"
                                        />
                                        {{ statusLabel(live.status) }}
                                    </UBadge>
                                </div>
                                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    <span v-if="live.page?.name">{{ live.page.name }}</span>
                                    <span v-else>Page #{{ live.page_id }}</span>
                                    <span v-if="live.created_at" class="mx-1.5">&middot;</span>
                                    <span v-if="live.created_at">{{
                                        formatDate(live.created_at)
                                    }}</span>
                                </p>
                                <p
                                    v-if="live.description"
                                    class="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5"
                                >
                                    {{ live.description }}
                                </p>
                            </div>

                            <!-- Stats -->
                            <div
                                class="hidden sm:flex items-center gap-5 shrink-0 text-xs text-gray-500 dark:text-gray-400"
                            >
                                <div class="flex items-center gap-1.5">
                                    <UIcon name="i-heroicons-eye" class="text-sm" />
                                    <span>{{ live.views ?? 0 }}</span>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <UIcon name="i-heroicons-heart" class="text-sm" />
                                    <span>{{ live.likes ?? 0 }}</span>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex items-center gap-2 shrink-0">
                                <UButton
                                    v-if="facebookUrl(live)"
                                    :to="facebookUrl(live)!"
                                    target="_blank"
                                    color="primary"
                                    variant="soft"
                                    icon="i-heroicons-arrow-top-right-on-square"
                                    size="xs"
                                    @click.stop
                                >
                                    Facebook
                                </UButton>
                                <UIcon
                                    name="i-heroicons-chevron-right"
                                    class="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                                />
                            </div>
                        </div>
                    </NuxtLink>
                </div>

                <!-- Empty State -->
                <div v-else class="flex flex-col items-center justify-center py-20 text-center">
                    <div
                        class="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4"
                    >
                        <UIcon
                            name="i-lucide-video"
                            class="text-2xl text-blue-600 dark:text-blue-400"
                        />
                    </div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                        No live sales yet
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Start your first Facebook live sale to begin selling
                    </p>
                    <UButton color="primary" icon="i-lucide-video" @click="isLiveModalOpen = true">
                        Start Live
                    </UButton>
                </div>
            </div>

            <UModal v-model:open="isLiveModalOpen">
                <template #header>
                    <div class="flex-1 flex items-center justify-between">
                        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                            Start Live Sale
                        </h3>
                        <UButton
                            color="neutral"
                            variant="ghost"
                            icon="i-heroicons-x-mark-20-solid"
                            class="-my-1"
                            @click="isLiveModalOpen = false"
                        />
                    </div>
                </template>

                <template #body>
                    <div class="space-y-4">
                        <UFormField label="Title" required>
                            <UInput v-model="liveForm.title" placeholder="Enter stream title..." />
                        </UFormField>
                        <UFormField label="Description">
                            <UTextarea
                                v-model="liveForm.description"
                                placeholder="Enter stream description..."
                                autoresize
                                class="w-full"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #footer>
                    <div class="flex justify-end gap-2">
                        <UButton color="secondary" variant="ghost" @click="isLiveModalOpen = false">
                            Cancel
                        </UButton>
                        <UButton color="primary" :loading="isLoading" @click="createLive">
                            Go Live
                        </UButton>
                    </div>
                </template>
            </UModal>
        </UDashboardPanel>
    </div>
</template>
