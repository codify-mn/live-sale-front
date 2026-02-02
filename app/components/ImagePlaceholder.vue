<script setup lang="ts">
defineProps<{
    width?: number
    height?: number
}>()
</script>

<template>
    <div
        class="bg-muted rounded-lg flex items-center justify-center"
        :style="{
            width: width ? `${width}px` : '100%',
            height: height ? `${height}px` : '300px'
        }"
    >
        <UIcon name="i-lucide-image" class="size-12 text-muted" />
    </div>
</template>
