<script setup lang="ts">
import type { Product } from '~/composables/useProducts'

const props = defineProps<{
    open: boolean
}>()

const emit = defineEmits<{
    'update:open': [value: boolean]
}>()

const isOpen = computed({
    get: () => props.open,
    set: (val: boolean) => emit('update:open', val)
})

const { fetchProducts } = useProducts()
const { getPreviewImageUrl, generateCaption, postToFacebook } = useProductPost()
const toast = useToast()

const products = ref<Product[]>([])
const selectedProductId = ref<number | undefined>(undefined)
const selectedTemplate = ref('classic')
const bgColor = ref('#FFFFFF')
const caption = ref('')
const loadingProducts = ref(false)
const loadingCaption = ref(false)
const posting = ref(false)
const previewKey = ref(0)

const presetColors = [
    { label: 'Цагаан', value: '#FFFFFF' },
    { label: 'Хар', value: '#1F2937' },
    { label: 'Цэнхэр', value: '#0EA5E9' },
    { label: 'Ягаан', value: '#F43F5E' },
    { label: 'Шар', value: '#F59E0B' }
]

const templates = [
    {
        value: 'classic',
        label: 'Сонгодог',
        icon: 'i-lucide-layout-template',
        description: 'Лого, бараа, нэр, үнэ'
    },
    {
        value: 'banner',
        label: 'Баннер',
        icon: 'i-lucide-image',
        description: 'Том зураг, доод хэсэгт мэдээлэл'
    },
    {
        value: 'minimal',
        label: 'Энгийн',
        icon: 'i-lucide-minimize-2',
        description: 'Цэвэрхэн, жижиг загвар'
    }
]

const productOptions = computed(() =>
    products.value
        .filter((p) => p.status === 'active')
        .map((p) => ({
            label: p.name,
            value: p.id
        }))
)

const previewUrl = computed(() => {
    if (!selectedProductId.value) return ''
    return getPreviewImageUrl(selectedProductId.value, selectedTemplate.value, bgColor.value)
})

let colorDebounceTimer: ReturnType<typeof setTimeout> | null = null

function onColorChange(newColor: string) {
    if (colorDebounceTimer) clearTimeout(colorDebounceTimer)
    colorDebounceTimer = setTimeout(() => {
        bgColor.value = newColor
        previewKey.value++
    }, 500)
}

function onPresetColor(color: string) {
    bgColor.value = color
    previewKey.value++
}

function onTemplateChange(template: string) {
    selectedTemplate.value = template
    previewKey.value++
}

async function loadProducts() {
    loadingProducts.value = true
    try {
        const res = await fetchProducts({ size: 100, status: 'active' })
        products.value = res.products || []
    } catch {
        toast.add({ title: 'Бараа ачаалахад алдаа гарлаа', color: 'error' })
    } finally {
        loadingProducts.value = false
    }
}

async function handleGenerateCaption() {
    if (!selectedProductId.value) {
        toast.add({ title: 'Бараа сонгоно уу', color: 'warning' })
        return
    }

    loadingCaption.value = true
    try {
        caption.value = await generateCaption(selectedProductId.value)
    } catch {
        toast.add({ title: 'AI caption үүсгэхэд алдаа гарлаа', color: 'error' })
    } finally {
        loadingCaption.value = false
    }
}

async function handlePost() {
    if (!selectedProductId.value) {
        toast.add({ title: 'Бараа сонгоно уу', color: 'warning' })
        return
    }
    if (!caption.value.trim()) {
        toast.add({ title: 'Тайлбар бичнэ үү', color: 'warning' })
        return
    }

    posting.value = true
    try {
        await postToFacebook(selectedProductId.value, {
            template: selectedTemplate.value,
            bg_color: bgColor.value,
            caption: caption.value
        })
        toast.add({ title: 'Facebook-д амжилттай нийтэллээ!', color: 'success' })
        isOpen.value = false
        caption.value = ''
        selectedProductId.value = undefined
    } catch (err: any) {
        const message = err?.data?.message || err?.message || 'Алдаа гарлаа'
        toast.add({ title: 'Нийтлэхэд алдаа гарлаа', description: message, color: 'error' })
    } finally {
        posting.value = false
    }
}

watch(isOpen, (val) => {
    if (val && products.value.length === 0) {
        loadProducts()
    }
})
</script>

<template>
    <USlideover
        v-model:open="isOpen"
        title="Бараа нийтлэх"
        description="Facebook хуудсанд бараа зурагтай нийтлэх"
    >
        <template #body>
            <div class="flex flex-col gap-6">
                <!-- Product selector -->
                <div>
                    <label class="block text-sm font-medium mb-2">Бараа сонгох</label>
                    <USelectMenu
                        v-model="selectedProductId"
                        :items="productOptions"
                        placeholder="Бараа хайх..."
                        value-key="value"
                        :loading="loadingProducts"
                    />
                </div>

                <!-- Template selector -->
                <div>
                    <label class="block text-sm font-medium mb-2">Загвар</label>
                    <div class="grid grid-cols-3 gap-2">
                        <button
                            v-for="t in templates"
                            :key="t.value"
                            class="flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all cursor-pointer"
                            :class="
                                selectedTemplate === t.value
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            "
                            @click="onTemplateChange(t.value)"
                        >
                            <UIcon :name="t.icon" class="w-5 h-5" />
                            <span class="text-xs font-medium">{{ t.label }}</span>
                        </button>
                    </div>
                </div>

                <!-- Color picker -->
                <div>
                    <label class="block text-sm font-medium mb-2">Дэвсгэр өнгө</label>
                    <div class="flex items-center gap-3">
                        <div class="flex gap-1.5">
                            <button
                                v-for="c in presetColors"
                                :key="c.value"
                                class="w-7 h-7 rounded-full border-2 transition-all cursor-pointer"
                                :class="
                                    bgColor === c.value
                                        ? 'border-primary-500 scale-110'
                                        : 'border-gray-300 dark:border-gray-600'
                                "
                                :style="{ backgroundColor: c.value }"
                                :title="c.label"
                                @click="onPresetColor(c.value)"
                            />
                        </div>
                        <input
                            type="color"
                            :value="bgColor"
                            class="w-8 h-8 rounded cursor-pointer border-0"
                            @input="onColorChange(($event.target as HTMLInputElement).value)"
                        />
                    </div>
                </div>

                <!-- Image preview -->
                <div v-if="selectedProductId">
                    <label class="block text-sm font-medium mb-2">Урьдчилан харах</label>
                    <div
                        class="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
                    >
                        <img
                            :key="previewKey"
                            :src="previewUrl"
                            alt="Preview"
                            class="w-full h-full object-contain"
                            crossorigin="use-credentials"
                        />
                    </div>
                </div>
                <div v-else class="flex items-center justify-center h-40 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p class="text-sm text-gray-400">Бараа сонгож урьдчилан харах</p>
                </div>

                <!-- Caption -->
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <label class="text-sm font-medium">Тайлбар</label>
                        <UButton
                            size="xs"
                            variant="soft"
                            icon="i-lucide-sparkles"
                            :loading="loadingCaption"
                            @click="handleGenerateCaption"
                        >
                            AI-р үүсгэх
                        </UButton>
                    </div>
                    <UTextarea
                        v-model="caption"
                        placeholder="Барааны тайлбар бичих..."
                        :rows="4"
                    />
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex gap-2 w-full">
                <UButton
                    variant="outline"
                    class="flex-1"
                    @click="emit('update:open', false)"
                >
                    Болих
                </UButton>
                <UButton
                    class="flex-1"
                    icon="i-lucide-send"
                    :loading="posting"
                    :disabled="!selectedProductId || !caption.trim()"
                    @click="handlePost"
                >
                    Facebook-д нийтлэх
                </UButton>
            </div>
        </template>
    </USlideover>
</template>
