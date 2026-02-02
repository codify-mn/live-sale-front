<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()

const shop = useShop()
</script>

<template>
  <div class="flex items-center gap-3 px-2 py-1.5" :class="collapsed ? 'justify-center' : ''">
    <div
      class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-sm"
    >
      <img
        v-if="shop?.picture"
        :src="shop.picture"
        :alt="shop?.name"
        class="w-full h-full rounded-xl object-cover"
      />
      <UIcon v-else name="i-lucide-store" class="w-4.5 h-4.5 text-white" />
    </div>

    <div v-if="!collapsed" class="flex-1 min-w-0">
      <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
        {{ shop?.name || 'Миний дэлгүүр' }}
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
        Үнэгүй багц
      </p>
    </div>
  </div>
</template>
