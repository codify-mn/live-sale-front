<script setup lang="ts">
const columns = [
  {
    label: 'Бүтээгдэхүүн',
    children: [
      { label: 'Боломжууд', to: '/#features' },
      { label: 'Үнийн мэдээлэл', to: '/pricing' },
      { label: 'Тусламж', to: '/docs' }
    ]
  },
  {
    label: 'Компани',
    children: [
      { label: 'Бидний тухай', to: '/about' },
      { label: 'Холбоо барих', to: '/contact' },
      { label: 'Нууцлалын бодлого', to: '/privacy' }
    ]
  },
  {
    label: 'Нөөц',
    children: [
      { label: 'Эхлэх заавар', to: '/docs/getting-started' },
      { label: 'API баримтжуулалт', to: '/docs/api' },
      { label: 'Түгээмэл асуултууд', to: '/pricing#faq' }
    ]
  }
]
</script>

<template>
  <footer class="relative border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50">
    <!-- Subtle gradient decoration -->
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

    <UContainer class="max-w-7xl py-16">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
        <!-- Brand column -->
        <div class="col-span-2 md:col-span-1">
          <NuxtLink to="/" class="flex items-center gap-2.5 mb-4">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center">
              <UIcon name="i-lucide-zap" class="w-5 h-5 text-white" />
            </div>
            <span class="font-bold text-lg text-gray-900 dark:text-white">
              Comment<span class="text-gradient">Boost</span>
            </span>
          </NuxtLink>
          <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
            Live худалдааны ухаалаг платформ. Facebook Live борлуулалтаа хялбархан удирдаж, бизнесээ өсгөөрэй.
          </p>
          <div class="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-all duration-200"
            >
              <UIcon name="i-simple-icons-facebook" class="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950/50 transition-all duration-200"
            >
              <UIcon name="i-simple-icons-instagram" class="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <UIcon name="i-simple-icons-x" class="w-4 h-4" />
            </a>
          </div>
        </div>

        <!-- Link columns -->
        <div v-for="column in columns" :key="column.label">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
            {{ column.label }}
          </h3>
          <ul class="space-y-3">
            <li v-for="item in column.children" :key="item.label">
              <NuxtLink
                :to="item.to"
                class="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 text-sm transition-colors duration-200"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          &copy; {{ new Date().getFullYear() }} CommentBoost. Бүх эрх хуулиар хамгаалагдсан.
        </p>
        <div class="flex items-center gap-6">
          <NuxtLink to="/terms" class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">
            Үйлчилгээний нөхцөл
          </NuxtLink>
          <NuxtLink to="/privacy" class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">
            Нууцлалын бодлого
          </NuxtLink>
        </div>
      </div>
    </UContainer>
  </footer>
</template>
