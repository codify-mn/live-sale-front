import { createSharedComposable } from '@vueuse/core'
import type {
    Plan,
    Subscription,
    SubscriptionUsage,
    SubscriptionLimits,
    BillingCycle
} from '~/types/subscription'
import type {
    SubscriptionInvoice,
    InvoiceListResponse,
    PurchaseResponse,
    PaymentCheckResponse
} from '~/types/billing'

interface PlansResponse {
    plans: Plan[]
}

interface SubscriptionResponse {
    subscription: Subscription | null
}

interface UsageResponse {
    usage: SubscriptionUsage
}

interface TrialResponse {
    subscription: Subscription
    message: string
}

interface FeatureResponse {
    feature: string
    enabled: boolean
}

const _useSubscription = () => {
    const config = useRuntimeConfig()
    const apiUrl = config.public.apiUrl

    const subscription = ref<Subscription | null>(null)
    const usage = ref<SubscriptionUsage | null>(null)
    const limits = ref<SubscriptionLimits | null>(null)
    const plans = ref<Plan[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Invoice / billing state
    const invoices = ref<SubscriptionInvoice[]>([])
    const currentInvoice = ref<SubscriptionInvoice | null>(null)
    const invoicesTotal = ref(0)
    const purchaseLoading = ref(false)
    const checkingPayment = ref(false)

    const fetchPlans = async () => {
        loading.value = true
        error.value = null
        try {
            const data = await $fetch<PlansResponse>(`${apiUrl}/plans`)
            plans.value = data.plans
        } catch (e: any) {
            error.value = e.data?.error || 'Failed to fetch plans'
            throw e
        } finally {
            loading.value = false
        }
    }

    const fetchSubscription = async () => {
        loading.value = true
        error.value = null
        try {
            const data = await $fetch<SubscriptionResponse>(`${apiUrl}/api/subscription`, {
                credentials: 'include'
            })
            subscription.value = data.subscription
        } catch (e: any) {
            error.value = e.data?.error || 'Failed to fetch subscription'
            subscription.value = null
        } finally {
            loading.value = false
        }
    }

    const fetchUsage = async () => {
        loading.value = true
        error.value = null
        try {
            const data = await $fetch<UsageResponse>(`${apiUrl}/api/subscription/usage`, {
                credentials: 'include'
            })
            usage.value = data.usage
        } catch (e: any) {
            error.value = e.data?.error || 'Failed to fetch usage'
        } finally {
            loading.value = false
        }
    }

    const fetchLimits = async () => {
        loading.value = true
        error.value = null
        try {
            const data = await $fetch<SubscriptionLimits>(`${apiUrl}/api/subscription/limits`, {
                credentials: 'include'
            })
            limits.value = data
        } catch (e: any) {
            error.value = e.data?.error || 'Failed to fetch limits'
        } finally {
            loading.value = false
        }
    }

    const startTrial = async (planSlug: string) => {
        loading.value = true
        error.value = null
        try {
            const data = await $fetch<TrialResponse>(`${apiUrl}/api/subscription/trial`, {
                method: 'POST',
                credentials: 'include',
                body: { plan_slug: planSlug }
            })
            subscription.value = data.subscription
            return data
        } catch (e: any) {
            error.value = e.data?.error || 'Failed to start trial'
            throw e
        } finally {
            loading.value = false
        }
    }

    const cancelSubscription = async () => {
        loading.value = true
        error.value = null
        try {
            await $fetch(`${apiUrl}/api/subscription/cancel`, {
                method: 'POST',
                credentials: 'include'
            })
            await fetchSubscription()
        } catch (e: any) {
            error.value = e.data?.error || 'Failed to cancel subscription'
            throw e
        } finally {
            loading.value = false
        }
    }

    const changePlan = async (planSlug: string) => {
        loading.value = true
        error.value = null
        try {
            const data = await $fetch<SubscriptionResponse>(`${apiUrl}/api/subscription/plan`, {
                method: 'PUT',
                credentials: 'include',
                body: { plan_slug: planSlug }
            })
            subscription.value = data.subscription
            return data
        } catch (e: any) {
            error.value = e.data?.error || 'Failed to change plan'
            throw e
        } finally {
            loading.value = false
        }
    }

    const checkFeature = async (feature: string): Promise<boolean> => {
        try {
            const data = await $fetch<FeatureResponse>(
                `${apiUrl}/api/subscription/feature/${feature}`,
                {
                    credentials: 'include'
                }
            )
            return data.enabled
        } catch {
            return false
        }
    }

    // Computed properties
    const daysRemaining = computed(() => {
        if (!subscription.value) return 0
        const end = new Date(subscription.value.current_period_end)
        return Math.max(0, Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    })

    const isTrialing = computed(() => subscription.value?.status === 'trialing')
    const isActive = computed(() =>
        ['trialing', 'active'].includes(subscription.value?.status || '')
    )
    const isCanceled = computed(() => subscription.value?.status === 'canceled')
    const isExpired = computed(() => subscription.value?.status === 'expired')

    const currentPlan = computed(() => subscription.value?.plan || null)

    const hasSubscription = computed(() => !!subscription.value)

    // Usage percentage helpers
    const productUsagePercent = computed(() => {
        if (!usage.value || !subscription.value?.plan) return 0
        const max = subscription.value.plan.limits.max_products
        if (max === -1) return 0 // Unlimited
        return Math.min(100, (usage.value.product_count / max) * 100)
    })

    const orderUsagePercent = computed(() => {
        if (!usage.value || !subscription.value?.plan) return 0
        const max = subscription.value.plan.limits.max_orders_per_month
        if (max === -1) return 0 // Unlimited
        return Math.min(100, (usage.value.order_count_month / max) * 100)
    })

    const storageUsagePercent = computed(() => {
        if (!usage.value || !subscription.value?.plan) return 0
        const max = subscription.value.plan.limits.max_storage_mb
        if (max === -1) return 0 // Unlimited
        return Math.min(100, (usage.value.storage_used_mb / max) * 100)
    })

    const shopUsagePercent = computed(() => {
        if (!usage.value || !subscription.value?.plan) return 0
        const max = subscription.value.plan.limits.max_shops
        if (max === -1) return 0 // Unlimited
        return Math.min(100, (usage.value.shop_count / max) * 100)
    })

    // Helper to format limits
    const formatLimit = (value: number): string => {
        if (value === -1) return 'Хязгааргүй'
        return value.toLocaleString()
    }

    // Helper to format storage
    const formatStorage = (mb: number): string => {
        if (mb === -1) return 'Хязгааргүй'
        if (mb >= 1000) return `${(mb / 1000).toFixed(1)} GB`
        return `${mb} MB`
    }

    // ========== INVOICE / BILLING METHODS ==========

    const purchasePlan = async (planSlug: string, billingCycle: BillingCycle) => {
        purchaseLoading.value = true
        error.value = null
        try {
            const data = await $fetch<PurchaseResponse>(`${apiUrl}/api/subscription/purchase`, {
                method: 'POST',
                credentials: 'include',
                body: {
                    plan_slug: planSlug,
                    billing_cycle: billingCycle
                }
            })
            currentInvoice.value = data.invoice
            return data
        } catch (e: any) {
            error.value = e.data?.error || 'Failed to create invoice'
            throw e
        } finally {
            purchaseLoading.value = false
        }
    }

    const fetchInvoices = async (page = 1, limit = 20) => {
        loading.value = true
        error.value = null
        try {
            const data = await $fetch<InvoiceListResponse>(`${apiUrl}/api/subscription/invoices`, {
                credentials: 'include',
                params: { page, limit }
            })
            invoices.value = data.invoices
            invoicesTotal.value = data.total
            return data
        } catch (e: any) {
            error.value = e.data?.error || 'Failed to fetch invoices'
            throw e
        } finally {
            loading.value = false
        }
    }

    const checkInvoicePayment = async (invoiceId: number) => {
        checkingPayment.value = true
        error.value = null
        try {
            const data = await $fetch<PaymentCheckResponse>(
                `${apiUrl}/api/subscription/invoices/${invoiceId}/check`,
                {
                    method: 'POST',
                    credentials: 'include'
                }
            )
            currentInvoice.value = data.invoice

            if (data.is_paid) {
                // Refresh subscription data
                await fetchSubscription()
            }

            return data
        } catch (e: any) {
            error.value = e.data?.error || 'Failed to check payment'
            throw e
        } finally {
            checkingPayment.value = false
        }
    }

    const getInvoice = async (invoiceId: number) => {
        try {
            const data = await $fetch<{ invoice: SubscriptionInvoice }>(
                `${apiUrl}/api/subscription/invoices/${invoiceId}`,
                { credentials: 'include' }
            )
            currentInvoice.value = data.invoice
            return data.invoice
        } catch (e: any) {
            error.value = e.data?.error || 'Failed to fetch invoice'
            throw e
        }
    }

    // Initialize data
    const init = async () => {
        await Promise.all([fetchSubscription(), fetchUsage()])
    }

    return {
        // State
        subscription,
        usage,
        limits,
        plans,
        loading,
        error,

        // Invoice state
        invoices,
        currentInvoice,
        invoicesTotal,
        purchaseLoading,
        checkingPayment,

        // Computed
        daysRemaining,
        isTrialing,
        isActive,
        isCanceled,
        isExpired,
        currentPlan,
        hasSubscription,
        productUsagePercent,
        orderUsagePercent,
        storageUsagePercent,
        shopUsagePercent,

        // Methods
        fetchPlans,
        fetchSubscription,
        fetchUsage,
        fetchLimits,
        startTrial,
        cancelSubscription,
        changePlan,
        checkFeature,
        formatLimit,
        formatStorage,
        init,

        // Invoice methods
        purchasePlan,
        fetchInvoices,
        checkInvoicePayment,
        getInvoice
    }
}

export const useSubscription = createSharedComposable(_useSubscription)
