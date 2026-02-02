<script setup lang="ts">
interface Props {
    padding?: 'none' | 'sm' | 'md' | 'lg'
    hover?: boolean
    clickable?: boolean
}

withDefaults(defineProps<Props>(), {
    padding: 'md',
    hover: false,
    clickable: false
})

const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
}
</script>

<template>
    <div
        class="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-sm shadow-gray-200/50 dark:shadow-gray-950/50"
        :class="[
            paddingClasses[padding],
            hover &&
                'hover:shadow-md hover:shadow-gray-200/60 dark:hover:shadow-gray-950/60 hover:border-white/30 dark:hover:border-gray-700/40 transition-all duration-300',
            clickable && 'cursor-pointer'
        ]"
    >
        <slot />
    </div>
</template>
