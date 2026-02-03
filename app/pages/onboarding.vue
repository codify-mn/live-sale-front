<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Дэлгүүр үүсгэх - Comment Boost'
})

const config = useRuntimeConfig()
const toast = useToast()
const { user, fetchUser } = useAuth()

const isSubmitting = ref(false)
const currentStep = ref(1)
const totalSteps = 3

const steps = [
  { number: 1, label: 'Дэлгүүрийн мэдээлэл', icon: 'i-lucide-store' },
  { number: 2, label: 'Төлбөрийн мэдээлэл', icon: 'i-lucide-credit-card' },
  { number: 3, label: 'Хүргэлтийн тохиргоо', icon: 'i-lucide-truck' }
]

// Step 1 schema
const step1Schema = z.object({
  shop_name: z.string().min(2, 'Дэлгүүрийн нэр хамгийн багадаа 2 тэмдэгт байх ёстой')
})

// Full state
const state = reactive({
  shop_name: user.value ? `${user.value.first_name}-ийн дэлгүүр` : '',
  phone_number: '',
  description: '',
  payment_method: 'cash',
  bank_name: '',
  bank_account_number: '',
  bank_account_name: '',
  delivery_fee: 0,
  delivery_note: '',
  free_delivery_over: 0
})

const paymentMethods = [
  {
    label: 'Бэлэн мөнгө',
    value: 'cash',
    icon: 'i-lucide-banknote',
    description: 'Бэлнээр төлбөр хүлээн авна'
  },
  {
    label: 'Банкны шилжүүлэг',
    value: 'bank_transfer',
    icon: 'i-lucide-landmark',
    description: 'Дансаар шилжүүлэх'
  },
  {
    label: 'QPay',
    value: 'qpay',
    icon: 'i-lucide-smartphone',
    description: 'QPay-ээр төлбөр хүлээн авна'
  }
]

const banks = [
  { label: 'Хаан банк', value: 'Хаан банк' },
  { label: 'Худалдаа хөгжлийн банк', value: 'Худалдаа хөгжлийн банк' },
  { label: 'Голомт банк', value: 'Голомт банк' },
  { label: 'Төрийн банк', value: 'Төрийн банк' },
  { label: 'Хас банк', value: 'Хас банк' },
  { label: 'Богд банк', value: 'Богд банк' }
]

const showBankFields = computed(() => state.payment_method === 'bank_transfer')

const slideDirection = ref<'left' | 'right'>('left')

function nextStep() {
  if (currentStep.value === 1) {
    const result = step1Schema.safeParse({ shop_name: state.shop_name })
    if (!result.success) {
      toast.add({
        title: 'Алдаа',
        description: result.error.errors[0]?.message || 'Мэдээллээ шалгана уу',
        color: 'error'
      })
      return
    }
  }
  if (currentStep.value < totalSteps) {
    slideDirection.value = 'left'
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    slideDirection.value = 'right'
    currentStep.value--
  }
}

async function onSubmit() {
  isSubmitting.value = true

  try {
    await $fetch(`${config.public.apiUrl}/api/onboarding`, {
      method: 'POST',
      credentials: 'include',
      body: {
        shop_name: state.shop_name,
        phone_number: state.phone_number,
        description: state.description,
        payment_method: state.payment_method,
        bank_name: state.bank_name,
        bank_account_number: state.bank_account_number,
        bank_account_name: state.bank_account_name,
        delivery_fee: state.delivery_fee,
        delivery_note: state.delivery_note,
        free_delivery_over: state.free_delivery_over
      }
    })

    toast.add({
      title: 'Амжилттай!',
      description: 'Таны дэлгүүр үүслээ',
      color: 'success'
    })

    await fetchUser()
    navigateTo('/dashboard')
  } catch (err: any) {
    toast.add({
      title: 'Алдаа гарлаа',
      description: err.data?.message || 'Дэлгүүр үүсгэхэд алдаа гарлаа',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
  >
    <!-- Background decorations -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"
      />
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"
      />
    </div>

    <div class="relative w-full max-w-lg">
      <!-- Progress stepper -->
      <div class="mb-8">
        <div class="flex items-center justify-between relative">
          <!-- Progress line background -->
          <div
            class="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-800 mx-12"
          />
          <!-- Progress line active -->
          <div
            class="absolute top-5 left-0 h-0.5 bg-primary-500 mx-16 transition-all duration-500 ease-out"
            :style="{
              width: `calc(${((currentStep - 1) / (totalSteps - 1)) * 100}% - ${(currentStep-1)*4}rem)`
            }"
          />

          <div
            v-for="step in steps"
            :key="step.number"
            class="relative z-10 flex flex-col items-center gap-2"
          >
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              :class="[
                currentStep >= step.number
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white dark:bg-gray-800 text-gray-400 border-2 border-gray-200 dark:border-gray-700'
              ]"
            >
              <UIcon
                v-if="currentStep > step.number"
                name="i-lucide-check"
                class="w-5 h-5"
              />
              <UIcon
                v-else
                :name="step.icon"
                class="w-5 h-5"
              />
            </div>
            <span
              class="text-xs font-medium whitespace-nowrap transition-colors duration-300"
              :class="
                currentStep >= step.number
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-400 dark:text-gray-500'
              "
            >
              {{ step.label }}
            </span>
          </div>
        </div>
      </div>

      <!-- Glass card -->
      <div
        class="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl shadow-gray-200/50 dark:shadow-gray-950/50 overflow-hidden"
      >
        <!-- Header -->
        <div class="px-8 pt-8 pb-4">
          <Transition
            :name="slideDirection === 'left' ? 'slide-left' : 'slide-right'"
            mode="out-in"
          >
            <div
              v-if="currentStep === 1"
              key="header-1"
              class="text-center"
            >
              <div
                class="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4"
              >
                <UIcon
                  name="i-lucide-store"
                  class="w-7 h-7 text-primary-500"
                />
              </div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                Дэлгүүрээ үүсгээрэй
              </h1>
              <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                Дэлгүүрийнхээ үндсэн мэдээллийг оруулна уу
              </p>
            </div>

            <div
              v-else-if="currentStep === 2"
              key="header-2"
              class="text-center"
            >
              <div
                class="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4"
              >
                <UIcon
                  name="i-lucide-credit-card"
                  class="w-7 h-7 text-primary-500"
                />
              </div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                Төлбөрийн мэдээлэл
              </h1>
              <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                Хэрхэн төлбөр хүлээн авахаа сонгоно уу
              </p>
            </div>

            <div
              v-else
              key="header-3"
              class="text-center"
            >
              <div
                class="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4"
              >
                <UIcon
                  name="i-lucide-truck"
                  class="w-7 h-7 text-primary-500"
                />
              </div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                Хүргэлтийн тохиргоо
              </h1>
              <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                Хүргэлтийн нөхцлөө тохируулна уу
              </p>
            </div>
          </Transition>
        </div>

        <!-- Form content -->
        <div class="px-8 pb-8">
          <Transition
            :name="slideDirection === 'left' ? 'slide-left' : 'slide-right'"
            mode="out-in"
          >
            <!-- Step 1: Shop Info -->
            <div
              v-if="currentStep === 1"
              key="step-1"
              class="space-y-4"
            >
              <UFormField
                label="Дэлгүүрийн нэр"
                required
              >
                <UInput
                  v-model="state.shop_name"
                  placeholder="Миний дэлгүүр"
                  size="lg"
                  icon="i-lucide-store"
                />
              </UFormField>

              <UFormField label="Утасны дугаар">
                <UInput
                  v-model="state.phone_number"
                  placeholder="99001122"
                  size="lg"
                  icon="i-lucide-phone"
                />
              </UFormField>

              <UFormField label="Тайлбар">
                <UTextarea
                  v-model="state.description"
                  placeholder="Дэлгүүрийнхээ тухай товч тайлбар..."
                  :rows="3"
                />
              </UFormField>
            </div>

            <!-- Step 2: Payment Info -->
            <div
              v-else-if="currentStep === 2"
              key="step-2"
              class="space-y-4"
            >
              <UFormField label="Төлбөрийн хэлбэр">
                <div class="space-y-2">
                  <label
                    v-for="method in paymentMethods"
                    :key="method.value"
                    class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200"
                    :class="[
                      state.payment_method === method.value
                        ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 ring-1 ring-primary-500/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    ]"
                  >
                    <input
                      v-model="state.payment_method"
                      type="radio"
                      :value="method.value"
                      class="sr-only"
                    >
                    <div
                      class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      :class="
                        state.payment_method === method.value
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                      "
                    >
                      <UIcon
                        :name="method.icon"
                        class="w-5 h-5"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p
                        class="text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        {{ method.label }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ method.description }}
                      </p>
                    </div>
                    <div
                      class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                      :class="
                        state.payment_method === method.value
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300 dark:border-gray-600'
                      "
                    >
                      <div
                        v-if="state.payment_method === method.value"
                        class="w-2 h-2 rounded-full bg-white"
                      />
                    </div>
                  </label>
                </div>
              </UFormField>

              <Transition name="expand">
                <div
                  v-if="showBankFields"
                  class="space-y-4 pt-2"
                >
                  <UFormField label="Банкны нэр">
                    <USelect
                      v-model="state.bank_name"
                      :items="banks"
                      value-key="value"
                      placeholder="Банк сонгох"
                      size="lg"
                    />
                  </UFormField>

                  <UFormField label="Дансны дугаар">
                    <UInput
                      v-model="state.bank_account_number"
                      placeholder="1234567890"
                      size="lg"
                      icon="i-lucide-hash"
                    />
                  </UFormField>

                  <UFormField label="Данс эзэмшигчийн нэр">
                    <UInput
                      v-model="state.bank_account_name"
                      placeholder="Баатар Дорж"
                      size="lg"
                      icon="i-lucide-user"
                    />
                  </UFormField>
                </div>
              </Transition>
            </div>

            <!-- Step 3: Delivery Settings -->
            <div
              v-else
              key="step-3"
              class="space-y-4"
            >
              <UFormField label="Хүргэлтийн төлбөр (₮)">
                <UInput
                  v-model.number="state.delivery_fee"
                  type="number"
                  placeholder="5000"
                  size="lg"
                  icon="i-lucide-banknote"
                >
                  <template #trailing>
                    <span class="text-gray-400 text-sm">₮</span>
                  </template>
                </UInput>
              </UFormField>

              <UFormField label="Үнэгүй хүргэлтийн босго (₮)">
                <UInput
                  v-model.number="state.free_delivery_over"
                  type="number"
                  placeholder="50000"
                  size="lg"
                  icon="i-lucide-gift"
                >
                  <template #trailing>
                    <span class="text-gray-400 text-sm">₮</span>
                  </template>
                </UInput>
                <template #hint>
                  <span class="text-xs text-gray-400">0 бол идэвхгүй</span>
                </template>
              </UFormField>

              <UFormField label="Хүргэлтийн мэдээлэл">
                <UTextarea
                  v-model="state.delivery_note"
                  placeholder="Жишээ: Улаанбаатар хот дотор 24 цагийн дотор хүргэнэ..."
                  :rows="3"
                />
              </UFormField>
            </div>
          </Transition>

          <!-- Navigation buttons -->
          <div class="flex items-center justify-between mt-8 gap-3">
            <UButton
              v-if="currentStep > 1"
              variant="ghost"
              color="neutral"
              icon="i-lucide-arrow-left"
              @click="prevStep"
            >
              Өмнөх
            </UButton>
            <div v-else />

            <div class="flex items-center gap-3">
              <UButton
                v-if="currentStep > 1 && currentStep < totalSteps"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="currentStep++"
              >
                Дараа тохируулах
              </UButton>

              <UButton
                v-if="currentStep < totalSteps"
                trailing-icon="i-lucide-arrow-right"
                size="lg"
                @click="nextStep"
              >
                Дараах
              </UButton>

              <UButton
                v-else
                size="lg"
                icon="i-lucide-rocket"
                :loading="isSubmitting"
                @click="onSubmit"
              >
                Дэлгүүр үүсгэх
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Step indicator -->
      <p class="text-center text-sm text-gray-400 dark:text-gray-500 mt-6">
        Алхам {{ currentStep }} / {{ totalSteps }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.3s ease-out;
}

.slide-left-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.slide-left-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

.slide-right-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.slide-right-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.expand-enter-active,
.expand-leave-active {
    transition: all 0.3s ease-out;
    overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
    opacity: 0;
    max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
    max-height: 500px;
}
</style>
