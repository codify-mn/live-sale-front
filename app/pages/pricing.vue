<script setup lang="ts">
definePageMeta({
  layout: 'public'
})

useSeoMeta({
  title: 'Үнийн мэдээлэл - Singulatim',
  description: 'Энгийн, ил тод үнийн бодлого. Бүх хэмжээний бизнест тохирсон багцууд.'
})

const isYearly = ref(false)

const plans = [
  {
    title: 'Үнэгүй',
    description: 'Эхлэхэд тохиромжтой',
    price: {
      month: '₮0',
      year: '₮0'
    },
    features: [
      '100 хүртэлх бараа',
      'Сард 500 захиалга',
      'Үндсэн тайлан',
      'Имэйл дэмжлэг'
    ],
    button: {
      label: 'Эхлэх',
      to: '/dashboard',
      color: 'neutral' as const,
      variant: 'outline' as const
    }
  },
  {
    title: 'Про',
    description: 'Өсөж буй бизнест',
    price: {
      month: '₮49,000',
      year: '₮490,000'
    },
    features: [
      'Хязгааргүй бараа',
      'Хязгааргүй захиалга',
      'Дэлгэрэнгүй тайлан',
      'Тэргүүлэх дэмжлэг',
      'Facebook Live холболт',
      'Өөрийн лого, брэнд'
    ],
    button: {
      label: 'Үнэгүй турших',
      to: '/dashboard'
    },
    highlight: true
  },
  {
    title: 'Байгууллага',
    description: 'Томоохон бизнест',
    price: {
      month: '₮149,000',
      year: '₮1,490,000'
    },
    features: [
      'Про багцын бүх боломж',
      'Олон дэлгүүр удирдах',
      'API хандалт',
      'Тусгай менежер',
      'SLA баталгаа',
      'Тусгай интеграц'
    ],
    button: {
      label: 'Холбоо барих',
      to: '/dashboard',
      color: 'neutral' as const,
      variant: 'outline' as const
    }
  }
]

const faq = [
  {
    label: 'Багцаа сольж болох уу?',
    content: 'Тийм, та хүссэн үедээ багцаа шинэчлэх эсвэл бууруулах боломжтой. Өөрчлөлт шууд хүчин төгөлдөр болно.'
  },
  {
    label: 'Ямар төлбөрийн хэрэгсэл хүлээн авдаг вэ?',
    content: 'Бид QPay, банкны шилжүүлэг, картын төлбөр хүлээн авдаг.'
  },
  {
    label: 'Үнэгүй туршилт байгаа юу?',
    content: 'Тийм, бүх төлбөртэй багц 14 хоногийн үнэгүй туршилттай. Карт шаардлагагүй.'
  },
  {
    label: 'Хязгаараа хэтрүүлбэл яах вэ?',
    content: 'Хязгаартаа ойртож байгаа тухай мэдэгдэл илгээнэ. Та хүссэн үедээ багцаа шинэчилж болно.'
  }
]
</script>

<template>
  <div>
    <section class="py-20">
      <UContainer>
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold mb-4">
            Энгийн, ил тод үнэ
          </h1>
          <p class="text-lg text-muted mb-8">
            Бизнестээ тохирсон багцыг сонгоорой. Бүх багц 14 хоногийн үнэгүй туршилттай.
          </p>
          <UTabs
            :items="[{ label: 'Сараар' }, { label: 'Жилээр', badge: '20% хямд' }]"
            class="justify-center"
            @change="isYearly = $event === 1"
          />
        </div>

        <UPricingPlans>
          <UPricingPlan
            v-for="plan in plans"
            :key="plan.title"
            :title="plan.title"
            :description="plan.description"
            :price="isYearly ? plan.price.year : plan.price.month"
            :cycle="isYearly ? '/жил' : '/сар'"
            :features="plan.features"
            :button="plan.button"
            :highlight="plan.highlight"
          />
        </UPricingPlans>
      </UContainer>
    </section>

    <section class="py-20 bg-muted/30">
      <UContainer>
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">
            Түгээмэл асуултууд
          </h2>
          <p class="text-muted text-lg">
            Асуулт байна уу? Хариулт бэлэн байна.
          </p>
        </div>
        <UAccordion :items="faq" class="max-w-3xl mx-auto" />
      </UContainer>
    </section>
  </div>
</template>
