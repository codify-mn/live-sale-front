<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Product, ProductVariant } from '~/composables/useProducts'
import type { CartItem, PaymentMethod } from '~/composables/useOrders'

useSeoMeta({
  title: 'Захиалга нэмэх - Comment Boost'
})

const { createOrder, formatPrice } = useOrders()
const toast = useToast()
const router = useRouter()

const loading = ref(false)

// Cart state
const cartItems = ref<CartItem[]>([])
const shippingFee = ref(0)
const discount = ref(0)

// Product selection modal
const variantModalOpen = ref(false)
const selectedProduct = ref<Product | null>(null)

// Form schema
const schema = z.object({
  customer_name: z.string().min(1, 'Нэр оруулна уу'),
  customer_phone: z.string().min(8, 'Утасны дугаар оруулна уу'),
  customer_phone_secondary: z.string().optional(),
  customer_email: z.string().email('Имэйл хаяг буруу байна').optional().or(z.literal('')),
  customer_address: z.string().optional(),
  customer_city: z.string().optional(),
  customer_district: z.string().optional(),
  payment_method: z.string().default('cash')
})

type Schema = z.infer<typeof schema>

const state = reactive<Schema>({
  customer_name: '',
  customer_phone: '',
  customer_phone_secondary: '',
  customer_email: '',
  customer_address: '',
  customer_city: '',
  customer_district: '',
  payment_method: 'cash'
})

const paymentMethodOptions = [
  { label: 'Бэлнээр', value: 'cash', icon: 'i-lucide-banknote' },
  { label: 'QPay', value: 'qpay', icon: 'i-lucide-qr-code' },
  { label: 'Банк шилжүүлэг', value: 'bank_transfer', icon: 'i-lucide-building-2' },
  { label: 'Карт', value: 'card', icon: 'i-lucide-credit-card' }
]

// Handle product selection from grid
const handleProductSelect = (product: Product) => {
  selectedProduct.value = product
  variantModalOpen.value = true
}

// Handle variant selection from modal
const handleVariantSelect = (items: { variant: ProductVariant, quantity: number }[]) => {
  if (!selectedProduct.value) return

  for (const item of items) {
    // Check if variant already in cart
    const existingIndex = cartItems.value.findIndex(
      ci => ci.product.id === selectedProduct.value!.id && ci.variant.id === item.variant.id
    )

    if (existingIndex >= 0) {
      // Update quantity
      const existingItem = cartItems.value[existingIndex]
      if (existingItem) {
        existingItem.quantity += item.quantity
      }
    } else {
      // Add new item
      cartItems.value.push({
        product: selectedProduct.value,
        variant: item.variant,
        quantity: item.quantity
      })
    }
  }

  selectedProduct.value = null
}

// Remove item from cart
const removeCartItem = (index: number) => {
  cartItems.value.splice(index, 1)
}

// Update cart item quantity
const updateCartItemQuantity = (index: number, quantity: number) => {
  if (cartItems.value[index]) {
    cartItems.value[index].quantity = quantity
  }
}

// Calculate totals
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    const price = item.variant.sale_price || item.variant.price
    return sum + (price * item.quantity)
  }, 0)
})

const total = computed(() => {
  return subtotal.value - discount.value + shippingFee.value
})

const canSubmit = computed(() => {
  return cartItems.value.length > 0 && state.customer_name && state.customer_phone
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (cartItems.value.length === 0) {
    toast.add({
      title: 'Алдаа',
      description: 'Бараа сонгоно уу',
      color: 'error'
    })
    return
  }

  loading.value = true

  try {
    const orderData = {
      // Customer info (flat structure as expected by backend)
      customer_name: event.data.customer_name,
      customer_phone: event.data.customer_phone,
      customer_address: event.data.customer_address || undefined,
      customer_city: event.data.customer_city || undefined,
      // Order items
      items: cartItems.value.map(item => ({
        product_id: item.product.id,
        variant_id: item.variant.id,
        sku: item.variant.sku || item.variant.keyword || '',
        name: item.product.name,
        options: item.variant.name,
        price: item.variant.sale_price || item.variant.price,
        quantity: item.quantity
      })),
      shipping_fee: shippingFee.value,
      discount: discount.value,
      payment_method: event.data.payment_method as PaymentMethod,
      metadata: {
        source: 'manual'
      }
    }

    const order = await createOrder(orderData)

    toast.add({
      title: 'Амжилттай',
      description: 'Захиалга үүсгэгдлээ',
      color: 'success'
    })

    router.push(`/dashboard/orders/${order.id}`)
  } catch (err: any) {
    toast.add({
      title: 'Алдаа',
      description: err.data?.message || 'Захиалга үүсгэхэд алдаа гарлаа',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <UDashboardPanel id="new-order">
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
              Захиалга нэмэх
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Шинэ захиалга үүсгэх
            </p>
          </div>
        </template>

        <template #right>
          <UButton
            type="submit"
            form="order-form"
            color="primary"
            icon="i-lucide-check"
            :loading="loading"
            :disabled="!canSubmit"
          >
            Захиалга үүсгэх
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-6 overflow-y-auto">
        <UForm
          id="order-form"
          :schema="schema"
          :state="state"
          @submit="onSubmit"
        >
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left Column - Product Selection -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Product Search Grid -->
              <OrderProductGrid @select="handleProductSelect" />

              <!-- Customer Info -->
              <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
                  Худалдан авагчийн мэдээлэл
                </h3>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <UFormField
                    label="Нэр"
                    name="customer_name"
                    required
                  >
                    <UInput
                      v-model="state.customer_name"
                      placeholder="Худалдан авагчийн нэр"
                      size="lg"
                    />
                  </UFormField>

                  <UFormField
                    label="Утас"
                    name="customer_phone"
                    required
                  >
                    <UInput
                      v-model="state.customer_phone"
                      placeholder="99001122"
                      size="lg"
                    />
                  </UFormField>

                  <UFormField
                    label="Нөөц утас"
                    name="customer_phone_secondary"
                  >
                    <UInput
                      v-model="state.customer_phone_secondary"
                      placeholder="88001122"
                      size="lg"
                    />
                  </UFormField>

                  <UFormField
                    label="Имэйл"
                    name="customer_email"
                  >
                    <UInput
                      v-model="state.customer_email"
                      type="email"
                      placeholder="email@example.com"
                      size="lg"
                    />
                  </UFormField>

                  <UFormField
                    label="Хот/Аймаг"
                    name="customer_city"
                  >
                    <UInput
                      v-model="state.customer_city"
                      placeholder="Улаанбаатар"
                      size="lg"
                    />
                  </UFormField>

                  <UFormField
                    label="Дүүрэг/Сум"
                    name="customer_district"
                  >
                    <UInput
                      v-model="state.customer_district"
                      placeholder="Баянзүрх"
                      size="lg"
                    />
                  </UFormField>

                  <div class="sm:col-span-2">
                    <UFormField
                      label="Хаяг"
                      name="customer_address"
                    >
                      <UTextarea
                        v-model="state.customer_address"
                        placeholder="Дэлгэрэнгүй хаяг"
                        :rows="2"
                      />
                    </UFormField>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column - Cart & Payment -->
            <div class="space-y-6">
              <!-- Cart -->
              <OrderCartCard
                :items="cartItems"
                :shipping-fee="shippingFee"
                :discount="discount"
                @remove="removeCartItem"
                @update-quantity="updateCartItemQuantity"
              />

              <!-- Shipping & Discount -->
              <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
                  Нэмэлт
                </h3>

                <div class="space-y-4">
                  <div>
                    <label class="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                      Хүргэлтийн төлбөр
                    </label>
                    <UInput
                      v-model.number="shippingFee"
                      type="number"
                      min="0"
                      placeholder="0"
                    >
                      <template #trailing>
                        <span class="text-gray-500 text-sm">₮</span>
                      </template>
                    </UInput>
                  </div>

                  <div>
                    <label class="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                      Хөнгөлөлт
                    </label>
                    <UInput
                      v-model.number="discount"
                      type="number"
                      min="0"
                      placeholder="0"
                    >
                      <template #trailing>
                        <span class="text-gray-500 text-sm">₮</span>
                      </template>
                    </UInput>
                  </div>
                </div>
              </div>

              <!-- Payment Method -->
              <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
                  Төлбөрийн арга
                </h3>

                <URadioGroup
                  v-model="state.payment_method"
                  :items="paymentMethodOptions"
                  orientation="vertical"
                  :ui="{
                    fieldset: 'space-y-2'
                  }"
                >
                  <template #label="{ item }">
                    <div class="flex items-center gap-2">
                      <UIcon
                        :name="item.icon"
                        class="w-4 h-4 text-gray-500"
                      />
                      <span>{{ item.label }}</span>
                    </div>
                  </template>
                </URadioGroup>
              </div>

              <!-- Submit Button (Mobile) -->
              <div class="lg:hidden">
                <UButton
                  type="submit"
                  form="order-form"
                  color="primary"
                  icon="i-lucide-check"
                  :loading="loading"
                  :disabled="!canSubmit"
                  block
                  size="lg"
                >
                  Захиалга үүсгэх - {{ formatPrice(total) }}
                </UButton>
              </div>
            </div>
          </div>
        </UForm>
      </div>

      <!-- Variant Selection Modal -->
      <OrderVariantModal
        v-model:open="variantModalOpen"
        :product="selectedProduct"
        @select="handleVariantSelect"
      />
    </template>
    </UDashboardPanel>
  </div>
</template>
