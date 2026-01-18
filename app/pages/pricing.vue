<script setup lang="ts">
import type { Plan } from '~/types/subscription'

definePageMeta({
  layout: 'public'
})

useSeoMeta({
  title: 'Үнийн мэдээлэл - Singulatim',
  description: 'Энгийн, ил тод үнийн бодлого. Бүх хэмжээний бизнест тохирсон багцууд.'
})

const { plans, subscription, loading, fetchPlans, fetchSubscription, startTrial } = useSubscription()
const { isAuthenticated: authCheck } = useAuth()
const toast = useToast()
const router = useRouter()

const isYearly = ref(false)
const startingTrial = ref<string | null>(null)

onMounted(async () => {
  await fetchPlans()
  if (authCheck.value) {
    await fetchSubscription()
  }
})

function formatPrice(price: number): string {
  return price.toLocaleString()
}

function getYearlyDiscount(plan: Plan): number {
  if (plan.monthly_price === 0) return 0
  const fullYearlyPrice = plan.monthly_price * 12
  const discount = ((fullYearlyPrice - plan.yearly_price) / fullYearlyPrice) * 100
  return Math.round(discount)
}

function getPlanFeatures(plan: Plan): { label: string, included: boolean }[] {
  return [
    {
      label: plan.limits.max_products === -1 ? 'Хязгааргүй бараа' : `${plan.limits.max_products} бараа`,
      included: true
    },
    {
      label: plan.limits.max_orders_per_month === -1 ? 'Хязгааргүй захиалга' : `Сард ${plan.limits.max_orders_per_month} захиалга`,
      included: true
    },
    {
      label: plan.limits.max_shops === -1 ? 'Хязгааргүй дэлгүүр' : `${plan.limits.max_shops} дэлгүүр`,
      included: true
    },
    {
      label: plan.limits.max_storage_mb === -1 ? 'Хязгааргүй хадгалах зай' : plan.limits.max_storage_mb >= 1000 ? `${plan.limits.max_storage_mb / 1000} GB хадгалах зай` : `${plan.limits.max_storage_mb} MB хадгалах зай`,
      included: true
    },
    {
      label: 'Facebook Live холболт',
      included: plan.features.facebook_live
    },
    {
      label: 'Дэлгэрэнгүй тайлан',
      included: plan.features.advanced_analytics
    },
    {
      label: 'Өөрийн лого, брэнд',
      included: plan.features.custom_branding
    },
    {
      label: 'Тэргүүлэх дэмжлэг',
      included: plan.features.priority_support
    },
    {
      label: 'API хандалт',
      included: plan.features.api_access
    }
  ]
}

function isPopularPlan(plan: Plan): boolean {
  return plan.slug === 'ultimate'
}

function isCurrentPlan(plan: Plan): boolean {
  return subscription.value?.plan?.slug === plan.slug
}

async function handlePlanSelect(plan: Plan) {
  if (!authCheck.value) {
    router.push('/login?redirect=/pricing')
    return
  }

  if (isCurrentPlan(plan)) {
    return
  }

  if (plan.slug === 'free') {
    router.push('/dashboard')
    return
  }

  startingTrial.value = plan.slug
  try {
    await startTrial(plan.slug)
    toast.add({
      title: 'Амжилттай!',
      description: `${plan.name} багцын ${plan.trial_days} хоногийн туршилт эхэллээ.`,
      icon: 'i-lucide-check',
      color: 'success'
    })
    router.push('/dashboard')
  } catch (e: any) {
    toast.add({
      title: 'Алдаа',
      description: e.data?.error || 'Туршилт эхлүүлэхэд алдаа гарлаа.',
      icon: 'i-lucide-x',
      color: 'error'
    })
  } finally {
    startingTrial.value = null
  }
}

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
    <!-- Hero Section -->
    <section class="py-16 md:py-24">
      <UContainer>
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            Энгийн, ил тод үнэ
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Бизнесийнхээ хэмжээнд тохирсон багцыг сонгоорой. Бүх төлбөртэй багц 14 хоногийн үнэгүй туршилттай.
          </p>

          <!-- Billing Toggle -->
          <div class="inline-flex items-center gap-4 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
            <button
              class="px-6 py-2.5 rounded-full text-sm font-medium transition-all"
              :class="!isYearly ? 'bg-white dark:bg-gray-900 shadow-sm text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
              @click="isYearly = false"
            >
              Сараар
            </button>
            <button
              class="px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2"
              :class="isYearly ? 'bg-white dark:bg-gray-900 shadow-sm text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
              @click="isYearly = true"
            >
              Жилээр
              <span class="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold px-2 py-0.5 rounded-full">
                Хэмнэлттэй
              </span>
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <UIcon name="i-lucide-loader-2" class="w-10 h-10 animate-spin text-gray-400" />
        </div>

        <!-- Pricing Cards -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <div
            v-for="plan in plans"
            :key="plan.slug"
            class="relative flex flex-col rounded-2xl border transition-all duration-300"
            :class="[
              isPopularPlan(plan)
                ? 'border-primary-500 dark:border-primary-400 shadow-xl shadow-primary-500/10 scale-[1.02] z-10'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg',
              isCurrentPlan(plan) ? 'ring-2 ring-green-500' : ''
            ]"
          >
            <!-- Popular Badge -->
            <div
              v-if="isPopularPlan(plan)"
              class="absolute -top-3.5 left-1/2 -translate-x-1/2"
            >
              <span class="inline-flex items-center gap-1 bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                <span>🔥</span> Түгээмэл
              </span>
            </div>

            <!-- Current Plan Badge -->
            <div
              v-if="isCurrentPlan(plan)"
              class="absolute -top-3.5 right-4"
            >
              <span class="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                <UIcon name="i-lucide-check" class="w-3 h-3" /> Одоогийн багц
              </span>
            </div>

            <!-- Card Content -->
            <div class="p-6 flex-1 flex flex-col">
              <!-- Plan Name -->
              <div class="mb-4">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ plan.name }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ plan.description }}
                </p>
              </div>

              <!-- Price -->
              <div class="mb-6">
                <div class="flex items-baseline gap-1">
                  <span class="text-4xl font-bold text-gray-900 dark:text-white">
                    ₮{{ formatPrice(isYearly ? Math.round(plan.yearly_price / 12) : plan.monthly_price) }}
                  </span>
                  <span class="text-gray-500 dark:text-gray-400">/сар</span>
                </div>
                <div v-if="isYearly && plan.monthly_price > 0" class="mt-1 flex items-center gap-2">
                  <span class="text-sm text-gray-400 line-through">
                    ₮{{ formatPrice(plan.monthly_price * 12) }}/жил
                  </span>
                  <span class="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">
                    -{{ getYearlyDiscount(plan) }}%
                  </span>
                </div>
                <div v-if="isYearly && plan.monthly_price > 0" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  ₮{{ formatPrice(plan.yearly_price) }}/жил
                </div>
              </div>

              <!-- Features -->
              <ul class="space-y-3 mb-8 flex-1">
                <li
                  v-for="feature in getPlanFeatures(plan)"
                  :key="feature.label"
                  class="flex items-start gap-2 text-sm"
                >
                  <UIcon
                    :name="feature.included ? 'i-lucide-check' : 'i-lucide-x'"
                    class="w-5 h-5 flex-shrink-0 mt-0.5"
                    :class="feature.included ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'"
                  />
                  <span :class="feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'">
                    {{ feature.label }}
                  </span>
                </li>
              </ul>

              <!-- CTA Button -->
              <UButton
                :color="isPopularPlan(plan) ? 'primary' : 'neutral'"
                :variant="plan.slug === 'free' || isCurrentPlan(plan) ? 'outline' : 'solid'"
                :disabled="isCurrentPlan(plan)"
                :loading="startingTrial === plan.slug"
                block
                size="lg"
                class="font-semibold"
                @click="handlePlanSelect(plan)"
              >
                <template v-if="isCurrentPlan(plan)">
                  Одоогийн багц
                </template>
                <template v-else-if="plan.slug === 'free'">
                  Үнэгүй эхлэх
                </template>
                <template v-else>
                  Багц авах
                </template>
              </UButton>
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="mt-12 text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Бүх төлбөртэй багц 14 хоногийн үнэгүй туршилттай. Карт шаардлагагүй.
          </p>
        </div>
      </UContainer>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 bg-gray-50 dark:bg-gray-900/50">
      <UContainer>
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">
            Түгээмэл асуултууд
          </h2>
          <p class="text-gray-600 dark:text-gray-400 text-lg">
            Асуулт байна уу? Хариулт бэлэн байна.
          </p>
        </div>
        <UAccordion :items="faq" class="max-w-3xl mx-auto" />
      </UContainer>
    </section>

    <!-- CTA Section -->
    <section class="py-16">
      <UContainer>
        <div class="text-center max-w-2xl mx-auto">
          <h2 class="text-2xl font-bold mb-4">
            Тусгай шаардлага байна уу?
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Томоохон бизнест зориулсан тусгай багц авахыг хүсвэл бидэнтэй холбогдоорой.
          </p>
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            icon="i-lucide-mail"
          >
            Холбоо барих
          </UButton>
        </div>
      </UContainer>
    </section>
  </div>
</template>
