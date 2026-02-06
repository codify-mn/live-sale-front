<script setup lang="ts">
const { shop, orderStats, productStats, isLoading, fetchAll } = useDashboardData()

const shopUrl = computed(() => {
    if (!shop.value) return ''
    return `https://${shop.value.id}-free.shop.mn`
})

// User name for greeting (use shop name or default)
const userName = computed(() => shop.value?.name?.split(' ')[0] || 'Хэрэглэгч')

// Stats computed
const thisMonthOrders = computed(() => orderStats.value?.pending_orders || 0)
const totalOrders = computed(() => orderStats.value?.total_orders || 0)
const totalRevenue = computed(() => orderStats.value?.total_revenue || 0)
const totalProducts = computed(() => productStats.value?.total || 0)
const totalCustomers = computed(() => 0) // TODO: Add customer stats endpoint



// Required actions
const requiredActions = computed(() => {
    const actions = []

    if (!shop.value?.qpay.is_registered) {
        actions.push({
            title: 'QPay-д бүртгүүлэх',
            description: 'QPay-д бүртгүүлж, шууд төлбөр хүлээн авах боломжтой болно.',
            icon: 'i-lucide-qr-code',
            to: '/dashboard/settings'
        })
    }

    if (!shop.value?.phone_number) {
        actions.push({
            title: 'Холбоо барих мэдээлэл',
            description: 'Утасны дугаараа оруулна уу',
            icon: 'i-lucide-phone',
            to: '/dashboard/settings'
        })
    }

    return actions
})

onMounted(() => {
    fetchAll()
})
</script>

<template>
    <div class="w-full h-full overflow-y-auto">
        <UDashboardPanel id="home" class="px-4 pb-6 overflow-y-auto">
            <!-- Loading State -->
            <div v-if="isLoading" class="p-6 space-y-6 max-w-6xl mx-auto">
                <div class="animate-pulse space-y-6">
                    <div class="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl w-1/3" />
                    <div class="grid grid-cols-4 gap-4">
                        <div
                            v-for="i in 4"
                            :key="i"
                            class="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"
                        />
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        <div class="lg:col-span-3 h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                        <div class="lg:col-span-2 h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div v-else class="space-y-6 mt-4 max-w-6xl mx-auto">
                <!-- Greeting -->
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <DashboardGreeting :name="userName" />
                    <DashboardTestActions />
                </div>

                <!-- Stats Row -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DashboardStatCard
                        label="Энэ сарын захиалга"
                        :value="thisMonthOrders"
                        :subtitle="`Нийт ${totalOrders} захиалга`"
                        icon="i-lucide-shopping-cart"
                        color="info"
                        to="/dashboard/orders"
                    />
                    <DashboardStatCard
                        label="Нийт орлого"
                        :value="`${totalRevenue.toLocaleString()}₮`"
                        :subtitle="`Дундаж ${orderStats?.average_order_value?.toLocaleString() || 0}₮`"
                        icon="i-lucide-banknote"
                        color="success"
                        to="/dashboard/orders"
                    />
                    <DashboardStatCard
                        label="Нийт бараа"
                        :value="totalProducts"
                        :subtitle="`Идэвхтэй ${totalProducts}`"
                        icon="i-lucide-package"
                        color="primary"
                        to="/dashboard/products"
                    />
                    <DashboardStatCard
                        label="Нийт хэрэглэгч"
                        :value="totalCustomers"
                        subtitle="Энэ сар шинээр 0"
                        icon="i-lucide-users"
                        color="warning"
                        to="/dashboard/orders"
                    />
                </div>

                <!-- Shop & Plan Row -->
                <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    <div class="lg:col-span-3">
                        <DashboardShopCard
                            :shop-name="shop?.name || 'Миний дэлгүүр'"
                            :shop-url="shopUrl"
                            :logo-url="shop?.picture"
                            :required-actions="requiredActions"
                        />
                    </div>
                    <div class="lg:col-span-2">
                        <DashboardPlanCard
                            upgrade-url="/pricing"
                        />
                    </div>
                </div>

                <!-- Recent Orders - Full Width -->
                <div class="grid grid-cols-1 gap-4">
                    <DashboardRecentOrders />
                </div>

                <!-- Revenue Chart (optional, can show below) -->
                <DashboardRevenueChart :total-revenue="totalRevenue" />
            </div>
        </UDashboardPanel>
    </div>
</template>
