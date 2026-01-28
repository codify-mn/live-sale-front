<script setup lang="ts">
import { calculateDiscountPercent, calculateSalePrice } from '~/utils'

export interface VariantData {
  id?: number
  name: string
  keyword: string // Required for comment identification
  sku?: string // Optional now
  barcode: string | null
  stock_quantity: number
  price: number | null // Override base price
  sale_price: number | null // Discounted price
  low_stock_alert: number
  images: string[]
}

interface Props {
  modelValue: VariantData
  index: number
  productName?: string // For SKU generation
  canRemove?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  productName: '',
  canRemove: true
})

const emit = defineEmits<{
  'update:modelValue': [value: VariantData]
  'remove': []
  'duplicate': []
}>()

// Local state for discount percent (UI-only, not persisted)
const discountPercent = ref<number | null>(null)

// Show/hide detailed info (barcode, low stock alert)
const showDetails = ref(false)

// Track if keyword has been manually edited
const keywordDirty = ref(false)

const updateField = <K extends keyof VariantData>(
  field: K,
  value: VariantData[K]
) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

// Generate keyword from product name + variant name
const generateKeyword = (variantName: string) => {
  const parts = [props.productName, variantName].filter(Boolean)
  return parts.join('-').toLowerCase()
}

// Handle name input - auto-update keyword if not dirty
const handleNameInput = (value: string) => {
  if (!keywordDirty.value) {
    // Update both name and keyword together
    emit('update:modelValue', { ...props.modelValue, name: value, keyword: generateKeyword(value) })
  } else {
    updateField('name', value)
  }
}

// Handle keyword input - marks as dirty when user types
const handleKeywordInput = (value: string) => {
  keywordDirty.value = true
  updateField('keyword', value)
}

// Auto-update keyword when productName changes (if not dirty)
watch(() => props.productName, () => {
  if (!keywordDirty.value && props.modelValue.name) {
    updateField('keyword', generateKeyword(props.modelValue.name))
  }
})

// Initialize dirty state on mount (if keyword already has value different from expected)
onMounted(() => {
  const expectedKeyword = generateKeyword(props.modelValue.name)
  if (props.modelValue.keyword && props.modelValue.keyword !== expectedKeyword) {
    keywordDirty.value = true
  }
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
    <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
      <h4 class="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <UIcon name="i-lucide-layers" class="w-4 h-4 text-primary" />
        Төрөл #{{ index + 1 }}
      </h4>
      <div class="flex items-center gap-1">
        <UButton
          color="primary"
          variant="ghost"
          size="xs"
          icon="i-lucide-copy"
          label="Хувилах"
          @click="emit('duplicate')"
        />
        <UButton
          v-if="canRemove"
          color="error"
          variant="ghost"
          size="xs"
          icon="i-lucide-trash-2"
          @click="emit('remove')"
        />
      </div>
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

      <!-- Name, Keyword & Stock -->
      <div class="grid grid-cols-3 gap-4">
        <UFormField label="Төрлийн нэр" required>
          <UInput
            :model-value="modelValue.name"
            placeholder="Улаан / XL"
            @update:model-value="handleNameInput($event)"
          />
        </UFormField>

        <UFormField label="Түлхүүр үг" required help="Комментоос энэ үгээр барааг танина">
          <UInput
            :model-value="modelValue.keyword"
            placeholder="улаан"
            @update:model-value="handleKeywordInput($event)"
          />
        </UFormField>

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
      </div>

      <!-- Base Price, Sale Price & Discount -->
      <div class="grid grid-cols-3 gap-4">
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
        <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">Дэлгэрэнгүй тохиргоо</span>
      </div>

      <!-- Barcode, SKU & Low Stock Alert (shown when details enabled) -->
      <div v-if="showDetails" class="grid grid-cols-3 gap-4">
        <UFormField label="Баркод">
          <UInput
            :model-value="modelValue.barcode"
            placeholder="1234567890123"
            @update:model-value="updateField('barcode', $event || null)"
          />
        </UFormField>

        <UFormField label="SKU">
          <UInput
            :model-value="modelValue.sku"
            placeholder="SKU-001"
            class="font-mono uppercase"
            :ui="{ base: 'uppercase' }"
            @update:model-value="updateField('sku', ($event || '').toUpperCase())"
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

<style scoped>
/* Hide number input arrows/spinners */
:deep(input[type="number"])::-webkit-outer-spin-button,
:deep(input[type="number"])::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

:deep(input[type="number"]) {
  -moz-appearance: textfield;
}
</style>
