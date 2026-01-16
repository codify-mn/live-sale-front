<script setup lang="ts">
const { shop, orderStats, productStats, isLoading, fetchAll } = useDashboardData()

const shopUrl = computed(() => {
  if (!shop.value) return ''
  return `https://${shop.value.id}-free.shop.mn`
})

// Stats computed
const thisMonthOrders = computed(() => orderStats.value?.pending_orders || 0)
const totalOrders = computed(() => orderStats.value?.total_orders || 0)
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
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UTooltip text="Мэдэгдэл">
            <UButton
              color="neutral"
              variant="ghost"
              square
            >
              <UChip color="error" inset>
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>

          <UDropdownMenu
            :items="[[
              { label: 'Шинэ бараа', icon: 'i-lucide-package-plus', to: '/dashboard/products/new' },
              { label: 'Шинэ захиалга', icon: 'i-lucide-shopping-cart', to: '/dashboard/orders/new' }
            ]]"
          >
            <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- Loading State -->
      <div v-if="isLoading" class="p-6 overflow-y-auto space-y-6">
        <div class="animate-pulse space-y-6">
          <div class="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div class="lg:col-span-3 h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            <div class="lg:col-span-2 h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          </div>
          <div class="grid grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i" class="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="p-6 space-y-6 overflow-y-auto mt-6">
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
            label="Нийт захиалга"
            :value="totalOrders"
            :subtitle="`Дундаж ${orderStats?.average_order_value?.toLocaleString() || 0}₮`"
            icon="i-lucide-receipt"
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

        <!-- Quick Actions -->
        <DashboardSection
          title="Түргэн үйлдлүүд"
          description="Түгээмэл хэрэглэгддэг үйлдлүүд"
        >
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <DashboardQuickAction
              title="Бараа нэмэх"
              description="Шинэ бараа нэмэх"
              icon="i-lucide-plus"
              to="/dashboard/products/new"
              color="blue"
            />
            <DashboardQuickAction
              title="Захиалгууд"
              description="Захиалга удирдах"
              icon="i-lucide-shopping-cart"
              to="/dashboard/orders"
              color="green"
            />
            <DashboardQuickAction
              title="Бараанууд"
              description="Барааны жагсаалт"
              icon="i-lucide-package"
              to="/dashboard/products"
              color="purple"
            />
            <DashboardQuickAction
              title="Хэрэглэгчид"
              description="Хэрэглэгчийн жагсаалт"
              icon="i-lucide-users"
              to="/dashboard/customers"
              color="orange"
            />
            <DashboardQuickAction
              title="Facebook"
              description="Facebook холболт"
              icon="i-simple-icons-facebook"
              to="/dashboard/settings/facebook"
              color="pink"
            />
            <DashboardQuickAction
              title="Тохиргоо"
              description="Дэлгүүрийн тохиргоо"
              icon="i-lucide-settings"
              to="/dashboard/settings"
              color="gray"
            />
          </div>
        </DashboardSection>
      </div>
    </template>
  </UDashboardPanel>
</template>
