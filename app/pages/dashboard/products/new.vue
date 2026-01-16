<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

useSeoMeta({
  title: 'Бараа нэмэх - Singulatim'
})

const { createProduct, fetchCategories } = useProducts()
const toast = useToast()
const router = useRouter()

const loading = ref(false)
const categories = ref<string[]>([])
const images = ref<string[]>([])

const schema = z.object({
  name: z.string().min(1, 'Нэр оруулна уу'),
  description: z.string().optional(),
  base_price: z.number().min(1, 'Үнэ оруулна уу'),
  sale_price: z.number().optional().nullable(),
  discount_percent: z.number().optional().nullable(),
  category: z.string().optional(),
  status: z.string().default('active'),
  track_inventory: z.boolean().default(true),
  has_variants: z.boolean().default(false),
  sku: z.string().optional(),
  stock_quantity: z.number().optional()
})

type Schema = z.infer<typeof schema>

const state = reactive<Schema>({
  name: '',
  description: '',
  base_price: 10000,
  sale_price: null,
  discount_percent: null,
  category: '',
  status: 'active',
  track_inventory: true,
  has_variants: false,
  sku: '',
  stock_quantity: 0
})

// Product settings
const settings = reactive({
  autoCalculateStock: false,
  isFeatured: false,
  trackOrders: false,
  isNew: true,
  isDigital: false,
  isLimitedEdition: false
})

const showDetailedInfo = ref(false)

const statusOptions = [
  { label: 'Идэвхтэй', value: 'active' },
  { label: 'Ноорог', value: 'draft' },
  { label: 'Идэвхгүй', value: 'inactive' }
]

const categoryOptions = computed(() =>
  categories.value.map(cat => ({ label: cat, value: cat }))
)

// Calculate discount percentage when sale price changes
watch(() => state.sale_price, (newVal) => {
  if (newVal && state.base_price > 0) {
    state.discount_percent = Math.round((1 - newVal / state.base_price) * 100)
  }
})

// Calculate sale price when discount percent changes
watch(() => state.discount_percent, (newVal) => {
  if (newVal && state.base_price > 0) {
    state.sale_price = Math.round(state.base_price * (1 - newVal / 100))
  }
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true

  try {
    const product = await createProduct({
      name: event.data.name,
      description: event.data.description,
      base_price: event.data.base_price,
      sale_price: event.data.sale_price,
      category: event.data.category,
      status: event.data.status,
      track_inventory: event.data.track_inventory,
      has_variants: event.data.has_variants
    })

    toast.add({
      title: 'Амжилттай',
      description: 'Бүтээгдэхүүн үүсгэгдлээ',
      color: 'success'
    })

    router.push(`/dashboard/products/${product.id}`)
  } catch (err: any) {
    toast.add({
      title: 'Алдаа',
      description: err.data?.message || 'Бүтээгдэхүүн үүсгэхэд алдаа гарлаа',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    categories.value = await fetchCategories()
  } catch {
    // ignore
  }
})
</script>

<template>
  <UDashboardPanel id="new-product">
    <template #header>
      <UDashboardNavbar>
        <template #leading>
          <UButton
            to="/dashboard/products"
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
          />
        </template>

        <template #title>
          <div>
            <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
              Бараа нэмэх
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Бараа бүтээгдэхүүний мэдээллийг оруулан шинээр нэмэх
            </p>
          </div>
        </template>

        <template #right>
          <UButton
            type="submit"
            form="product-form"
            color="primary"
            icon="i-lucide-check"
            :loading="loading"
          >
            Бараа нэмэх
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-6 overflow-y-auto">
        <UForm
          id="product-form"
          :schema="schema"
          :state="state"
          @submit="onSubmit"
        >
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left Column - Main Form -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Product Title -->
              <ProductFormCard title="Барааны гарчиг" required>
                <UInput
                  v-model="state.name"
                  placeholder="Барааны гарчгийг оруулна уу"
                  size="lg"
                />
              </ProductFormCard>

              <!-- Description -->
              <ProductFormCard title="Барааны тайлбар" required>
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <!-- Toolbar -->
                  <div class="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <UButton
                      size="xs"
                      color="neutral"
                      variant="ghost"
                      icon="i-lucide-bold"
                    />
                    <UButton
                      size="xs"
                      color="neutral"
                      variant="ghost"
                      icon="i-lucide-italic"
                    />
                    <UButton
                      size="xs"
                      color="neutral"
                      variant="ghost"
                      icon="i-lucide-underline"
                    />
                    <UButton
                      size="xs"
                      color="neutral"
                      variant="ghost"
                      icon="i-lucide-link"
                    />
                    <UButton
                      size="xs"
                      color="neutral"
                      variant="ghost"
                      icon="i-lucide-strikethrough"
                    />
                    <UButton
                      size="xs"
                      color="neutral"
                      variant="ghost"
                      icon="i-lucide-list"
                    />
                    <UButton
                      size="xs"
                      color="neutral"
                      variant="ghost"
                      icon="i-lucide-eraser"
                    />
                    <UButton
                      size="xs"
                      color="neutral"
                      variant="ghost"
                      icon="i-lucide-undo"
                    />
                    <UButton
                      size="xs"
                      color="neutral"
                      variant="ghost"
                      icon="i-lucide-redo"
                    />
                  </div>
                  <!-- Editor -->
                  <UTextarea
                    v-model="state.description"
                    placeholder="Энд тайлбараа бичнэ үү..."
                    :rows="4"
                    :ui="{ base: 'border-0 focus:ring-0' }"
                  />
                </div>

                <!-- AI Credits -->
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl font-bold text-gray-900 dark:text-white">0</span>
                    <span class="text-gray-500">кредит</span>
                  </div>
                  <UButton color="primary" icon="i-lucide-sparkles">
                    AI ашиглах
                  </UButton>
                </div>
              </ProductFormCard>

              <!-- Images -->
              <ProductFormCard title="Барааны мэдээлэл" required>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Барааны төрлийн зураг
                </p>
                <ProductImageUpload v-model="images" />
              </ProductFormCard>

              <!-- Price & Stock -->
              <ProductFormCard>
                <div class="grid grid-cols-2 gap-4">
                  <UFormField label="Үлдэгдэл" name="stock_quantity" required>
                    <UInput
                      v-model.number="state.stock_quantity"
                      type="number"
                      placeholder="0"
                    >
                      <template #trailing>
                        <span class="text-gray-400">ш</span>
                      </template>
                    </UInput>
                  </UFormField>

                  <UFormField label="Үндсэн үнэ" name="base_price" required>
                    <UInput
                      v-model.number="state.base_price"
                      type="number"
                      placeholder="0"
                    >
                      <template #leading>
                        <span class="text-gray-400">₮</span>
                      </template>
                    </UInput>
                  </UFormField>
                </div>

                <div class="grid grid-cols-2 gap-4 mt-4">
                  <UFormField label="Хямдарсан үнэ" name="sale_price">
                    <UInput
                      v-model.number="state.sale_price"
                      type="number"
                      placeholder="5,000"
                    >
                      <template #leading>
                        <span class="text-gray-400">₮</span>
                      </template>
                    </UInput>
                  </UFormField>

                  <UFormField label="Хямдралын хувь" name="discount_percent">
                    <UInput
                      v-model.number="state.discount_percent"
                      type="number"
                      placeholder="50"
                    >
                      <template #leading>
                        <span class="text-gray-400">%</span>
                      </template>
                    </UInput>
                  </UFormField>
                </div>

                <!-- Detailed Info Toggle -->
                <div class="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <UToggle v-model="showDetailedInfo" />
                  <span class="text-sm text-gray-600 dark:text-gray-400">Дэлгэрэнгүй мэдээлэл</span>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <UButton
                    to="/dashboard/products"
                    color="neutral"
                    variant="outline"
                    icon="i-lucide-copy"
                  >
                    Хуулах
                  </UButton>
                  <UButton
                    type="submit"
                    color="primary"
                    icon="i-lucide-plus-circle"
                    :loading="loading"
                  >
                    Төрөл нэмэх
                  </UButton>
                </div>
              </ProductFormCard>

              <!-- Promotions -->
              <ProductFormCard title="Барааны урамшуулал">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Дэлгүүрийн ашиглаж буй багцыг ахиулснаар энэхүү бараа дээр 1+1, 1-г авбал 50% хямдралтай, 2-г авбал 1-г үнэгүй гэх мэт урамшуулал үүсгэх боломжтой болно.
                </p>
                <div class="flex items-center justify-end mt-4">
                  <UButton color="neutral" variant="ghost" icon="i-lucide-shopping-cart">
                    Багц ахиулна уу
                  </UButton>
                </div>
              </ProductFormCard>
            </div>

            <!-- Right Column - Sidebar -->
            <div class="space-y-6">
              <!-- Status -->
              <ProductFormCard title="Барааны төлөв" required>
                <USelect
                  v-model="state.status"
                  :items="statusOptions"
                  size="lg"
                />
              </ProductFormCard>

              <!-- Category -->
              <ProductFormCard>
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    Барааны ангилал <span class="text-red-500">*</span>
                  </span>
                  <UButton
                    color="primary"
                    variant="link"
                    size="xs"
                    to="/dashboard/categories"
                  >
                    Удирдах
                  </UButton>
                </div>
                <USelect
                  v-model="state.category"
                  :items="categoryOptions"
                  placeholder="Ангилал сонгох"
                  size="lg"
                />
              </ProductFormCard>

              <!-- Product Settings -->
              <ProductFormCard title="Барааны тохиргоо" required>
                <div class="divide-y divide-gray-100 dark:divide-gray-800">
                  <ProductSettingToggle
                    v-model="settings.autoCalculateStock"
                    label="Үлдэгдэл автоматаар тооцох"
                    description="Захиалга хийгдсэн үед тухайн барааны үлдэгдэлээс хасч дүссэн үед тухайн бараа авах боломжгүй болно."
                  />
                  <ProductSettingToggle
                    v-model="settings.isFeatured"
                    label="Онцлох бараа эсэх"
                    description="Энэхүү бараагт онцлох барааны ангилал руу оруулан, онцлох хэсэгт харагдана."
                  />
                  <ProductSettingToggle
                    v-model="settings.trackOrders"
                    label="Захиалгын бараа эсэх"
                    description="Жишээ нь тодорхой хугацаанд буюу 14-21 хоногт захиалгаар ирнэ гэх харагдана."
                  />
                  <ProductSettingToggle
                    v-model="settings.isNew"
                    label="Шинэ бараа эсэх"
                    description="Энэхүү бараагт шинэ барааны ангилал руу оруулан, шинээр нэмэгдсэн хэсэгт харагдана."
                  />
                  <ProductSettingToggle
                    v-model="settings.isDigital"
                    label="Дижитал бараа эсэх"
                    description="Энэхүү бараа нь бодит биш дижитал бараа бол сонгоно уу."
                  />
                  <ProductSettingToggle
                    v-model="settings.isLimitedEdition"
                    label="Limited Edition эсэх"
                    description="Энэхүү бараа нь ховор загвар буюу Limited Edition бол сонгоно уу."
                  />
                </div>
              </ProductFormCard>

              <!-- Additional Fields -->
              <ProductFormCard title="Нэмэлт талбарууд">
                <p class="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  Энэхүү бараа дээр нэмэлтээр текст, тоо, огноо зэрэг мэдээллийг хэрэглэгчээс авах боломжтой.
                </p>
                <div class="flex flex-col items-center gap-2 py-4 border-t border-gray-200 dark:border-gray-700">
                  <UIcon name="i-lucide-plus-circle" class="w-8 h-8 text-gray-300 dark:text-gray-600" />
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Багц ахиулахад нэмэлт талбар нэмэх боломжтой
                  </p>
                  <UButton
                    color="neutral"
                    variant="outline"
                    icon="i-lucide-shopping-cart"
                    class="mt-2"
                  >
                    Багц ахиулах
                  </UButton>
                </div>
              </ProductFormCard>
            </div>
          </div>
        </UForm>
      </div>
    </template>
  </UDashboardPanel>
</template>
