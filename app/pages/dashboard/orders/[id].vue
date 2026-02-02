<script setup lang="ts">
import type { Order, OrderStatus } from '~/composables/useOrders'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const {
    fetchOrder,
    updateOrderStatus,
    cancelOrder,
    getStatusLabel,
    getStatusColor,
    getPaymentMethodLabel,
    formatPrice
} = useOrders()

const orderId = computed(() => Number(route.params.id))

const loading = ref(true)
const order = ref<Order | null>(null)

useSeoMeta({
    title: () =>
        order.value
            ? `Захиалга #${order.value.order_number} - Comment Boost`
            : 'Захиалга - Comment Boost'
})

const loadOrder = async () => {
    loading.value = true
    try {
        order.value = await fetchOrder(orderId.value)
    } catch (err: any) {
        toast.add({
            title: 'Алдаа',
            description: 'Захиалга олдсонгүй',
            color: 'error'
        })
        console.error('Failed to load order', err)
        router.push('/dashboard/orders')
    } finally {
        loading.value = false
    }
}

const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('mn-MN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Status update
const statusUpdating = ref(false)

const statusOptions = [
    { label: 'Хүлээгдэж буй', value: 'pending' },
    { label: 'Төлөгдсөн', value: 'paid' },
    { label: 'Илгээгдсэн', value: 'shipped' },
    { label: 'Хүргэгдсэн', value: 'delivered' }
]

const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order.value || order.value.status === newStatus) return

    statusUpdating.value = true
    try {
        await updateOrderStatus(order.value.id, newStatus)
        toast.add({
            title: 'Амжилттай',
            description: `Төлөв ${getStatusLabel(newStatus)} болгож өөрчлөгдлөө`,
            color: 'success'
        })
        await loadOrder()
    } catch (err: any) {
        toast.add({
            title: 'Алдаа',
            description: err.data?.message || 'Төлөв өөрчлөхөд алдаа гарлаа',
            color: 'error'
        })
    } finally {
        statusUpdating.value = false
    }
}

// Cancel modal
const cancelModalOpen = ref(false)
const cancelling = ref(false)

const confirmCancel = async () => {
    if (!order.value) return

    cancelling.value = true
    try {
        await cancelOrder(order.value.id)
        toast.add({
            title: 'Амжилттай',
            description: 'Захиалга цуцлагдлаа',
            color: 'success'
        })
        cancelModalOpen.value = false
        await loadOrder()
    } catch (err: any) {
        toast.add({
            title: 'Алдаа',
            description: err.data?.message || 'Цуцлахад алдаа гарлаа',
            color: 'error'
        })
    } finally {
        cancelling.value = false
    }
}

const canCancel = computed(() => {
    if (!order.value) return false
    return !['cancelled', 'refunded'].includes(order.value.status)
})

onMounted(async () => {
    await loadOrder()
})
</script>

<template>
    <div clas="w-full h-full overflow-y-auto">
        <UDashboardPanel id="order-detail">
            <template #header>
                <UDashboardNavbar>
                    <template #leading>
                        <UButton
                            to="/dashboard/orders"
                            icon="i-lucide-arrow-left"
                            color="neutral"
                            variant="ghost"
                        />
                    </template>

                    <template #title>
                        <div>
                            <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
                                Захиалга #{{ order?.order_number || '...' }}
                            </h1>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                Захиалгын дэлгэрэнгүй мэдээлэл
                            </p>
                        </div>
                    </template>

                    <template #right>
                        <div class="flex items-center gap-2">
                            <UButton
                                v-if="canCancel"
                                icon="i-lucide-x-circle"
                                color="error"
                                variant="ghost"
                                @click="cancelModalOpen = true"
                            >
                                Цуцлах
                            </UButton>
                        </div>
                    </template>
                </UDashboardNavbar>
            </template>

            <template #body>
                <div v-if="loading" class="flex items-center justify-center p-20">
                    <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary" />
                </div>

                <div v-else-if="order" class="p-6 overflow-y-auto">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <!-- Left Column - Order Details -->
                        <div class="lg:col-span-2 space-y-6">
                            <!-- Order Info Card -->
                            <div
                                class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5"
                            >
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                                        Захиалгын мэдээлэл
                                    </h3>
                                    <UBadge
                                        :color="getStatusColor(order.status)"
                                        variant="subtle"
                                        class="font-medium"
                                    >
                                        {{ getStatusLabel(order.status) }}
                                    </UBadge>
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Захиалгын дугаар
                                        </p>
                                        <p class="font-medium text-gray-900 dark:text-white">
                                            #{{ order.order_number }}
                                        </p>
                                    </div>
                                    <div>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Огноо
                                        </p>
                                        <p class="font-medium text-gray-900 dark:text-white">
                                            {{ formatDate(order.created_at) }}
                                        </p>
                                    </div>
                                    <div>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Төлбөрийн арга
                                        </p>
                                        <p class="font-medium text-gray-900 dark:text-white">
                                            {{ getPaymentMethodLabel(order.payment_method) }}
                                        </p>
                                    </div>
                                    <div v-if="order.metadata?.source">
                                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Эх сурвалж
                                        </p>
                                        <p class="font-medium text-gray-900 dark:text-white">
                                            {{ order.metadata.source }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Order Items Card -->
                            <div
                                class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5"
                            >
                                <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
                                    Захиалсан бараа
                                </h3>

                                <div class="divide-y divide-gray-100 dark:divide-gray-800">
                                    <div
                                        v-for="item in order.items"
                                        :key="item.id"
                                        class="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                                    >
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                                            >
                                                <UIcon
                                                    name="i-lucide-package"
                                                    class="w-6 h-6 text-gray-400"
                                                />
                                            </div>
                                            <div>
                                                <p
                                                    class="font-medium text-gray-900 dark:text-white"
                                                >
                                                    {{ item.name }}
                                                </p>
                                                <p
                                                    v-if="item.options"
                                                    class="text-sm text-gray-500 dark:text-gray-400"
                                                >
                                                    {{ item.options }}
                                                </p>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                                    {{ formatPrice(item.price) }} x
                                                    {{ item.quantity }}
                                                </p>
                                            </div>
                                        </div>
                                        <div class="text-right">
                                            <p class="font-medium text-gray-900 dark:text-white">
                                                {{ formatPrice(item.subtotal) }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Price Summary -->
                                <div
                                    class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2"
                                >
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-500 dark:text-gray-400">Дүн</span>
                                        <span class="text-gray-900 dark:text-white">{{
                                            formatPrice(order.subtotal)
                                        }}</span>
                                    </div>
                                    <div
                                        v-if="order.discount > 0"
                                        class="flex justify-between text-sm"
                                    >
                                        <span class="text-gray-500 dark:text-gray-400"
                                            >Хөнгөлөлт</span
                                        >
                                        <span class="text-green-600"
                                            >-{{ formatPrice(order.discount) }}</span
                                        >
                                    </div>
                                    <div
                                        v-if="order.shipping_fee > 0"
                                        class="flex justify-between text-sm"
                                    >
                                        <span class="text-gray-500 dark:text-gray-400"
                                            >Хүргэлт</span
                                        >
                                        <span class="text-gray-900 dark:text-white">{{
                                            formatPrice(order.shipping_fee)
                                        }}</span>
                                    </div>
                                    <div
                                        class="flex justify-between text-base font-semibold pt-2 border-t border-gray-200 dark:border-gray-700"
                                    >
                                        <span class="text-gray-900 dark:text-white">Нийт дүн</span>
                                        <span class="text-primary-600 dark:text-primary-400">{{
                                            formatPrice(order.total_amount)
                                        }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column - Sidebar -->
                        <div class="space-y-6">
                            <!-- Status Update Card -->
                            <div
                                class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5"
                            >
                                <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
                                    Төлөв өөрчлөх
                                </h3>
                                <USelect
                                    :model-value="order.status"
                                    :items="statusOptions"
                                    :loading="statusUpdating"
                                    :disabled="order.status === 'cancelled'"
                                    size="lg"
                                    @update:model-value="handleStatusChange($event as OrderStatus)"
                                />
                            </div>

                            <!-- Customer Info Card -->
                            <div
                                class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5"
                            >
                                <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
                                    Худалдан авагч
                                </h3>

                                <div class="space-y-3">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center"
                                        >
                                            <UIcon
                                                name="i-lucide-user"
                                                class="w-5 h-5 text-primary-600 dark:text-primary-400"
                                            />
                                        </div>
                                        <div>
                                            <p class="font-medium text-gray-900 dark:text-white">
                                                {{ order.customer?.name || '-' }}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        v-if="order.customer?.phone_number"
                                        class="flex items-center gap-3"
                                    >
                                        <div
                                            class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                                        >
                                            <UIcon
                                                name="i-lucide-phone"
                                                class="w-5 h-5 text-gray-500"
                                            />
                                        </div>
                                        <div>
                                            <p class="text-sm text-gray-900 dark:text-white">
                                                {{ order.customer.phone_number }}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        v-if="order.customer?.email"
                                        class="flex items-center gap-3"
                                    >
                                        <div
                                            class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                                        >
                                            <UIcon
                                                name="i-lucide-mail"
                                                class="w-5 h-5 text-gray-500"
                                            />
                                        </div>
                                        <div>
                                            <p class="text-sm text-gray-900 dark:text-white">
                                                {{ order.customer.email }}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        v-if="order.customer?.address"
                                        class="flex items-start gap-3"
                                    >
                                        <div
                                            class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0"
                                        >
                                            <UIcon
                                                name="i-lucide-map-pin"
                                                class="w-5 h-5 text-gray-500"
                                            />
                                        </div>
                                        <div>
                                            <p class="text-sm text-gray-900 dark:text-white">
                                                {{ order.customer.address }}
                                            </p>
                                            <p
                                                v-if="
                                                    order.customer.city || order.customer.district
                                                "
                                                class="text-sm text-gray-500 dark:text-gray-400"
                                            >
                                                {{
                                                    [order.customer.city, order.customer.district]
                                                        .filter(Boolean)
                                                        .join(', ')
                                                }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Tracking Info Card -->
                            <div
                                v-if="order.metadata?.tracking_number"
                                class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5"
                            >
                                <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
                                    Хүргэлтийн мэдээлэл
                                </h3>
                                <div class="flex items-center gap-3">
                                    <UIcon name="i-lucide-truck" class="w-5 h-5 text-gray-500" />
                                    <span class="text-gray-900 dark:text-white">{{
                                        order.metadata.tracking_number
                                    }}</span>
                                </div>
                            </div>

                            <!-- Notes Card -->
                            <div
                                v-if="order.metadata?.seller_notes"
                                class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5"
                            >
                                <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
                                    Тэмдэглэл
                                </h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                    {{ order.metadata.seller_notes }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cancel Modal -->
                <UModal v-model:open="cancelModalOpen">
                    <template #content>
                        <UCard>
                            <template #header>
                                <div class="flex items-center gap-2">
                                    <UIcon name="i-lucide-alert-triangle" class="text-red-500" />
                                    <span class="font-semibold">Захиалга цуцлах</span>
                                </div>
                            </template>

                            <p>
                                <strong>#{{ order?.order_number }}</strong> захиалгыг цуцлахдаа
                                итгэлтэй байна уу?
                            </p>
                            <p class="text-sm text-gray-500 mt-2">Энэ үйлдлийг буцаах боломжгүй.</p>

                            <template #footer>
                                <div class="flex justify-end gap-2">
                                    <UButton
                                        color="neutral"
                                        variant="outline"
                                        @click="cancelModalOpen = false"
                                    >
                                        Болих
                                    </UButton>
                                    <UButton
                                        color="error"
                                        :loading="cancelling"
                                        @click="confirmCancel"
                                    >
                                        Цуцлах
                                    </UButton>
                                </div>
                            </template>
                        </UCard>
                    </template>
                </UModal>
            </template>
        </UDashboardPanel>
    </div>
</template>
