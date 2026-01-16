<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Product } from '~/composables/useProducts'

useSeoMeta({
  title: 'Бүтээгдэхүүн - Singulatim'
})

const { fetchProducts, createProduct, deleteProduct, fetchCategories } = useProducts()
const toast = useToast()
const router = useRouter()

const loading = ref(true)
const creating = ref(false)
const createModalOpen = ref(false)
const products = ref<Product[]>([])
const total = ref(0)
const categories = ref<string[]>([])

const filter = reactive({
  keyword: '',
  category: 'all',
  status: 'all',
  page: 1,
  size: 10
})

const statusOptions = [
  { label: 'Бүгд', value: 'all' },
  { label: 'Ноорог', value: 'draft' },
  { label: 'Идэвхтэй', value: 'active' },
  { label: 'Дууссан', value: 'out_of_stock' },
  { label: 'Архивлагдсан', value: 'archived' }
]

const columns: TableColumn<Product>[] = [
  { accessorKey: 'name', header: 'Нэр' },
  { accessorKey: 'category', header: 'Ангилал' },
  { accessorKey: 'base_price', header: 'Үнэ' },
  { accessorKey: 'stock', header: 'Үлдэгдэл' },
  { accessorKey: 'status', header: 'Төлөв' },
  { accessorKey: 'actions', header: '' }
]

const statusColors: Record<string, 'neutral' | 'success' | 'error' | 'warning'> = {
  draft: 'neutral',
  active: 'success',
  out_of_stock: 'error',
  archived: 'warning'
}

const statusLabels: Record<string, string> = {
  draft: 'Ноорог',
  active: 'Идэвхтэй',
  out_of_stock: 'Дууссан',
  archived: 'Архив'
}

const loadProducts = async () => {
  loading.value = true
  try {
    const apiFilter = {
      ...filter,
      status: filter.status === 'all' ? '' : filter.status,
      category: filter.category === 'all' ? '' : filter.category
    }
    const res = await fetchProducts(apiFilter)
    products.value = res.products || []
    total.value = res.total || 0
  } catch (err: any) {
    toast.add({
      title: 'Алдаа',
      description: err.data?.message || 'Бүтээгдэхүүн ачаалахад алдаа гарлаа',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    categories.value = await fetchCategories()
  } catch {
    // ignore
  }
}

const getStock = (product: Product): number => {
  if (product.has_variants) {
    return product.variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0
  }
  return product.inventory?.stock_quantity || 0
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('mn-MN').format(price) + '₮'
}

// Delete modal
const deleteModalOpen = ref(false)
const productToDelete = ref<Product | null>(null)
const deleting = ref(false)

const openDeleteModal = (product: Product) => {
  productToDelete.value = product
  deleteModalOpen.value = true
}

const onSubmitCreate = async (data: any) => {
  creating.value = true
  try {
    const product = await createProduct(data)
    toast.add({
      title: 'Амжилттай',
      description: 'Бүтээгдэхүүн үүсгэгдлээ',
      color: 'success'
    })
    createModalOpen.value = false
    router.push(`/dashboard/products/${product.id}`)
  } catch (err: any) {
    toast.add({
      title: 'Алдаа',
      description: err.data?.message || 'Бүтээгдэхүүн үүсгэхэд алдаа гарлаа',
      color: 'error'
    })
  } finally {
    creating.value = false
  }
}

const confirmDelete = async () => {
  if (!productToDelete.value) return

  deleting.value = true
  try {
    await deleteProduct(productToDelete.value.id)
    toast.add({
      title: 'Амжилттай',
      description: 'Бүтээгдэхүүн устгагдлаа',
      color: 'success'
    })
    deleteModalOpen.value = false
    await loadProducts()
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

// Watch filters
watch([() => filter.keyword, () => filter.category, () => filter.status], () => {
  filter.page = 1
  loadProducts()
}, { debounce: 300 } as any)

watch(() => filter.page, loadProducts)

onMounted(() => {
  loadProducts()
  loadCategories()
})
</script>

<template>
  <UDashboardPanel id="products">
    <template #header>
      <UDashboardNavbar
        title="Бүтээгдэхүүн"
      >
        <template #leading>
          <UDashboardSearchButton />
        </template>

        <template #right>
          <UButton
            icon="i-lucide-plus"
            color="primary"
            @click="createModalOpen = true"
          >
            Нэмэх
          </UButton>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            v-model="filter.keyword"
            placeholder="Хайх..."
            icon="i-lucide-search"
            class="w-48"
          />

          <USelect
            v-model="filter.status"
            :items="statusOptions"
            placeholder="Төлөв"
            class="w-36"
          />

          <USelect
            v-if="categories.length > 0"
            v-model="filter.category"
            :items="[{ label: 'Бүх ангилал', value: 'all' }, ...categories.map(c => ({ label: c, value: c }))]"
            placeholder="Ангилал"
            class="w-40"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UTable
        :data="products"
        :columns="columns"
        :loading="loading"
        class="w-full"
        :ui="{
          tbody: 'divide-y divide-gray-200 dark:divide-gray-800',
          th: 'text-left rtl:text-right px-4 py-3.5 text-gray-900 dark:text-white font-semibold text-sm',
          td: 'px-4 py-4 text-gray-500 dark:text-gray-400'
        }"
      >
        <template #name="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar
              v-if="row.original.images?.length"
              :src="row.original.images[0]"
              :alt="row.original.name"
              size="sm"
            />
            <div
              v-else
              class="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center"
            >
              <UIcon
                name="i-lucide-package"
                class="text-gray-400"
              />
            </div>
            <div>
              <NuxtLink
                :to="`/dashboard/products/${row.original.id}`"
                class="font-medium hover:text-primary"
              >
                {{ row.original.name }}
              </NuxtLink>
              <p
                v-if="row.original.has_variants"
                class="text-xs text-gray-500"
              >
                {{ row.original.variants?.length || 0 }} хувилбар
              </p>
            </div>
          </div>
        </template>

        <template #category="{ row }">
          <UBadge
            v-if="row.original.category"
            color="neutral"
            variant="subtle"
          >
            {{ row.original.category }}
          </UBadge>
          <span
            v-else
            class="text-gray-400"
          >-</span>
        </template>

        <template #base_price="{ row }">
          <div>
            <span v-if="row.original.sale_price" class="line-through text-gray-400 text-sm mr-2">
              {{ formatPrice(row.original.base_price) }}
            </span>
            <span :class="row.original.sale_price ? 'text-red-500' : ''">
              {{ formatPrice(row.original.sale_price || row.original.base_price) }}
            </span>
          </div>
        </template>

        <template #stock="{ row }">
          <span :class="getStock(row.original) <= 5 ? 'text-red-500' : ''">
            {{ getStock(row.original) }}
          </span>
        </template>

        <template #status="{ row }">
          <UBadge
            :color="statusColors[row.original.status] || 'neutral'"
            variant="subtle"
          >
            {{ statusLabels[row.original.status] || row.original.status }}
          </UBadge>
        </template>

        <template #actions="{ row }">
          <div class="flex justify-end gap-1">
            <UButton
              :to="`/dashboard/products/${row.original.id}`"
              icon="i-lucide-pencil"
              color="neutral"
              variant="ghost"
              size="xs"
            />
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="xs"
              @click="openDeleteModal(row.original)"
            />
          </div>
        </template>

        <template #empty>
          <div class="flex flex-col items-center justify-center py-16 text-center">
            <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-full mb-4 ring-1 ring-gray-200 dark:ring-gray-800">
              <UIcon
                name="i-lucide-package"
                class="w-10 h-10 text-gray-400 dark:text-gray-500"
              />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Бүтээгдэхүүн олдсонгүй
            </h3>
            <p class="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
              Одоогоор ямар ч бүтээгдэхүүн байхгүй байна. Шинэ бүтээгдэхүүн нэмж эхлээрэй.
            </p>
            <UButton
              to="/dashboard/products/new"
              color="primary"
              size="md"
              icon="i-lucide-plus"
            >
              Бүтээгдэхүүн нэмэх
            </UButton>
          </div>
        </template>
      </UTable>

      <div
        v-if="total > filter.size"
        class="flex justify-center p-4 border-t border-gray-200 dark:border-gray-800"
      >
        <UPagination
          v-model="filter.page"
          :total="total"
          :page-count="filter.size"
        />
      </div>
    </template>

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
            <strong>{{ productToDelete?.name }}</strong> бүтээгдэхүүнийг устгахдаа итгэлтэй байна уу?
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

    <!-- Create Modal -->
    <UModal v-model="createModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="font-semibold">
              Бүтээгдэхүүн нэмэх
            </h3>
          </template>

          <ProductForm
            :loading="creating"
            :categories="categories"
            @submit="onSubmitCreate"
            @cancel="createModalOpen = false"
          />
        </UCard>
      </template>
    </UModal>
  </UDashboardPanel>
</template>
