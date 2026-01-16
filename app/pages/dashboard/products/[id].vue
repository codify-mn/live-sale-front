<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Product, CreateVariantInput } from '~/composables/useProducts'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const {
  fetchProduct,
  updateProduct,
  deleteProduct,
  fetchCategories,
  createVariant,
  deleteVariant,
  updateVariantStock
} = useProducts()

const productId = computed(() => Number(route.params.id))

const loading = ref(true)
const saving = ref(false)
const product = ref<Product | null>(null)
const categories = ref<string[]>([])

useSeoMeta({
  title: () => product.value ? `${product.value.name} - Singulatim` : 'Бүтээгдэхүүн - Singulatim'
})

const schema = z.object({
  name: z.string().min(1, 'Нэр оруулна уу'),
  description: z.string().optional(),
  base_price: z.number().min(1, 'Үнэ оруулна уу'),
  sale_price: z.number().optional().nullable(),
  category: z.string().optional(),
  status: z.string()
})

type Schema = z.infer<typeof schema>

const state = reactive<Schema>({
  name: '',
  description: '',
  base_price: 0,
  sale_price: null,
  category: '',
  status: 'draft'
})

const statusOptions = [
  { label: 'Ноорог', value: 'draft' },
  { label: 'Идэвхтэй', value: 'active' },
  { label: 'Дууссан', value: 'out_of_stock' },
  { label: 'Архив', value: 'archived' }
]

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
  saving.value = true
  try {
    await updateProduct(productId.value, event.data)
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

// Variant modal
const variantModalOpen = ref(false)
const variantSaving = ref(false)
const newVariant = reactive<CreateVariantInput>({
  name: '',
  sku: '',
  barcode: '',
  stock_quantity: 0,
  low_stock_alert: 5
})

const resetVariantForm = () => {
  newVariant.name = ''
  newVariant.sku = ''
  newVariant.barcode = ''
  newVariant.stock_quantity = 0
  newVariant.low_stock_alert = 5
}

const saveVariant = async () => {
  if (!newVariant.name || !newVariant.sku) {
    toast.add({ title: 'Нэр болон SKU оруулна уу', color: 'error' })
    return
  }

  variantSaving.value = true
  try {
    await createVariant(productId.value, newVariant)
    toast.add({
      title: 'Амжилттай',
      description: 'Хувилбар нэмэгдлээ',
      color: 'success'
    })
    variantModalOpen.value = false
    resetVariantForm()
    await loadProduct()
  } catch (err: any) {
    toast.add({
      title: 'Алдаа',
      description: err.data?.message || 'Хувилбар нэмэхэд алдаа гарлаа',
      color: 'error'
    })
  } finally {
    variantSaving.value = false
  }
}

const removeVariant = async (variantId: number) => {
  try {
    await deleteVariant(variantId)
    toast.add({ title: 'Хувилбар устгагдлаа', color: 'success' })
    await loadProduct()
  } catch (err: any) {
    toast.add({
      title: 'Алдаа',
      description: err.data?.message || 'Устгахад алдаа гарлаа',
      color: 'error'
    })
  }
}

onMounted(async () => {
  await loadProduct()
  try {
    categories.value = await fetchCategories()
  } catch {
    // ignore
  }
})
</script>

<template>
  <UDashboardPanel id="product-detail">
    <UDashboardNavbar :title="product?.name || 'Бүтээгдэхүүн'">
      <template #leading>
        <UButton
          to="/dashboard/products"
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="ghost"
        />
      </template>

      <template #right>
        <UButton
          icon="i-lucide-trash-2"
          color="error"
          variant="ghost"
          @click="deleteModalOpen = true"
        />
      </template>
    </UDashboardNavbar>

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
      class="p-6 space-y-8"
    >
      <!-- Basic Info Form -->
      <UCard>
        <template #header>
          <h3 class="font-semibold">
            Үндсэн мэдээлэл
          </h3>
        </template>

        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField
            label="Нэр"
            name="name"
            required
          >
            <UInput v-model="state.name" />
          </UFormField>

          <UFormField
            label="Тайлбар"
            name="description"
          >
            <UTextarea
              v-model="state.description"
              :rows="3"
            />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField
              label="Үндсэн үнэ"
              name="base_price"
              required
            >
              <UInput
                v-model.number="state.base_price"
                type="number"
              >
                <template #trailing>
                  <span class="text-gray-500">₮</span>
                </template>
              </UInput>
            </UFormField>

            <UFormField
              label="Хямдралтай үнэ"
              name="sale_price"
            >
              <UInput
                v-model.number="state.sale_price"
                type="number"
              >
                <template #trailing>
                  <span class="text-gray-500">₮</span>
                </template>
              </UInput>
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField
              label="Ангилал"
              name="category"
            >
              <UInput
                v-model="state.category"
                list="categories"
              />
              <datalist id="categories">
                <option
                  v-for="cat in categories"
                  :key="cat"
                  :value="cat"
                />
              </datalist>
            </UFormField>

            <UFormField
              label="Төлөв"
              name="status"
            >
              <USelect
                v-model="state.status"
                :items="statusOptions"
              />
            </UFormField>
          </div>

          <div class="pt-4">
            <UButton
              type="submit"
              color="primary"
              :loading="saving"
            >
              Хадгалах
            </UButton>
          </div>
        </UForm>
      </UCard>

      <!-- Variants -->
      <UCard v-if="product.has_variants">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">
              Хувилбарууд
            </h3>
            <UButton
              icon="i-lucide-plus"
              size="sm"
              @click="variantModalOpen = true"
            >
              Нэмэх
            </UButton>
          </div>
        </template>

        <div
          v-if="product.variants?.length"
          class="divide-y divide-gray-200 dark:divide-gray-800"
        >
          <div
            v-for="variant in product.variants"
            :key="variant.id"
            class="flex items-center justify-between py-3"
          >
            <div>
              <p class="font-medium">
                {{ variant.name }}
              </p>
              <p class="text-sm text-gray-500">
                SKU: {{ variant.sku }}
                <span v-if="variant.barcode"> · Barcode: {{ variant.barcode }}</span>
              </p>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p
                  v-if="variant.price"
                  class="font-medium"
                >
                  {{ new Intl.NumberFormat('mn-MN').format(variant.price) }}₮
                </p>
                <p
                  class="text-sm"
                  :class="variant.stock_quantity <= variant.low_stock_alert ? 'text-red-500' : 'text-gray-500'"
                >
                  Үлдэгдэл: {{ variant.stock_quantity }}
                </p>
              </div>
              <UButton
                icon="i-lucide-trash-2"
                color="error"
                variant="ghost"
                size="xs"
                @click="removeVariant(variant.id)"
              />
            </div>
          </div>
        </div>

        <div
          v-else
          class="text-center py-8 text-gray-500"
        >
          Хувилбар байхгүй
        </div>
      </UCard>

      <!-- Inventory for simple products -->
      <UCard v-else-if="product.track_inventory && product.inventory">
        <template #header>
          <h3 class="font-semibold">
            Нөөц
          </h3>
        </template>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <p class="text-sm text-gray-500">
              SKU
            </p>
            <p class="font-medium">
              {{ product.inventory.sku || '-' }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">
              Barcode
            </p>
            <p class="font-medium">
              {{ product.inventory.barcode || '-' }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">
              Үлдэгдэл
            </p>
            <p
              class="font-medium"
              :class="product.inventory.stock_quantity <= product.inventory.low_stock_alert ? 'text-red-500' : ''"
            >
              {{ product.inventory.stock_quantity }}
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Delete Modal -->
    <UModal v-model="deleteModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-alert-triangle"
                class="text-red-500"
              />
              <span>Устгах</span>
            </div>
          </template>

          <p>
            <strong>{{ product?.name }}</strong> бүтээгдэхүүнийг устгахдаа итгэлтэй байна уу?
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

    <!-- Variant Modal -->
    <UModal v-model="variantModalOpen">
      <template #content>
        <UCard>
          <template #header>
            Хувилбар нэмэх
          </template>

          <div class="space-y-4">
            <UFormField
              label="Нэр"
              required
            >
              <UInput
                v-model="newVariant.name"
                placeholder="Улаан / L"
              />
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField
                label="SKU"
                required
              >
                <UInput
                  v-model="newVariant.sku"
                  placeholder="SKU-001"
                />
              </UFormField>

              <UFormField label="Barcode">
                <UInput
                  v-model="newVariant.barcode"
                  placeholder="123456789"
                />
              </UFormField>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Үлдэгдэл">
                <UInput
                  v-model.number="newVariant.stock_quantity"
                  type="number"
                />
              </UFormField>

              <UFormField label="Анхааруулах хязгаар">
                <UInput
                  v-model.number="newVariant.low_stock_alert"
                  type="number"
                />
              </UFormField>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                color="neutral"
                variant="outline"
                @click="variantModalOpen = false"
              >
                Болих
              </UButton>
              <UButton
                color="primary"
                :loading="variantSaving"
                @click="saveVariant"
              >
                Нэмэх
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </UDashboardPanel>
</template>
