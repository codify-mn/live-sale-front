<script setup lang="ts">
definePageMeta({
  layout: 'public'
})

useSeoMeta({
  title: 'CommentBoost - Live худалдааны ухаалаг платформ',
  description: 'Facebook Live борлуулалтаа хялбархан удирдаж, захиалга автоматаар хүлээн авч, бизнесээ өсгөөрэй.'
})

const features = [
  {
    title: 'Автомат захиалга',
    description: 'Live коммент дээрээс захиалгыг автоматаар таньж, боловсруулна.',
    icon: 'i-lucide-message-square-plus',
    color: 'from-primary-500 to-orange-500'
  },
  {
    title: 'Барааны каталог',
    description: 'Бараа, хувилбар, үнийн мэдээллээ нэг дороос удирдаарай.',
    icon: 'i-lucide-package',
    color: 'from-pink-500 to-rose-500'
  },
  {
    title: 'Бодит цагийн дашбоард',
    description: 'Борлуулалт, орлого, статистик мэдээллийг шууд харна уу.',
    icon: 'i-lucide-bar-chart-3',
    color: 'from-violet-500 to-purple-500'
  },
  {
    title: 'Олон платформ',
    description: 'Facebook, Instagram, TikTok дээр нэгэн зэрэг борлуулаарай.',
    icon: 'i-lucide-share-2',
    color: 'from-blue-500 to-cyan-500'
  }
]

const stats = [
  { value: '10,000+', label: 'Идэвхтэй худалдаачид' },
  { value: '₮2.5B+', label: 'Боловсруулсан захиалга' },
  { value: '99.9%', label: 'Uptime баталгаа' },
  { value: '< 1s', label: 'Захиалга боловсруулах' }
]

const steps = [
  {
    step: '01',
    title: 'Бүртгүүлэх',
    description: 'Үнэгүй бүртгүүлээд дэлгүүрээ 2 минутад нээгээрэй.',
    icon: 'i-lucide-user-plus'
  },
  {
    step: '02',
    title: 'Бараа нэмэх',
    description: 'Барааны мэдээлэл, зураг, үнээ оруулж, каталог бүрдүүлээрэй.',
    icon: 'i-lucide-package-plus'
  },
  {
    step: '03',
    title: 'Live эхлүүлэх',
    description: 'Facebook хуудсаа холбоод шууд борлуулж эхлээрэй.',
    icon: 'i-lucide-play-circle'
  }
]

const testimonials = [
  {
    quote: 'CommentBoost ашиглаж эхэлснээс хойш захиалгын боловсруулалтанд зарцуулах цаг 80%-иар багассан.',
    author: 'Б. Сарангэрэл',
    role: 'Гоо сайхны дэлгүүр эзэмшигч',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
  },
  {
    quote: 'Live үеэр захиалга авахад хамгийн хялбар платформ. Хэрэглэгчийн дэмжлэг маш сайн.',
    author: 'Д. Болормаа',
    role: 'Хувцасны брэнд эзэмшигч',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bold'
  },
  {
    quote: 'Өмнө нь Excel дээр захиалга бүртгэдэг байсан. Одоо бүх юм автомат болсон.',
    author: 'Э. Мөнхбат',
    role: 'Электроникийн худалдаачин',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
  }
]

// Intersection observer for animations
const featuresRef = ref<HTMLElement | null>(null)
const stepsRef = ref<HTMLElement | null>(null)
const statsRef = ref<HTMLElement | null>(null)

const featuresVisible = ref(false)
const stepsVisible = ref(false)
const statsVisible = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target === featuresRef.value && entry.isIntersecting) {
          featuresVisible.value = true
        }
        if (entry.target === stepsRef.value && entry.isIntersecting) {
          stepsVisible.value = true
        }
        if (entry.target === statsRef.value && entry.isIntersecting) {
          statsVisible.value = true
        }
      })
    },
    { threshold: 0.1 }
  )

  if (featuresRef.value) observer.observe(featuresRef.value)
  if (stepsRef.value) observer.observe(stepsRef.value)
  if (statsRef.value) observer.observe(statsRef.value)
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden min-h-[90vh] flex items-center">
      <HeroBackground />

      <UContainer class="max-w-7xl py-20 lg:py-32 relative z-10">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <!-- Left: Copy -->
          <div class="text-center lg:text-left">
            <!-- Live badge -->
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6 fade-in-up">
              <span class="live-indicator text-sm font-medium text-red-600 dark:text-red-400">LIVE</span>
              <span class="text-sm text-gray-600 dark:text-gray-400">борлуулалт хялбар болсон</span>
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 fade-in-up fade-in-up-delay-1">
              <span class="text-gray-900 dark:text-white">Live худалдааг</span>
              <br />
              <span class="text-gradient">автоматжуулаарай</span>
            </h1>

            <p class="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 fade-in-up fade-in-up-delay-2">
              Facebook Live коммент дээрээс захиалга автоматаар хүлээн авч,
              бизнесээ дараагийн түвшинд гаргаарай.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start fade-in-up fade-in-up-delay-3">
              <UButton
                to="/login?mode=register"
                size="xl"
                class="bg-gradient-to-r from-primary-500 to-pink-500 hover:from-primary-600 hover:to-pink-600 border-0 shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 btn-shine"
              >
                <span>Үнэгүй эхлэх</span>
                <UIcon name="i-lucide-arrow-right" class="w-5 h-5 ml-2" />
              </UButton>
              <UButton
                to="#demo"
                size="xl"
                color="neutral"
                variant="outline"
                class="group"
              >
                <UIcon name="i-lucide-play" class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                <span>Демо үзэх</span>
              </UButton>
            </div>

            <!-- Trust badges -->
            <div class="flex flex-wrap gap-4 justify-center lg:justify-start mt-10 fade-in-up fade-in-up-delay-4">
              <div class="trust-badge">
                <UIcon name="i-lucide-shield-check" class="w-4 h-4 text-green-500" />
                <span>Аюулгүй төлбөр</span>
              </div>
              <div class="trust-badge">
                <UIcon name="i-lucide-clock" class="w-4 h-4 text-primary-500" />
                <span>14 хоног үнэгүй</span>
              </div>
              <div class="trust-badge">
                <UIcon name="i-lucide-credit-card" class="w-4 h-4 text-violet-500" />
                <span>Карт шаардлагагүй</span>
              </div>
            </div>
          </div>

          <!-- Right: Product mockup -->
          <div class="relative fade-in-up fade-in-up-delay-2">
            <div class="relative">
              <!-- Glow effect behind mockup -->
              <div class="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-pink-500/20 to-violet-500/20 blur-3xl rounded-3xl" />

              <!-- Dashboard mockup card -->
              <div class="relative glass-card rounded-2xl p-2 shadow-2xl">
                <div class="bg-gray-900 rounded-xl overflow-hidden">
                  <!-- Browser chrome -->
                  <div class="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
                    <div class="flex gap-1.5">
                      <div class="w-3 h-3 rounded-full bg-red-500" />
                      <div class="w-3 h-3 rounded-full bg-yellow-500" />
                      <div class="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div class="flex-1 mx-4">
                      <div class="bg-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-400 text-center">
                        app.commentboost.mn
                      </div>
                    </div>
                  </div>

                  <!-- Dashboard preview -->
                  <div class="p-4 space-y-4">
                    <!-- Stats row -->
                    <div class="grid grid-cols-3 gap-3">
                      <div class="bg-gray-800 rounded-lg p-3">
                        <div class="text-xs text-gray-500 mb-1">Өнөөдөр</div>
                        <div class="text-lg font-bold text-white">₮2.4M</div>
                        <div class="text-xs text-green-400">+12%</div>
                      </div>
                      <div class="bg-gray-800 rounded-lg p-3">
                        <div class="text-xs text-gray-500 mb-1">Захиалга</div>
                        <div class="text-lg font-bold text-white">156</div>
                        <div class="text-xs text-green-400">+8%</div>
                      </div>
                      <div class="bg-gray-800 rounded-lg p-3">
                        <div class="text-xs text-gray-500 mb-1">Live үзэгч</div>
                        <div class="text-lg font-bold text-primary-400 live-indicator pl-4">847</div>
                      </div>
                    </div>

                    <!-- Orders list preview -->
                    <div class="bg-gray-800 rounded-lg p-3">
                      <div class="flex items-center justify-between mb-3">
                        <span class="text-sm font-medium text-white">Сүүлийн захиалгууд</span>
                        <span class="text-xs text-primary-400">Бүгдийг харах</span>
                      </div>
                      <div class="space-y-2">
                        <div class="flex items-center justify-between py-2 border-b border-gray-700">
                          <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-pink-500" />
                            <div>
                              <div class="text-sm text-white">Болормаа Д.</div>
                              <div class="text-xs text-gray-500">2 бараа</div>
                            </div>
                          </div>
                          <div class="text-sm font-medium text-white">₮45,000</div>
                        </div>
                        <div class="flex items-center justify-between py-2">
                          <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500" />
                            <div>
                              <div class="text-sm text-white">Батболд Э.</div>
                              <div class="text-xs text-gray-500">1 бараа</div>
                            </div>
                          </div>
                          <div class="text-sm font-medium text-white">₮28,000</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Floating notification cards -->
              <div class="absolute -right-4 top-20 float-delay-1 hidden lg:block">
                <div class="glass-card rounded-xl p-3 shadow-lg flex items-center gap-3 max-w-[200px]">
                  <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <UIcon name="i-lucide-check" class="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">Шинэ захиалга!</div>
                    <div class="text-xs text-gray-500">₮45,000 - Болормаа</div>
                  </div>
                </div>
              </div>

              <div class="absolute -left-4 bottom-20 float hidden lg:block">
                <div class="glass-card rounded-xl p-3 shadow-lg">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
                      <UIcon name="i-lucide-trending-up" class="w-4 h-4 text-primary-500" />
                    </div>
                    <div>
                      <div class="text-xs text-gray-500">Өнөөдрийн өсөлт</div>
                      <div class="text-lg font-bold text-green-500">+24%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Stats Section -->
    <section ref="statsRef" class="py-16 bg-gray-50 dark:bg-gray-900/50 border-y border-gray-200 dark:border-gray-800">
      <UContainer class="max-w-7xl">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div
            v-for="(stat, index) in stats"
            :key="stat.label"
            class="text-center"
            :class="{ 'fade-in-up': statsVisible, [`fade-in-up-delay-${index + 1}`]: statsVisible }"
          >
            <div class="text-3xl md:text-4xl font-extrabold text-gradient mb-2">
              {{ stat.value }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Features Section -->
    <section id="features" ref="featuresRef" class="py-24">
      <UContainer class="max-w-7xl">
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
            <UIcon name="i-lucide-sparkles" class="w-4 h-4 text-primary-500" />
            <span class="text-sm font-medium text-primary-600 dark:text-primary-400">Боломжууд</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Бүх хэрэгтэй зүйл нэг дор
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Live худалдаа хийхэд шаардлагатай бүх функцууд нэг платформ дээр
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(feature, index) in features"
            :key="feature.title"
            class="group relative p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 card-hover"
            :class="{ 'fade-in-up': featuresVisible, [`fade-in-up-delay-${index + 1}`]: featuresVisible }"
          >
            <div
              class="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center bg-gradient-to-br transition-transform duration-300 group-hover:scale-110"
              :class="feature.color"
            >
              <UIcon :name="feature.icon" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ feature.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- How It Works Section -->
    <section ref="stepsRef" class="py-24 bg-gray-50 dark:bg-gray-900/50">
      <UContainer class="max-w-7xl">
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <UIcon name="i-lucide-route" class="w-4 h-4 text-violet-500" />
            <span class="text-sm font-medium text-violet-600 dark:text-violet-400">Хэрхэн ажилладаг</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            3 энгийн алхамаар эхлээрэй
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Бүртгүүлж, тохируулаад, борлуулж эхлээрэй. Бүгд хялбар.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 relative">
          <!-- Connector line -->
          <div class="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary-500 via-pink-500 to-violet-500 opacity-30" />

          <div
            v-for="(step, index) in steps"
            :key="step.step"
            class="relative text-center"
            :class="{ 'fade-in-up': stepsVisible, [`fade-in-up-delay-${index + 1}`]: stepsVisible }"
          >
            <!-- Step number -->
            <div class="relative inline-flex mb-6">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <UIcon :name="step.icon" class="w-8 h-8 text-white" />
              </div>
              <div class="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-gray-900 border-2 border-primary-500 flex items-center justify-center">
                <span class="text-xs font-bold text-primary-500">{{ step.step }}</span>
              </div>
            </div>

            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ step.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
              {{ step.description }}
            </p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Testimonials Section -->
    <section class="py-24">
      <UContainer class="max-w-7xl">
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6">
            <UIcon name="i-lucide-heart" class="w-4 h-4 text-pink-500" />
            <span class="text-sm font-medium text-pink-600 dark:text-pink-400">Хэрэглэгчдийн сэтгэгдэл</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Мянга мянган худалдаачид итгэдэг
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div
            v-for="testimonial in testimonials"
            :key="testimonial.author"
            class="p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 card-hover"
          >
            <div class="testimonial-card">
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {{ testimonial.quote }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <img
                :src="testimonial.avatar"
                :alt="testimonial.author"
                class="w-12 h-12 rounded-full bg-gray-100"
              />
              <div>
                <div class="font-semibold text-gray-900 dark:text-white">
                  {{ testimonial.author }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ testimonial.role }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- CTA Section -->
    <section class="py-24">
      <UContainer class="max-w-7xl">
        <div class="relative rounded-3xl overflow-hidden">
          <!-- Animated gradient background -->
          <div class="absolute inset-0 bg-gradient-animated opacity-90" />

          <!-- Content -->
          <div class="relative px-8 py-16 md:px-16 md:py-24 text-center">
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Өнөөдөр үнэгүй эхлээрэй
            </h2>
            <p class="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              14 хоногийн үнэгүй туршилт. Карт шаардлагагүй.
              <br />
              Live борлуулалтаа дараагийн түвшинд гаргаарай.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <UButton
                to="/login?mode=register"
                size="xl"
                class="bg-white text-gray-900 hover:bg-gray-100 border-0 shadow-xl font-semibold"
              >
                <span>Үнэгүй бүртгүүлэх</span>
                <UIcon name="i-lucide-arrow-right" class="w-5 h-5 ml-2" />
              </UButton>
              <UButton
                to="/pricing"
                size="xl"
                variant="outline"
                class="border-white/30 text-white hover:bg-white/10"
              >
                Үнийн мэдээлэл
              </UButton>
            </div>

            <!-- Floating shapes -->
            <div class="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/10 float" />
            <div class="absolute bottom-10 right-10 w-16 h-16 rounded-2xl bg-white/10 float-delay-1 rotate-12" />
            <div class="absolute top-1/2 right-20 w-12 h-12 rounded-xl bg-white/10 float-delay-2 -rotate-6" />
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>
