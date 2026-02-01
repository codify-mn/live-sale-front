<script setup lang="ts">
definePageMeta({
  layout: 'public'
})

useSeoMeta({
  title: 'Comment Boost - Live худалдааны платформ',
  description:
    'Facebook Live борлуулалтаа хялбархан удирдаж, захиалга, бараа, харилцагчаа нэг дороос хянаарай.'
})

const features = [
  {
    title: 'Захиалгын удирдлага',
    description: 'Бүх захиалгыг нэг дороос хянаж, статусыг шинэчлээрэй.',
    icon: 'i-lucide-clipboard-list'
  },
  {
    title: 'Барааны каталог',
    description: 'Бараа, хувилбар, үнийн мэдээллээ хялбархан удирдаарай.',
    icon: 'i-lucide-package'
  },
  {
    title: 'Дэлгүүрийн самбар',
    description: 'Борлуулалт, орлого, статистик мэдээллийг харна уу.',
    icon: 'i-lucide-layout-dashboard'
  },
  {
    title: 'Харилцагчийн бүртгэл',
    description: 'Харилцагчдын мэдээлэл, худалдан авалтын түүхийг хадгалаарай.',
    icon: 'i-lucide-users'
  }
]

const benefits = [
  {
    title: 'Хаанаас ч удирдаарай',
    description: 'Гар утас, компьютер, таблетаас дэлгүүрээ удирдах боломжтой.',
    icon: 'i-lucide-smartphone'
  },
  {
    title: 'Facebook Live холболт',
    description: 'Live үеийн коммент захиалгыг автоматаар боловсруулна.',
    icon: 'i-lucide-video'
  },
  {
    title: 'Ухаалаг мэдэгдэл',
    description: 'Захиалга, бараа дутагдал, чухал үйл явдлын мэдэгдэл.',
    icon: 'i-lucide-bell'
  }
]

const steps = [
  {
    step: '01',
    title: 'Бүртгүүлэх',
    description: 'Үнэгүй бүртгүүлээд дэлгүүрээ нээгээрэй.'
  },
  {
    step: '02',
    title: 'Бараа нэмэх',
    description: 'Барааны мэдээлэл, зураг, үнээ оруулаарай.'
  },
  {
    step: '03',
    title: 'Борлуулах',
    description: 'Live эхлүүлж, захиалга хүлээн авч эхлээрэй.'
  }
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <HeroBackground />
      <UContainer class="py-24 lg:py-32">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Live худалдааны
            <span class="text-primary">ухаалаг платформ</span>
          </h1>
          <p class="text-lg lg:text-xl text-muted mb-8">
            Facebook Live борлуулалтаа хялбархан удирдаж, захиалга автоматаар хүлээн авч, бизнесээ
            өсгөөрэй.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              to="/dashboard"
              label="Үнэгүй турших"
              size="xl"
              trailing-icon="i-lucide-arrow-right"
            />
            <UButton
              to="/pricing"
              label="Үнийн мэдээлэл"
              size="xl"
              color="neutral"
              variant="outline"
            />
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-muted/30">
      <UContainer>
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">Бүх боломжууд нэг дор</h2>
          <p class="text-muted text-lg">Амжилттай борлуулалт хийхэд хэрэгтэй бүх зүйл</p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <UCard
            v-for="feature in features"
            :key="feature.title"
            class="text-center"
            :ui="{ body: 'p-6' }"
          >
            <div
              class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4"
            >
              <UIcon :name="feature.icon" class="w-6 h-6 text-primary" />
            </div>
            <h3 class="font-semibold mb-2">
              {{ feature.title }}
            </h3>
            <p class="text-sm text-muted">
              {{ feature.description }}
            </p>
          </UCard>
        </div>
      </UContainer>
    </section>

    <!-- Benefits Section -->
    <section class="py-20">
      <UContainer>
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">Яагаад Comment Boost?</h2>
          <p class="text-muted text-lg">Бизнесээ өсгөхөд туслах давуу талууд</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="benefit in benefits" :key="benefit.title" class="text-center p-6">
            <div
              class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4"
            >
              <UIcon :name="benefit.icon" class="w-8 h-8 text-primary" />
            </div>
            <h3 class="text-xl font-semibold mb-2">
              {{ benefit.title }}
            </h3>
            <p class="text-muted">
              {{ benefit.description }}
            </p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- How it works Section -->
    <section class="py-20 bg-muted/30">
      <UContainer>
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">Хэрхэн ажилладаг вэ?</h2>
          <p class="text-muted text-lg">3 энгийн алхамаар эхлээрэй</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="step in steps" :key="step.step" class="relative text-center">
            <div class="text-6xl font-bold text-primary/20 mb-4">
              {{ step.step }}
            </div>
            <h3 class="text-xl font-semibold mb-2">
              {{ step.title }}
            </h3>
            <p class="text-muted">
              {{ step.description }}
            </p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- CTA Section -->
    <section class="py-20">
      <UContainer>
        <div class="relative rounded-3xl bg-primary/5 p-8 lg:p-16 text-center overflow-hidden">
          <LazyStarsBg />
          <h2 class="text-3xl lg:text-4xl font-bold mb-4 relative">Өнөөдөр эхлээрэй</h2>
          <p class="text-lg text-muted mb-8 relative max-w-2xl mx-auto">
            Үнэгүй бүртгүүлж, Live борлуулалтаа дараагийн түвшинд гаргаарай.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center relative">
            <UButton to="/signup" label="Үнэгүй эхлэх" size="xl" />
            <UButton to="/docs" label="Дэлгэрэнгүй" size="xl" color="neutral" variant="outline" />
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>
