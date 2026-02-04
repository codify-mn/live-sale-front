<script setup lang="ts">
import type { SubscriptionInvoice } from '~/types/billing'

defineProps<{
  invoices: SubscriptionInvoice[]
  loading?: boolean
}>()

const emit = defineEmits<{
  'view-invoice': [invoice: SubscriptionInvoice]
}>()

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function formatAmount(amount: number) {
  return amount.toLocaleString() + '₮'
}

function getStatusColor(status: string) {
  switch (status) {
    case 'paid':
      return 'success'
    case 'pending':
      return 'warning'
    case 'failed':
    case 'expired':
      return 'error'
    default:
      return 'neutral'
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'paid':
      return 'Төлсөн'
    case 'pending':
      return 'Хүлээгдэж буй'
    case 'failed':
      return 'Амжилтгүй'
    case 'expired':
      return 'Хугацаа дууссан'
    default:
      return status
  }
}

function getBillingCycleLabel(cycle: string) {
  return cycle === 'yearly' ? 'Жилээр' : 'Сараар'
}
</script>

<template>
  <div>
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-gray-400" />
    </div>

    <div v-else-if="invoices.length === 0" class="text-center py-12">
      <UIcon name="i-lucide-receipt" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p class="text-gray-500">Төлбөрийн түүх байхгүй</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="text-left text-sm text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <th class="pb-3 font-medium">Огноо</th>
            <th class="pb-3 font-medium">Багц</th>
            <th class="pb-3 font-medium">Төлбөрийн мөчлөг</th>
            <th class="pb-3 font-medium text-right">Дүн</th>
            <th class="pb-3 font-medium text-center">Төлөв</th>
            <th class="pb-3 font-medium text-right">Үйлдэл</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr
            v-for="invoice in invoices"
            :key="invoice.id"
            class="text-sm hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
          >
            <td class="py-4 text-gray-700 dark:text-gray-300">
              {{ formatDate(invoice.created_at) }}
            </td>
            <td class="py-4">
              <span class="font-medium text-gray-900 dark:text-white">
                {{ invoice.plan?.name || 'Тодорхойгүй' }}
              </span>
            </td>
            <td class="py-4 text-gray-600 dark:text-gray-400">
              {{ getBillingCycleLabel(invoice.billing_cycle) }}
            </td>
            <td class="py-4 text-right font-medium text-gray-900 dark:text-white">
              {{ formatAmount(invoice.amount) }}
            </td>
            <td class="py-4 text-center">
              <UBadge :color="getStatusColor(invoice.status)" variant="subtle" size="sm">
                {{ getStatusLabel(invoice.status) }}
              </UBadge>
            </td>
            <td class="py-4 text-right">
              <UButton
                v-if="invoice.status === 'pending'"
                size="xs"
                variant="ghost"
                icon="i-lucide-credit-card"
                @click="emit('view-invoice', invoice)"
              >
                Төлөх
              </UButton>
              <UButton
                v-else
                size="xs"
                variant="ghost"
                icon="i-lucide-file-text"
                disabled
              >
                Баримт
              </UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
