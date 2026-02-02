<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Product } from '~/composables/useProducts'
import type { VariantData } from '~/components/products/ProductVariantForm.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const { fetchProduct, updateProduct, deleteProduct, deleteVariant } = useProducts()

const productId = computed(() => Number(route.params.id))

const loading = ref(true)
const saving = ref(false)
const product = ref<Product | null>(null)
const images = ref<string[]>([])
const variants = ref<VariantData[]>([])

// Track which variants were deleted (to delete from server on save)
const deletedVariantIds = ref<number[]>([])

useSeoMeta({
  title: () =>
    product.value ? `${product.value.name} - Comment Boost` : 'Бүтээгдэхүүн - Comment Boost'
})

const schema = z.object({
  name: z.string().min(1, 'Нэр оруулна уу'),
  category: z.string().optional(),
  base_price: z.number().optional(),
  sale_price: z.number().optional().nullable(),
  status: z.string().default('active'),
  track_inventory: z.boolean().default(true),
  has_variants: z.boolean().default(false),
  sku: z.string().optional().nullable(),
  keyword: z.string().optional(),
  stock_quantity: z.number().optional()
})

type Schema = z.infer<typeof schema>

const state = reactive<Schema>({
  name: '',
  category: '',
  base_price: 0,
  sale_price: null,
  status: 'active',
  track_inventory: true,
  has_variants: false,
  sku: '',
  stock_quantity: 0
})

// Variant management
const createEmptyVariant = (): VariantData => ({
  name: '',
  keyword: '',
  sku: '',
  barcode: null,
  stock_quantity: 0,
  price: state.base_price || 0,
  sale_price: null,
  low_stock_alert: 5,
  images: []
})

const addVariant = () => {
  variants.value.push(createEmptyVariant())
  state.has_variants = true
}

const removeVariant = (index: number) => {
  const variant = variants.value[index]

  // Track for server deletion if has id
  if (variant?.id) {
    deletedVariantIds.value.push(variant.id)
  }

  variants.value.splice(index, 1)
  if (variants.value.length === 0) {
    state.has_variants = false
  }
}

const duplicateVariant = (index: number) => {
  const original = variants.value[index]
  const copy = JSON.parse(JSON.stringify(original))
  // Clear ID and unique fields
  delete copy.id
  if (copy.sku) copy.sku = `${copy.sku}-COPY`
  if (copy.barcode) copy.barcode = `${copy.barcode}-COPY`

  variants.value.splice(index + 1, 0, copy)
}

const handleVariantUpdate = (index: number, data: VariantData) => {
  variants.value[index] = data
}

const statusOptions = [
  { label: 'Идэвхтэй', value: 'active' },
  { label: 'Ноорог', value: 'draft' },
  { label: 'Дууссан', value: 'out_of_stock' }
]

const loadProduct = async () => {
  loading.value = true
  try {
    product.value = await fetchProduct(productId.value)

    state.name = product.value.name
    state.category = product.value.category || ''
    state.status = product.value.status
    state.track_inventory = product.value.track_inventory
    state.has_variants = product.value.has_variants

    // Load variants
    if (product.value.variants && product.value.variants.length > 0) {
      variants.value = product.value.variants.map(v => ({
        id: v.id,
        name: v.name,
        keyword: v.keyword || '',
        sku: v.sku || '',
        barcode: v.barcode || null,
        stock_quantity: v.stock_quantity,
        price: v.price,
        sale_price: v.sale_price || null,
        low_stock_alert: v.low_stock_alert || 5,
        images: v.images || []
      }))
    } else {
      // Add one empty variant if none exist
      addVariant()
    }

    // Reset deleted variants tracking
    deletedVariantIds.value = []
  } catch (err: any) {
    toast.add({
      title: 'Алдаа',
      description: 'Бүтээгдэхүүн олдсонгүй',
      color: 'error'
    })
    console.error('Failed to load product', err)
    router.push('/dashboard/products')
  } finally {
    loading.value = false
  }
}

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  // Validate variants if has_variants is true
  if (state.has_variants && variants.value.length > 0) {
    const invalidVariants = variants.value.filter(v => !v.name || !v.keyword)
    if (invalidVariants.length > 0) {
      toast.add({
        title: 'Алдаа',
        description: 'Бүх төрлийн нэр болон Түлхүүр үг оруулна уу',
        color: 'error'
      })
      return
    }
  }

  saving.value = true
  try {
    // 1. Delete removed variants from server
    for (const variantId of deletedVariantIds.value) {
      try {
        await deleteVariant(variantId)
      } catch (err) {
        console.error(`Failed to delete variant ${variantId}`, err)
      }
    }

    // 2. Update product & variants in one request
    const payload: any = {
      name: event.data.name,
      category: state.category,
      status: event.data.status,
      track_inventory: event.data.track_inventory,
      has_variants: state.has_variants,
      images: images.value,
      variants: variants.value
    }

    await updateProduct(productId.value, payload)

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
})
</script>

<template>
  <div class="w-full h-full overflow-y-auto">
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
                {{ product?.name || 'Бараа засах' }}
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
        <div
          v-if="loading"
          class="flex items-center justify-center p-20"
        >
          <UIcon
            name="i-lucide-loader-2"
            class="w-8 h-8 animate-spin text-primary"
          />
        </div>

        <div
          v-else-if="product"
          class="p-6 overflow-y-auto"
        >
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
                <ProductFormCard
                  title="Барааны гарчиг"
                  required
                >
                  <UInput
                    v-model="state.name"
                    placeholder="Барааны гарчгийг оруулна уу"
                    size="lg"
                  />
                </ProductFormCard>

                <!-- Variants Section -->
                <ProductFormCard title="Барааны төрлүүд">
                  <div class="space-y-4">
                    <ProductVariantForm
                      v-for="(variant, index) in variants"
                      :key="variant.id || `new-${index}`"
                      :model-value="variant"
                      :index="index"
                      :product-name="state.name"
                      :can-remove="variants.length > 0"
                      @update:model-value="handleVariantUpdate(index, $event)"
                      @remove="removeVariant(index)"
                      @duplicate="duplicateVariant(index)"
                    />
                    <div
                      class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
                    >
                      <UButton
                        type="button"
                        color="primary"
                        icon="i-lucide-plus-circle"
                        @click="addVariant"
                      >
                        Төрөл нэмэх
                      </UButton>
                    </div>
                  </div>
                </ProductFormCard>
                <div class="flex items-center justify-end">
                  <UButton
                    type="submit"
                    form="product-form"
                    color="primary"
                    icon="i-lucide-check"
                    :loading="saving"
                    class="mt-4 flex items-end justify-end"
                  >
                    Хадгалах
                  </UButton>
                </div>
              </div>

              <!-- Right Column - Sidebar -->
              <div class="space-y-6">
                <!-- Status -->
                <ProductFormCard
                  title="Барааны төлөв"
                  required
                >
                  <USelect
                    v-model="state.status"
                    :items="statusOptions"
                    size="lg"
                  />
                </ProductFormCard>

                <!-- Category -->
                <ProductFormCard title="Ангилал">
                  <UInput
                    v-model="state.category"
                    placeholder="Эмэгтэй хувцас, Гэр ахуй..."
                    size="lg"
                  />
                </ProductFormCard>

                <!-- Product Settings -->
                <ProductFormCard title="Барааны тохиргоо">
                  <div class="divide-y divide-gray-100 dark:divide-gray-800">
                    <ProductSettingToggle
                      v-model="state.track_inventory"
                      label="Үлдэгдэл автоматаар тооцох"
                      description="Захиалга хийгдсэн үед тухайн барааны үлдэгдэлээс хасна."
                    />
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
                  <UIcon
                    name="i-lucide-alert-triangle"
                    class="text-red-500"
                  />
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
  </div>
</template>
