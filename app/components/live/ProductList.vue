<script setup lang="ts">
import type { Product } from '~/composables/useProducts'

const { fetchProducts } = useProducts()
const toast = useToast()

const props = defineProps<{
    shopId?: number
}>()

const search = ref('')
const loading = ref(false)
const products = ref<Product[]>([])
const page = ref(1)
const hasMore = ref(true)

// Debounce search
const debouncedSearch = refDebounced(search, 300)

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

const handleSelect = (product: Product) => {
    console.log('Selected product on live:', product)
    toast.add({
        title: 'Product Selected',
        description: `Selected ${product.name} for live stream`,
        icon: 'i-heroicons-check-circle',
        color: 'success'
    })
    // Here we would emit an event or call an API to update the live stream state
}
</script>
<template>
    <div class="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
        <div class="p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 class="font-semibold text-lg mb-3">Products</h3>
            <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Search products...">
                <template #trailing>
                    <UButton v-show="search !== ''" color="neutral" variant="link" icon="i-heroicons-x-mark"
                        :padded="false" @click="search = ''" />
                </template>
            </UInput>
        </div>

        <div
            class="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
            <div v-if="loading && products.length === 0" class="flex justify-center p-4">
                <UIcon name="i-heroicons-arrow-path" class="animate-spin text-2xl text-gray-400" />
            </div>

            <template v-else>
                <LiveProductListItem v-for="product in products" :key="product.id" :product="product"
                    @select="handleSelect" />

                <div v-if="loading" class="flex justify-center p-2">
                    <UIcon name="i-heroicons-arrow-path" class="animate-spin text-xl text-gray-400" />
                </div>

                <div v-if="products.length === 0 && !loading" class="text-center text-gray-400 py-8">
                    <p>No products found</p>
                </div>

                <!-- Intersection observer target for infinite scroll could go here -->
                <div v-if="hasMore && !loading" class="p-2 text-center">
                    <UButton size="xs" variant="ghost" @click="() => loadProducts(false)">Load more</UButton>
                </div>
            </template>
        </div>
    </div>
</template>
