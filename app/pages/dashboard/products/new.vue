<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { VariantData } from '~/components/products/ProductVariantForm.vue'

useSeoMeta({
  title: 'Бараа нэмэх - Comment Boost'
})

const { createProduct, createVariant } = useProducts()
const toast = useToast()
const router = useRouter()

const loading = ref(false)
const images = ref<string[]>([])
const variants = ref<VariantData[]>([])

const schema = z.object({
  name: z.string().min(1, 'Нэр оруулна уу'),
  status: z.string().default('active'),
  track_inventory: z.boolean().default(true),
  has_variants: z.boolean().default(false),
  sku: z.string().optional(),
  stock_quantity: z.number().optional()
})

type Schema = z.infer<typeof schema>

const state = reactive<Schema>({
  name: '',
  status: 'active',
  track_inventory: true,
  has_variants: false,
  sku: '',
  stock_quantity: 0
})

// Variant management
const createEmptyVariant = (): VariantData => ({
  name: '',
  sku: '',
  barcode: null,
  stock_quantity: 0,
  price: null,
  sale_price: null,
  low_stock_alert: 5,
  images: []
})

const addVariant = () => {
  variants.value.push(createEmptyVariant())
  state.has_variants = true
}

const removeVariant = (index: number) => {
  variants.value.splice(index, 1)
  if (variants.value.length === 0) {
    state.has_variants = false
  }
}

const handleVariantUpdate = (index: number, data: VariantData) => {
  variants.value[index] = data
}

const statusOptions = [
  { label: 'Идэвхтэй', value: 'active' },
  { label: 'Ноорог', value: 'draft' },
  { label: 'Дууссан', value: 'out_of_stock' }
]

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

  loading.value = true

  try {
    // 1. Create the product
    const product = await createProduct({
      name: event.data.name,
      description: event.data.description,
      base_price: event.data.base_price,
      sale_price: event.data.sale_price,
      status: event.data.status,
      track_inventory: event.data.track_inventory,
      has_variants: state.has_variants,
      images: images.value
    })

    // 2. Create variants if any
    if (state.has_variants && variants.value.length > 0) {
      for (const variant of variants.value) {
        await createVariant(product.id, {
          name: variant.name,
          sku: variant.sku,
          barcode: variant.barcode,
          stock_quantity: variant.stock_quantity,
          price: variant.price,
          sale_price: variant.sale_price,
          low_stock_alert: variant.low_stock_alert,
          images: variant.images
        })
      }
    }

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
onMounted(() => {
  // Initialize with one empty variant by default
  addVariant()
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

              <!-- Variants Section -->
              <ProductFormCard title="Барааны төрлүүд">
                <div class="space-y-4">
                  <ProductVariantForm
                    v-for="(variant, index) in variants"
                    :key="index"
                    :model-value="variant"
                    :index="index"
                    :product-name="state.name"
                    :can-remove="variants.length > 1"
                    @update:model-value="handleVariantUpdate(index, $event)"
                    @remove="removeVariant(index)"
                  />
                  <div class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
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
              <div class="flex items-center justify-end  ">
                <UButton
                  type="submit"
                  form="product-form"
                  color="primary"
                  icon="i-lucide-check"
                  :loading="loading"
                  class="mt-4 flex items-end justify-end"
                >
                  Бараа нэмэх
                </UButton>
              </div>
            </div>

            <!-- Right Column - Sidebar -->
            <div class="space-y-6">
              <!-- Status -->
              <ProductFormCard title="Барааны төлөв" required>
                <USelect v-model="state.status" :items="statusOptions" size="lg" />
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
    </template>
  </UDashboardPanel>
</template>
