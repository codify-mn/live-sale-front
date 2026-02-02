<script setup lang="ts">
// Auth layout - provides full-screen canvas for auth pages
// Individual pages handle their own layout (split-screen, centered, etc.)
</script>

<template>
    <div class="min-h-screen bg-white dark:bg-gray-950">
        <slot />
    </div>
</template>
