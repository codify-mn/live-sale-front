<script setup lang="ts">
const {
    subscription,
    usage,
    loading,
    daysRemaining,
    isTrialing,
    isActive,
    formatLimit,
    formatStorage,
    fetchSubscription,
    fetchUsage,
    cancelSubscription
} = useSubscription()
const toast = useToast()

const showCancelModal = ref(false)
const canceling = ref(false)

onMounted(async () => {
    await Promise.all([fetchSubscription(), fetchUsage()])
})

const statusColor = computed(() => {
    switch (subscription.value?.status) {
        case 'active':
            return 'success'
        case 'trialing':
            return 'info'
        case 'past_due':
            return 'warning'
        case 'canceled':
        case 'expired':
            return 'error'
        default:
            return 'neutral'
    }
})

const statusLabel = computed(() => {
    switch (subscription.value?.status) {
        case 'active':
            return 'Идэвхтэй'
        case 'trialing':
            return 'Туршилтын хугацаа'
        case 'past_due':
            return 'Хугацаа хэтэрсэн'
        case 'canceled':
            return 'Цуцлагдсан'
        case 'expired':
            return 'Дууссан'
        default:
            return 'Тодорхойгүй'
    }
})

const usageItems = computed(() => {
    if (!usage.value || !subscription.value?.plan) return []

    const plan = subscription.value.plan

    return [
        {
            label: 'Бүтээгдэхүүн',
            current: usage.value.product_count,
            max: plan.limits.max_products,
            icon: 'i-lucide-package'
        },
        {
            label: 'Захиалга /сараар/',
            current: usage.value.order_count_month,
            max: plan.limits.max_orders_per_month,
            icon: 'i-lucide-shopping-cart'
        },
        {
            label: 'Хадгалах зай',
            current: usage.value.storage_used_mb,
            max: plan.limits.max_storage_mb,
            icon: 'i-lucide-hard-drive',
            isStorage: true
        },
        {
            label: 'Дэлгүүр',
            current: usage.value.shop_count,
            max: plan.limits.max_shops,
            icon: 'i-lucide-store'
        }
    ]
})

const featureItems = computed(() => {
    if (!subscription.value?.plan) return []

    const features = subscription.value.plan.features

    return [
        { label: 'Facebook Live', enabled: features.facebook_live },
        { label: 'Дэвшилтэт аналитик', enabled: features.advanced_analytics },
        { label: 'Брэндийн тохиргоо', enabled: features.custom_branding },
        { label: 'Тусгай дэмжлэг', enabled: features.priority_support },
        { label: 'API хандалт', enabled: features.api_access }
    ]
})

const usagePercent = computed(() => {
    if (!usage.value || !subscription.value?.plan) return 0
    if (subscription.value.plan.limits.max_products === -1) return 0
    return Math.min(
        100,
        (usage.value.product_count / subscription.value.plan.limits.max_products) * 100
    )
})

async function handleCancel() {
    canceling.value = true
    try {
        await cancelSubscription()
        showCancelModal.value = false
        toast.add({
            title: 'Амжилттай',
            description: 'Таны захиалга цуцлагдлаа.',
            icon: 'i-lucide-check',
            color: 'success'
        })
    } catch {
        toast.add({
            title: 'Алдаа',
            description: 'Захиалга цуцлахад алдаа гарлаа.',
            icon: 'i-lucide-x',
            color: 'error'
        })
    } finally {
        canceling.value = false
    }
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <div v-if="loading" class="flex justify-center items-center py-12">
            <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-gray-400" />
        </div>

        <template v-else-if="subscription">
            <!-- Current Plan -->
            <UPageCard title="Одоогийн багц" description="Таны захиалгын мэдээлэл" variant="subtle">
                <div class="flex flex-col gap-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                                <UIcon
                                    name="i-lucide-crown"
                                    class="w-6 h-6 text-primary-600 dark:text-primary-400"
                                />
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold">
                                    {{ subscription.plan?.name }}
                                </h3>
                                <p class="text-sm text-gray-500">
                                    {{ subscription.plan?.description }}
                                </p>
                            </div>
                        </div>
                        <UBadge :color="statusColor" variant="subtle">
                            {{ statusLabel }}
                        </UBadge>
                    </div>

                    <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <UIcon name="i-lucide-calendar" class="w-4 h-4" />
                        <span v-if="isTrialing">
                            Туршилтын хугацаа дуусах: {{ daysRemaining }} хоног үлдсэн
                        </span>
                        <span v-else-if="isActive">
                            Дараагийн төлбөр: {{ daysRemaining }} хоногийн дараа
                        </span>
                        <span v-else> Хугацаа дууссан </span>
                    </div>

                    <div class="flex items-center gap-2 text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Төлбөрийн мөчлөг:</span>
                        <span class="font-medium">
                            {{ subscription.billing_cycle === 'monthly' ? 'Сар бүр' : 'Жил бүр' }}
                        </span>
                    </div>

                    <div class="flex items-center gap-2 text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Үнэ:</span>
                        <span class="font-semibold text-lg">
                            {{
                                subscription.billing_cycle === 'monthly'
                                    ? subscription.plan?.monthly_price?.toLocaleString()
                                    : subscription.plan?.yearly_price?.toLocaleString()
                            }}₮
                            <span class="text-sm font-normal text-gray-500">
                                / {{ subscription.billing_cycle === 'monthly' ? 'сар' : 'жил' }}
                            </span>
                        </span>
                    </div>
                </div>

                <template #footer>
                    <div class="flex gap-2">
                        <UButton label="Багц өөрчлөх" color="primary" to="/pricing" />
                        <UButton
                            v-if="isActive && subscription.plan?.slug !== 'free'"
                            label="Цуцлах"
                            color="error"
                            variant="outline"
                            @click="showCancelModal = true"
                        />
                    </div>
                </template>
            </UPageCard>

            <!-- Usage Statistics -->
            <UPageCard
                title="Хэрэглээ"
                description="Таны одоогийн хэрэглээний статистик"
                variant="subtle"
            >
                <div class="space-y-4">
                    <div v-for="item in usageItems" :key="item.label" class="flex flex-col gap-2">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <UIcon :name="item.icon" class="w-4 h-4 text-gray-500" />
                                <span class="text-sm font-medium">{{ item.label }}</span>
                            </div>
                            <span class="text-sm text-gray-600 dark:text-gray-400">
                                <template v-if="item.isStorage">
                                    {{ formatStorage(item.current) }} /
                                    {{ formatStorage(item.max) }}
                                </template>
                                <template v-else>
                                    {{ item.current.toLocaleString() }} /
                                    {{ formatLimit(item.max) }}
                                </template>
                            </span>
                        </div>
                        <UProgress
                            v-model="usagePercent"
                            :color="
                                usagePercent >= 90
                                    ? 'error'
                                    : usagePercent >= 70
                                      ? 'warning'
                                      : 'primary'
                            "
                            size="sm"
                        />
                    </div>
                </div>
            </UPageCard>

            <!-- Features -->
            <UPageCard title="Боломжууд" description="Таны багцад орсон боломжууд" variant="subtle">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                        v-for="item in featureItems"
                        :key="item.label"
                        class="flex items-center gap-2"
                    >
                        <UIcon
                            :name="item.enabled ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
                            :class="item.enabled ? 'text-success-500' : 'text-gray-400'"
                            class="w-5 h-5"
                        />
                        <span :class="item.enabled ? '' : 'text-gray-400'">
                            {{ item.label }}
                        </span>
                    </div>
                </div>
            </UPageCard>

            <!-- Cancel Subscription Modal -->
            <UModal v-model:open="showCancelModal">
                <template #content>
                    <UCard>
                        <template #header>
                            <div class="flex items-center gap-3">
                                <div class="p-2 rounded-full bg-error-100 dark:bg-error-900">
                                    <UIcon
                                        name="i-lucide-alert-triangle"
                                        class="w-6 h-6 text-error-600"
                                    />
                                </div>
                                <div>
                                    <h3 class="text-lg font-semibold">Захиалга цуцлах</h3>
                                    <p class="text-sm text-gray-500">
                                        Энэ үйлдлийг буцаах боломжгүй
                                    </p>
                                </div>
                            </div>
                        </template>

                        <p class="text-gray-600 dark:text-gray-400">
                            Та захиалгаа цуцлахдаа итгэлтэй байна уу? Таны одоогийн хугацааны
                            төгсгөл хүртэл үйлчилгээг ашиглах боломжтой хэвээр байна.
                        </p>

                        <template #footer>
                            <div class="flex justify-end gap-2">
                                <UButton
                                    label="Болих"
                                    color="neutral"
                                    variant="outline"
                                    @click="showCancelModal = false"
                                />
                                <UButton
                                    label="Цуцлах"
                                    color="error"
                                    :loading="canceling"
                                    @click="handleCancel"
                                />
                            </div>
                        </template>
                    </UCard>
                </template>
            </UModal>
        </template>

        <!-- No Subscription -->
        <template v-else>
            <UPageCard
                title="Захиалга байхгүй"
                description="Та одоогоор ямар нэгэн багц захиалаагүй байна."
                variant="subtle"
            >
                <div class="flex flex-col items-center justify-center py-8 gap-4">
                    <UIcon name="i-lucide-credit-card" class="w-16 h-16 text-gray-300" />
                    <p class="text-gray-500 text-center">
                        Бүх боломжуудыг ашиглахын тулд багц сонгоно уу.
                    </p>
                    <UButton label="Багц сонгох" color="primary" to="/pricing" />
                </div>
            </UPageCard>
        </template>
    </div>
</template>
