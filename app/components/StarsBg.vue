<script setup lang="ts">
const stars = ref<{ x: number, y: number, size: number, opacity: number }[]>([])

onMounted(() => {
  stars.value = Array.from({ length: 100 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.2
  }))
})
</script>

<template>
  <div class="absolute inset-0 -z-10 overflow-hidden dark:block hidden">
    <div
      v-for="(star, index) in stars"
      :key="index"
      class="absolute rounded-full bg-white animate-pulse"
      :style="{
        left: `${star.x}%`,
        top: `${star.y}%`,
        width: `${star.size}px`,
        height: `${star.size}px`,
        opacity: star.opacity,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 2}s`
      }"
    />
  </div>
</template>
