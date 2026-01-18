<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Product, CreateVariantInput } from '~/composables/useProducts'
import type { VariantData } from '~/components/products/ProductVariantForm.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const {
  fetchProduct,
  updateProduct,
  deleteProduct,
  fetchCategories,
  createVariant,
  deleteVariant
} = useProducts()

const productId = computed(() => Number(route.params.id))

const loading = ref(true)
const saving = ref(false)
const product = ref<Product | null>(null)
const categories = ref<string[]>([])
const images = ref<string[]>([])
const variants = ref<VariantData[]>([])

useSeoMeta({
  title: () => product.value ? `${product.value.name} - Singulatim` : 'Бүтээгдэхүүн - Singulatim'
})

const schema = z.object({
  name: z.string().min(1, 'Нэр оруулна уу'),
  description: z.string().optional(),
  base_price: z.number().min(1, 'Үнэ оруулна уу'),
  sale_price: z.number().optional().nullable(),
  discount_percent: z.number().optional().nullable(),
  category: z.string().optional(),
  status: z.string(),
  track_inventory: z.boolean().default(true),
  has_variants: z.boolean().default(false),
  sku: z.string().optional(),
  stock_quantity: z.number().optional()
})

type Schema = z.infer<typeof schema>

const state = reactive<Schema>({
  name: '',
  description: '',
  base_price: 0,
  sale_price: null,
  discount_percent: null,
  category: '',
  status: 'draft',
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
  { label: 'Дууссан', value: 'out_of_stock' },
  { label: 'Архив', value: 'archived' }
]

const categoryOptions = computed(() =>
  categories.value.map(cat => ({ label: cat, value: cat }))
)

// Variant management
const createEmptyVariant = (): VariantData => ({
  name: '',
  sku: '',
  barcode: '',
  stock_quantity: 0,
  price: null,
  low_stock_alert: 5
})

const addVariant = () => {
  variants.value.push(createEmptyVariant())
  state.has_variants = true
}

const removeVariant = async (index: number) => {
  const variant = variants.value[index]

  // If variant has id, delete from server
  if (variant.id) {
    try {
      await deleteVariant(variant.id)
      toast.add({ title: 'Төрөл устгагдлаа', color: 'success' })
    } catch (err: any) {
      toast.add({
        title: 'Алдаа',
        description: err.data?.message || 'Устгахад алдаа гарлаа',
        color: 'error'
      })
      return
    }
  }

  variants.value.splice(index, 1)
  if (variants.value.length === 0) {
    state.has_variants = false
  }
}

const updateVariant = (index: number, data: VariantData) => {
  variants.value[index] = data
}

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

const loadProduct = async () => {
  loading.value = true
  try {
    product.value = await fetchProduct(productId.value)

    // Populate form
    state.name = product.value.name
    state.description = product.value.description || ''
    state.base_price = product.value.base_price
    state.sale_price = product.value.sale_price
    state.category = product.value.category || ''
    state.status = product.value.status
    state.track_inventory = product.value.track_inventory
    state.has_variants = product.value.has_variants

    // Load images
    images.value = product.value.images || []

    // Load variants
    if (product.value.has_variants && product.value.variants) {
      variants.value = product.value.variants.map(v => ({
        id: v.id,
        name: v.name,
        sku: v.sku,
        barcode: v.barcode || '',
        stock_quantity: v.stock_quantity,
        price: v.price,
        low_stock_alert: v.low_stock_alert
      }))
    }

    // Load inventory for simple products
    if (!product.value.has_variants && product.value.inventory) {
      state.sku = product.value.inventory.sku || ''
      state.stock_quantity = product.value.inventory.stock_quantity || 0
    }
  } catch (err: any) {
    toast.add({
      title: 'Алдаа',
      description: 'Бүтээгдэхүүн олдсонгүй',
      color: 'error'
    })
    router.push('/dashboard/products')
  } finally {
    loading.value = false
  }
}

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  // Validate variants if has_variants is true
  if (state.has_variants && variants.value.length > 0) {
    const invalidVariants = variants.value.filter(v => !v.name || !v.sku)
    if (invalidVariants.length > 0) {
      toast.add({
        title: 'Алдаа',
        description: 'Бүх төрлийн нэр болон SKU оруулна уу',
        color: 'error'
      })
      return
    }
  }

  saving.value = true
  try {
    // Save new variants
    const newVariants = variants.value.filter(v => !v.id)
    for (const variant of newVariants) {
      await createVariant(productId.value, {
        name: variant.name,
        sku: variant.sku,
        barcode: variant.barcode,
        stock_quantity: variant.stock_quantity,
        low_stock_alert: variant.low_stock_alert
      })
    }

    await updateProduct(productId.value, {
      ...event.data,
      images: images.value,
      has_variants: state.has_variants
    })

    toast.add({
      title: 'Амжилттай',
      description: 'Бүтээгдэхүүн шинэчлэгдлээ',
      color: 'success'
    })
    await loadProduct()
  } catch (err: any) {
    toast.add({
      title: 'Алдаа',
      description: err.data?.message || 'Шинэчлэхэд алдаа гарлаа',
      color: 'error'
    })
  } finally {
    saving.value = false
  }
}

// Delete modal
const deleteModalOpen = ref(false)
const deleting = ref(false)

const confirmDelete = async () => {
  deleting.value = true
  try {
    await deleteProduct(productId.value)
    toast.add({
      title: 'Амжилттай',
      description: 'Бүтээгдэхүүн устгагдлаа',
      color: 'success'
    })
    router.push('/dashboard/products')
  } catch (err: any) {
    toast.add({
      title: 'Алдаа',
      description: err.data?.message || 'Устгахад алдаа гарлаа',
      color: 'error'
    })
  } finally {
    deleting.value = false
  }
}

onMounted(async () => {
  await loadProduct()
  try {
    const result = await fetchCategories()
    categories.value = Array.isArray(result) ? result : []
  } catch {
    categories.value = []
  }
})
</script>

<template>
  <UDashboardPanel id="product-detail">
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
              {{ product?.name || 'Бүтээгдэхүүн засах' }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Бараа бүтээгдэхүүний мэдээллийг засварлах
            </p>
          </div>
        </template>

        <template #right>
          <div class="flex items-center gap-2">
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              @click="deleteModalOpen = true"
            />
            <UButton
              type="submit"
              form="product-form"
              color="primary"
              icon="i-lucide-check"
              :loading="saving"
            >
              Хадгалах
            </UButton>
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="loading" class="flex items-center justify-center p-20">
        <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary" />
      </div>

      <div v-else-if="product" class="p-6 overflow-y-auto">
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
                    class="w-full"
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
                      :disabled="state.has_variants"
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
                  <USwitch v-model="showDetailedInfo" />
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
                    type="button"
                    color="primary"
                    icon="i-lucide-plus-circle"
                    @click="addVariant"
                  >
                    Төрөл нэмэх
                  </UButton>
                </div>
              </ProductFormCard>

              <!-- Variants Section -->
              <ProductFormCard v-if="variants.length > 0" title="Барааны төрлүүд">
                <div class="space-y-4">
                  <ProductVariantForm
                    v-for="(variant, index) in variants"
                    :key="variant.id || index"
                    :model-value="variant"
                    :index="index"
                    :can-remove="true"
                    @update:model-value="updateVariant(index, $event)"
                    @remove="removeVariant(index)"
                  />

                  <UButton
                    type="button"
                    color="neutral"
                    variant="outline"
                    icon="i-lucide-plus"
                    class="w-full"
                    @click="addVariant"
                  >
                    Өөр төрөл нэмэх
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

      <!-- Delete Modal -->
      <UModal v-model:open="deleteModalOpen">
        <template #content>
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-alert-triangle" class="text-red-500" />
                <span class="font-semibold">Устгах</span>
              </div>
            </template>

            <p>
              <strong>{{ product?.name }}</strong> бүтээгдэхүүнийг устгахдаа итгэлтэй байна уу?
            </p>
            <p class="text-sm text-gray-500 mt-2">
              Энэ үйлдлийг буцаах боломжгүй.
            </p>

            <template #footer>
              <div class="flex justify-end gap-2">
                <UButton
                  color="neutral"
                  variant="outline"
                  @click="deleteModalOpen = false"
                >
                  Болих
                </UButton>
                <UButton
                  color="error"
                  :loading="deleting"
                  @click="confirmDelete"
                >
                  Устгах
                </UButton>
              </div>
            </template>
          </UCard>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
