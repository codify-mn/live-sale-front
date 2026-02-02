<script setup lang="ts">
// Public layout for marketing pages (landing, pricing, etc.)
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <AppHeader />

        <UMain class="flex-1">
            <slot />
        </UMain>

        <AppFooter />
    </div>
</template>
