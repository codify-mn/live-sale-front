<script setup lang="ts">
interface Props {
  shopName: string
  shopUrl?: string
  logoUrl?: string
}

defineProps<Props>()
</script>

<template>
  <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 p-5">
    <!-- Background decoration -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
    <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

    <div class="relative flex items-center gap-4">
      <!-- Logo -->
      <div class="w-14 h-14 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-lg">
        <img
          v-if="logoUrl"
          :src="logoUrl"
          :alt="shopName"
          class="w-10 h-10 object-contain"
        >
        <UIcon
          v-else
          name="i-lucide-store"
          class="w-7 h-7 text-blue-600"
        />
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-store" class="w-4 h-4 text-white/80" />
          <h3 class="font-bold text-white truncate">
            {{ shopName }}
          </h3>
        </div>

        <a
          v-if="shopUrl"
          :href="shopUrl"
          target="_blank"
          class="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white mt-1 transition-colors"
        >
          <span class="truncate">{{ shopUrl.replace(/^https?:\/\//, '') }}</span>
          <UIcon name="i-lucide-external-link" class="w-3.5 h-3.5 flex-shrink-0" />
        </a>
      </div>
    </div>
  </div>
</template>
