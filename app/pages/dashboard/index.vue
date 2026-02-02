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

  if (!shop.value?.settings?.payment_method) {
    actions.push({
      title: 'Дансны мэдээлэл нэмэх',
      description: 'Дансаа тохируулснаар захиалга авах боломжтой болно',
      icon: 'i-lucide-credit-card',
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

  if (!shop.value?.description) {
    actions.push({
      title: 'Дэлгүүрийн тайлбар',
      description: 'Дэлгүүрийнхээ тухай товч мэдээлэл оруулна уу',
      icon: 'i-lucide-info',
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
    <UDashboardPanel
      id="home"
      class="px-4 pb-6 overflow-y-auto"
    >
      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="p-6 space-y-6 max-w-6xl mx-auto"
      >
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
      <div
        v-else
        class="space-y-6 mt-4 max-w-6xl mx-auto"
      >
        <!-- Greeting -->
        <DashboardGreeting :name="userName" />

        <!-- Stats Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardStatCard
            label="Энэ сарын захиалга"
            :value="thisMonthOrders"
            :subtitle="`Нийт ${totalOrders} захиалга`"
            icon="i-lucide-shopping-cart"
            icon-color="primary"
          />
          <DashboardStatCard
            label="Нийт орлого"
            :value="`${totalRevenue.toLocaleString()}₮`"
            :subtitle="`Дундаж ${orderStats?.average_order_value?.toLocaleString() || 0}₮`"
            icon="i-lucide-banknote"
            icon-color="success"
          />
          <DashboardStatCard
            label="Нийт бараа"
            :value="totalProducts"
            :subtitle="`Идэвхтэй ${totalProducts}`"
            icon="i-lucide-package"
            icon-color="info"
          />
          <DashboardStatCard
            label="Нийт хэрэглэгч"
            :value="totalCustomers"
            subtitle="Энэ сар шинээр 0"
            icon="i-lucide-users"
            icon-color="warning"
          />
        </div>

        <!-- Shop & Plan Row -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div class="lg:col-span-3">
            <DashboardShopCard
              :shop-name="shop?.name || 'Миний дэлгүүр'"
              :shop-url="shopUrl"
              :logo-url="shop?.picture"
            />
          </div>
          <div class="lg:col-span-2">
            <DashboardPlanCard
              plan-name="Үнэгүй"
              :is-active="true"
              :days-remaining="55"
              upgrade-url="/pricing"
            />
          </div>
        </div>

        <!-- Required Actions -->
        <DashboardSection
          v-if="requiredActions.length > 0"
          title="Шаардлагатай үйлдлүүд"
          description="Дараах тохиргоог хийснээр таны дэлгүүр бүрэн ажиллах болно"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <DashboardActionCard
              v-for="action in requiredActions"
              :key="action.title"
              :title="action.title"
              :description="action.description"
              :icon="action.icon"
              :to="action.to"
            />
          </div>
        </DashboardSection>

        <!-- Recent Orders & Quick Actions Side by Side -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Recent Orders -->
          <DashboardRecentOrders />

          <!-- Quick Actions -->
          <DashboardCard padding="none">
            <div class="p-4 border-b border-gray-100 dark:border-gray-800/50">
              <h3 class="font-semibold text-gray-900 dark:text-white">
                Түргэн үйлдлүүд
              </h3>
            </div>
            <div class="p-3">
              <div class="grid grid-cols-2 gap-2">
                <DashboardQuickAction
                  title="Бараа нэмэх"
                  description="Шинэ бараа"
                  icon="i-lucide-plus"
                  to="/dashboard/products/new"
                  color="blue"
                />
                <DashboardQuickAction
                  title="Захиалгууд"
                  description="Захиалга харах"
                  icon="i-lucide-shopping-cart"
                  to="/dashboard/orders"
                  color="green"
                />
                <DashboardQuickAction
                  title="Бараанууд"
                  description="Жагсаалт"
                  icon="i-lucide-package"
                  to="/dashboard/products"
                  color="purple"
                />
                <DashboardQuickAction
                  title="Тохиргоо"
                  description="Дэлгүүрийн"
                  icon="i-lucide-settings"
                  to="/dashboard/settings"
                  color="gray"
                />
              </div>
            </div>
          </DashboardCard>
        </div>

        <!-- Revenue Chart (optional, can show below) -->
        <DashboardRevenueChart :total-revenue="totalRevenue" />
      </div>
    </UDashboardPanel>
  </div>
</template>
