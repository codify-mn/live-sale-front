<script setup lang="ts">
import type { LiveSale } from '~/types'

const live = inject<LiveSale>('live')
</script>
<template>
  <div
    class="flex-1 overflow-y-auto p-2 border border-gray-200 dark:border-gray-800 mx-2 rounded-lg"
  >
    <template v-if="!live?.comments || live?.comments?.length === 0">
      <div class="flex items-center justify-center h-full">
        <p class="text-gray-500">Сэтгэгдэл байхгүй (not implemented hha)</p>
      </div>
    </template>
    <template v-else>
      <div v-for="comment in live?.comments" :key="comment.id">
        {{ comment }}
      </div>
    </template>
  </div>
</template>
