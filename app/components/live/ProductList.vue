<script setup lang="ts">
import type { Product } from '~/composables/useProducts'
import type { LiveSaleProduct } from '~/types'

const { fetchProducts } = useProducts()
const toast = useToast()
const route = useRoute()
const config = useRuntimeConfig()

const props = defineProps<{
    shopId?: number
}>()

const addedProducts = useState<LiveSaleProduct[]>('addedProducts')
const onProductSelect = inject<(product: Product) => void>('onProductSelect')

const search = ref('')
const loading = ref(false)
const products = ref<Product[]>([])
const page = ref(1)
const hasMore = ref(true)

// Debounce search
const debouncedSearch = refDebounced(search, 300)

const filter = reactive({
    keyword: '',
    category: 'all',
    status: 'all',
    stock: 'all',
    page: 1,
    size: 10
})

const loadProducts = async (reset = false) => {
    if (loading.value || (!hasMore.value && !reset)) return

    loading.value = true
    try {
        if (reset) {
            page.value = 1
            products.value = []
            hasMore.value = true
        }

        const response = await fetchProducts({
            keyword: debouncedSearch.value,
            page: page.value,
            size: 20
            // status: 'active' // Optional: filter by active status
        })

        if (response.products.length < 20) {
            hasMore.value = false
        }

        if (reset) {
            products.value = response.products
        } else {
            products.value.push(...response.products)
        }

        page.value++
    } catch (error) {
        toast.add({
            title: 'Error loading products',
            description: 'Failed to fetch products list',
            color: 'error'
        })
    } finally {
        loading.value = false
    }
}

watch(debouncedSearch, () => {
    loadProducts(true)
})

onMounted(() => {
    loadProducts(true)
})

const handleAdd = async (product: Product) => {
    console.log('Added product on live:', product)
    try {
        await $fetch(`${config.public.apiUrl}/api/live-sales/${route.params.liveID}/products`, {
            method: 'POST',
            body: {
                product_id: product.id,
                keyword: 'dogshittest'
            },
            credentials: 'include'
        })

        addedProducts?.value.push({
            id: 0,
            product_id: product.id,
            live_sale_id: 1,
            product: product,
            keyword: ''
        })

        toast.add({
            title: 'Product Added',
            description: `Added ${product.name} for live stream`,
            icon: 'i-heroicons-check-circle',
            color: 'success'
        })
    } catch (error) {
        toast.add({
            title: 'Error adding product',
            description: 'Failed to add product',
            color: 'error'
        })
    }
}

const handleSelect = (product: Product) => {
    toast.add({
        title: 'Product Selected',
        description: `Selected ${product.name} for live stream`,
        icon: 'i-heroicons-check-circle',
        color: 'success'
    })

    // Update canvas overlay with product info
    onProductSelect?.(product)
}
</script>
<template>
    <div
        class="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800"
    >
        <div class="p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 class="font-semibold text-lg mb-3">Products</h3>
            <UInput
                v-model="search"
                icon="i-heroicons-magnifying-glass"
                placeholder="Search products..."
                :ui="{ trailing: 'pe-1' }"
                :loading="loading"
                loading-icon="i-lucide-loader"
            >
                <template v-if="search?.length" #trailing>
                    <UButton
                        color="neutral"
                        variant="link"
                        size="sm"
                        icon="i-lucide-x"
                        aria-label="Clear input"
                        @click="search = ''"
                    />
                </template>
            </UInput>
        </div>

        <div
            class="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700"
        >
            <div v-if="loading" class="flex justify-center p-8">
                <UIcon name="i-lucide-loader" class="animate-spin text-xl text-gray-400" />
            </div>

            <template v-else>
                <ProductListItem
                    v-for="product in products"
                    :key="product.id"
                    :product="product"
                    @add="handleAdd"
                    @select="handleSelect"
                />

                <div v-if="products.length === 0" class="text-center text-gray-400 py-8">
                    <p>No products found</p>
                </div>

                <div v-if="hasMore" class="p-2 text-center">
                    <UButton size="xs" variant="ghost" @click="() => loadProducts(false)">
                        Load more
                    </UButton>
                </div>
            </template>
        </div>
    </div>
</template>
