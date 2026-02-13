import type { Plan, BillingCycle } from './subscription'

export type InvoiceStatus = 'pending' | 'paid' | 'failed' | 'expired'

export interface QPayDeepLink {
    name: string
    description?: string
    logo: string
    link: string
}

export interface QPayInvoiceData {
    invoice_url: string
    qr_image: string
    qr_text: string
    deep_links?: QPayDeepLink[]
}

export interface SubscriptionInvoice {
    id: number
    user_id: number
    subscription_id?: number
    plan_id: number
    amount: number
    billing_cycle: BillingCycle
    status: InvoiceStatus
    period_start: string
    period_end: string
    qpay_invoice_id?: string
    qpay_data?: QPayInvoiceData
    paid_at?: string
    created_at: string
    updated_at: string
    plan?: Plan
}

export interface InvoiceListResponse {
    invoices: SubscriptionInvoice[]
    total: number
    page: number
    limit: number
}

export interface PurchaseResponse {
    message: string
    invoice_id: number
    invoice: SubscriptionInvoice
}

export interface PaymentCheckResponse {
    is_paid: boolean
    paid_amount: number
    payment_count: number
    invoice: SubscriptionInvoice
}
