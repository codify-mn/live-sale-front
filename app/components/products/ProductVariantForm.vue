<script setup lang="ts">
import { calculateDiscountPercent, calculateSalePrice } from '~/utils'

export interface VariantData {
  id?: number
  name: string
  sku: string           // Required for live selling
  barcode: string | null
  stock_quantity: number
  price: number | null    // Override base price
  sale_price: number | null // Discounted price
  low_stock_alert: number
  images: string[]
}

interface Props {
  modelValue: VariantData
  index: number
  productName?: string    // For SKU generation
  canRemove?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  productName: '',
  canRemove: true
})

const emit = defineEmits<{
  'update:modelValue': [value: VariantData]
  'remove': []
}>()

const { generateSKU, getSKUError } = useSKU()

// Local state for discount percent (UI-only, not persisted)
const discountPercent = ref<number | null>(null)

// Show/hide detailed info (barcode, low stock alert)
const showDetails = ref(false)

const updateField = <K extends keyof VariantData>(
  field: K,
  value: VariantData[K]
) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

// Generate SKU from product + variant name
const handleGenerateSKU = () => {
  const sku = generateSKU(props.productName || 'PRODUCT', props.modelValue.name)
  updateField('sku', sku)
}

// SKU validation
const skuError = computed(() => {
  if (!props.modelValue.sku) return undefined
  return getSKUError(props.modelValue.sku) || undefined
})

// Calculate discount percentage when sale price changes
watch(() => props.modelValue.sale_price, (newVal) => {
  if (newVal && props.modelValue.price && props.modelValue.price > 0) {
    discountPercent.value = calculateDiscountPercent(props.modelValue.price, newVal)
  } else {
    discountPercent.value = null
  }
})

// Calculate sale price when discount percent changes
watch(discountPercent, (newVal) => {
  if (newVal && props.modelValue.price && props.modelValue.price > 0) {
    const newSalePrice = calculateSalePrice(props.modelValue.price, newVal)
    if (newSalePrice > 0) {
      updateField('sale_price', newSalePrice)
    }
  }
})

// Initialize discount percent on mount
onMounted(() => {
  if (props.modelValue.sale_price && props.modelValue.price) {
    discountPercent.value = calculateDiscountPercent(props.modelValue.price, props.modelValue.sale_price)
  }
})
</script>

<template>
  <div
    class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
        Төрөл #{{ index + 1 }}
      </h4>
      <UButton
        v-if="canRemove"
        color="error"
        variant="ghost"
        size="xs"
        icon="i-lucide-trash-2"
        @click="emit('remove')"
      />
    </div>

    <div class="space-y-4">
      <!-- Variant Images -->
      <div>
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Барааны төрлийн зураг
        </p>
        <ProductImageUpload
          :model-value="modelValue.images || []"
          @update:model-value="updateField('images', $event)"
        />
      </div>

      <!-- Name & SKU (SKU is always visible for live selling) -->
      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Төрлийн нэр" required>
          <UInput
            :model-value="modelValue.name"
            placeholder="Улаан / XL"
            @update:model-value="updateField('name', $event)"
          />
        </UFormField>

        <UFormField label="SKU" required :error="skuError">
          <div class="flex gap-2">
            <UInput
              :model-value="modelValue.sku"
              placeholder="SKU-001"
              class="flex-1 font-mono uppercase"
              :ui="{ base: 'uppercase' }"
              @update:model-value="updateField('sku', ($event || '').toUpperCase())"
            />
            <UButton
              type="button"
              color="neutral"
              variant="outline"
              size="sm"
              icon="i-lucide-wand-2"
              @click="handleGenerateSKU"
            >
              Үүсгэх
            </UButton>
          </div>
        </UFormField>
      </div>

      <!-- Stock & Base Price -->
      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Үлдэгдэл" required>
          <UInput
            :model-value="modelValue.stock_quantity"
            type="number"
            placeholder="0"
            @update:model-value="updateField('stock_quantity', Number($event) || 0)"
          >
            <template #trailing>
              <span class="text-gray-400">ш</span>
            </template>
          </UInput>
        </UFormField>

        <UFormField label="Үндсэн үнэ">
          <UInput
            :model-value="modelValue.price"
            type="number"
            placeholder="0"
            @update:model-value="updateField('price', $event ? Number($event) : null)"
          >
            <template #leading>
              <span class="text-gray-400">₮</span>
            </template>
          </UInput>
        </UFormField>
      </div>

      <!-- Sale Price & Discount Percent -->
      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Хямдарсан үнэ">
          <UInput
            :model-value="modelValue.sale_price"
            type="number"
            placeholder="0"
            @update:model-value="updateField('sale_price', $event ? Number($event) : null)"
          >
            <template #leading>
              <span class="text-gray-400">₮</span>
            </template>
          </UInput>
        </UFormField>

        <UFormField label="Хямдралын хувь">
          <UInput
            v-model.number="discountPercent"
            type="number"
            placeholder="0"
            :min="0"
            :max="99"
          >
            <template #leading>
              <span class="text-gray-400">%</span>
            </template>
          </UInput>
        </UFormField>
      </div>

      <!-- Details Toggle -->
      <div class="flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
        <USwitch v-model="showDetails" size="sm" />
        <span class="text-sm text-gray-600 dark:text-gray-400">Дэлгэрэнгүй</span>
      </div>

      <!-- Barcode & Low Stock Alert (shown when details enabled) -->
      <div v-if="showDetails" class="grid grid-cols-2 gap-4">
        <UFormField label="Баркод">
          <UInput
            :model-value="modelValue.barcode"
            placeholder="1234567890123"
            @update:model-value="updateField('barcode', $event || null)"
          />
        </UFormField>

        <UFormField label="Бага үлдэгдлийн анхааруулга">
          <UInput
            :model-value="modelValue.low_stock_alert"
            type="number"
            placeholder="5"
            @update:model-value="updateField('low_stock_alert', Number($event) || 0)"
          >
            <template #trailing>
              <span class="text-gray-400">ш</span>
            </template>
          </UInput>
        </UFormField>
      </div>
    </div>
  </div>
</template>
