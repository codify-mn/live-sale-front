<script setup lang="ts">
// Animated floating particles background - subtle and modern
const particles = ref<{ x: number; y: number; size: number; delay: number; duration: number }[]>([])

onMounted(() => {
    particles.value = Array.from({ length: 30 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 15
    }))
})
</script>

<template>
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <!-- Floating particles -->
        <div
            v-for="(particle, index) in particles"
            :key="index"
            class="absolute rounded-full bg-white/10 dark:bg-white/20"
            :style="{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`
            }"
            :class="index % 2 === 0 ? 'float' : 'float-slow'"
        />
    </div>
</template>
