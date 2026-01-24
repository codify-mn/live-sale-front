<script setup lang="ts">
import type { Product } from '~/composables/useProducts'

const props = defineProps<{
    product: Product
}>()

const emit = defineEmits<{
    (e: 'select', product: Product): void
}>()

const items = computed(() => [
    [{
        label: 'Edit Product',
        icon: 'i-heroicons-pencil-square',
        to: `/dashboard/products/${props.product.id}`,
        target: '_blank'
    }],
    [{
        label: 'Select on Live',
        icon: 'i-heroicons-cursor-arrow-rays',
        click: () => emit('select', props.product)
    }]
])

const price = computed(() => {
    if (props.product.sale_price) {
        return props.product.sale_price
    }
    return props.product.base_price
})

const formattedPrice = computed(() => {
    return new Intl.NumberFormat('mn-MN', { style: 'currency', currency: 'MNT' }).format(price.value)
})
</script>

<template>
    <div
        class="group relative flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm">
        <div class="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
            <img v-if="product.images && product.images.length > 0" :src="product.images[0]" :alt="product.name"
                class="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-300" />
            <ImagePlaceholder v-else :width="48" :height="48" class="h-full w-full" />
        </div>

        <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {{ product.name }}
            </h4>
            <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ formattedPrice }}
            </p>
        </div>

        <div class="opacity-0 group-hover:opacity-100 transition-opacity">
            <UDropdown :items="items" :popper="{ placement: 'bottom-end' }">
                <UButton color="neutral" variant="ghost" icon="i-heroicons-ellipsis-vertical" size="xs" />
            </UDropdown>
        </div>
    </div>
</template>
