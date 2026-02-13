<script setup lang="ts">
import type { SubscriptionInvoice } from '~/types/billing'

const {
    invoices,
    invoicesTotal,
    currentInvoice,
    loading,
    checkingPayment,
    fetchInvoices,
    checkInvoicePayment
} = useSubscription()
const toast = useToast()
const router = useRouter()

const showPaymentModal = ref(false)
const currentPage = ref(1)
const pageSize = 10

onMounted(async () => {
    await fetchInvoices(currentPage.value, pageSize)
})

const totalPages = computed(() => Math.ceil(invoicesTotal.value / pageSize))

async function handlePageChange(page: number) {
    currentPage.value = page
    await fetchInvoices(page, pageSize)
}

function handleViewInvoice(invoice: SubscriptionInvoice) {
    currentInvoice.value = invoice
    showPaymentModal.value = true
}

async function handleCheckPayment() {
    if (!currentInvoice.value) return

    try {
        const result = await checkInvoicePayment(currentInvoice.value.id)
        if (result.is_paid) {
            showPaymentModal.value = false
            toast.add({
                title: 'Амжилттай!',
                description: 'Төлбөр баталгаажлаа.',
                icon: 'i-lucide-check',
                color: 'success'
            })
            // Refresh the list
            await fetchInvoices(currentPage.value, pageSize)
        } else {
            toast.add({
                title: 'Төлбөр хүлээгдэж байна',
                description: 'Төлбөр хараахан ирээгүй байна.',
                icon: 'i-lucide-clock',
                color: 'warning'
            })
        }
    } catch {
        // Error handled in composable
    }
}
</script>

<template>
    <div class="w-full h-full overflow-y-auto">
        <UDashboardPanel id="history" :ui="{ body: 'lg:py-12' }">
            <template #header>
                <UDashboardNavbar title="Төлбөр">
                    <template #leading>
                        <UDashboardSidebarCollapse />
                    </template>
                </UDashboardNavbar>

                <UDashboardToolbar>
                    <UNavigationMenu
                        :items="[
                            [
                                {
                                    label: 'Төлбөр',
                                    icon: 'i-lucide-credit-card',
                                    to: '/dashboard/billing',
                                    exact: true
                                },
                                {
                                    label: 'Багц сонгох',
                                    icon: 'i-lucide-crown',
                                    to: '/dashboard/plans'
                                },
                                {
                                    label: 'Түүх',
                                    icon: 'i-lucide-history',
                                    to: '/dashboard/history'
                                }
                            ]
                        ]"
                        highlight
                        class="-mx-1 flex-1"
                    />
                </UDashboardToolbar>
            </template>

            <template #body>
                <div class="flex flex-col gap-4 w-full lg:max-w-4xl mx-auto">
                    <!-- Header -->
                    <div>
                        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
                            Төлбөрийн түүх
                        </h1>
                        <p class="text-sm text-gray-500">Таны нэхэмжлэх болон төлбөрийн бүртгэл</p>
                    </div>

                    <!-- History Table -->
                    <UPageCard variant="subtle">
                        <BillingHistoryTable
                            :invoices="invoices"
                            :loading="loading"
                            @view-invoice="handleViewInvoice"
                        />

                        <!-- Pagination -->
                        <template v-if="totalPages > 1" #footer>
                            <div class="flex justify-center">
                                <UPagination
                                    v-model="currentPage"
                                    :total="invoicesTotal"
                                    :items-per-page="pageSize"
                                    @update:model-value="handlePageChange"
                                />
                            </div>
                        </template>
                    </UPageCard>

                    <!-- Empty State -->
                    <BillingEmptyState
                        v-if="!loading && invoices.length === 0"
                        title="Түүх байхгүй"
                        description="Та одоогоор ямар нэгэн төлбөр хийгээгүй байна."
                        action-label="Багц худалдаж авах"
                        action-to="/dashboard/plans"
                    />

                    <!-- Payment Modal -->
                    <BillingPaymentModal
                        :open="showPaymentModal"
                        :invoice="currentInvoice"
                        :checking="checkingPayment"
                        @update:open="showPaymentModal = $event"
                        @check-payment="handleCheckPayment"
                    />
                </div>
            </template>
        </UDashboardPanel>
    </div>
</template>
