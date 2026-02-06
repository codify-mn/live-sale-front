<script setup lang="ts">
export interface VariantData {
    id?: number
    name: string
    keyword: string // Required for comment identification
    sku?: string // Optional now
    barcode: string | null
    stock_quantity: number
    low_stock_alert: number
    is_active: boolean
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
    remove: []
    duplicate: []
}>()

// Show/hide detailed info (barcode, low stock alert)
const showDetails = ref(false)

// Track if keyword has been manually edited
const keywordDirty = ref(false)

const updateField = <K extends keyof VariantData>(field: K, value: VariantData[K]) => {
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
        emit('update:modelValue', {
            ...props.modelValue,
            name: value,
            keyword: generateKeyword(value)
        })
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
watch(
    () => props.productName,
    () => {
        if (!keywordDirty.value && props.modelValue.name) {
            updateField('keyword', generateKeyword(props.modelValue.name))
        }
    }
)

// Initialize dirty state on mount (if keyword already has value different from expected)
onMounted(() => {
    const expectedKeyword = generateKeyword(props.modelValue.name)
    if (props.modelValue.keyword && props.modelValue.keyword !== expectedKeyword) {
        keywordDirty.value = true
    }
})
</script>

<template>
    <div class="p-3">
        <div class="flex items-center justify-end gap-1">
            <UButton
                color="primary"
                variant="ghost"
                size="xs"
                icon="i-lucide-copy"
                label="Хувилах"
                @click="emit('duplicate')"
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
                    <template #help>
                        <p class="text-xs flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <UIcon name="i-lucide-wand-sparkles" :size="20" />
                            Комментоос энэ үгээр барааг танина
                        </p>
                    </template>
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

            <!-- Details Toggle -->
            <div class="flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                <USwitch v-model="showDetails" size="sm" />
                <span class="text-sm text-gray-600 dark:text-gray-400 font-medium"
                    >Дэлгэрэнгүй тохиргоо (SKU, Баркод, Сэрэмжлүүлэг)</span
                >
            </div>

            <!-- Barcode, SKU & Alert -->
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

                <UFormField label="Бага үлдэгдлийн сэрэмжлүүлэг">
                    <UInput
                        :model-value="modelValue.low_stock_alert"
                        type="number"
                        placeholder="10"
                        @update:model-value="updateField('low_stock_alert', Number($event) || 0)"
                    />
                </UFormField>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Hide number input arrows/spinners */
:deep(input[type='number'])::-webkit-outer-spin-button,
:deep(input[type='number'])::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

:deep(input[type='number']) {
    -moz-appearance: textfield;
}
</style>
