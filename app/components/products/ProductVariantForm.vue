<script setup lang="ts">
export interface VariantData {
  id?: number
  name: string
  sku: string
  barcode: string
  stock_quantity: number
  price: number | null
  low_stock_alert: number
}

interface Props {
  modelValue: VariantData
  index: number
  canRemove?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canRemove: true
})

const emit = defineEmits<{
  'update:modelValue': [value: VariantData]
  'remove': []
}>()

const updateField = <K extends keyof VariantData>(field: K, value: VariantData[K]) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
        Төрөл #{{ index + 1 }}
      </span>
      <UButton
        v-if="canRemove"
        icon="i-lucide-trash-2"
        color="error"
        variant="ghost"
        size="xs"
        @click="emit('remove')"
      />
    </div>

    <div class="grid grid-cols-2 gap-3">
      <UFormField label="Төрлийн нэр" required>
        <UInput
          :model-value="modelValue.name"
          placeholder="Улаан / L"
          @update:model-value="updateField('name', $event)"
        />
      </UFormField>

      <UFormField label="Үнэ (сонголтоор)">
        <UInput
          :model-value="modelValue.price"
          type="number"
          placeholder="Үндсэн үнээс ялгаатай бол"
          @update:model-value="updateField('price', $event ? Number($event) : null)"
        >
          <template #leading>
            <span class="text-gray-400">₮</span>
          </template>
        </UInput>
      </UFormField>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <UFormField label="SKU" required>
        <UInput
          :model-value="modelValue.sku"
          placeholder="SKU-001-RED"
          @update:model-value="updateField('sku', $event)"
        />
      </UFormField>

      <UFormField label="Barcode">
        <UInput
          :model-value="modelValue.barcode"
          placeholder="123456789012"
          @update:model-value="updateField('barcode', $event)"
        />
      </UFormField>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <UFormField label="Үлдэгдэл">
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

      <UFormField label="Анхааруулах хязгаар">
        <UInput
          :model-value="modelValue.low_stock_alert"
          type="number"
          placeholder="5"
          @update:model-value="updateField('low_stock_alert', Number($event) || 5)"
        />
      </UFormField>
    </div>
  </div>
</template>
