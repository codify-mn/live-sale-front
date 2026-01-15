<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Дэлгүүр үүсгэх - Singulatim'
})

const config = useRuntimeConfig()
const toast = useToast()
const { user, fetchUser } = useAuth()

const isSubmitting = ref(false)

const schema = z.object({
  shop_name: z.string().min(2, 'Дэлгүүрийн нэр хамгийн багадаа 2 тэмдэгт байх ёстой'),
  currency: z.string(),
  timezone: z.string()
})

type Schema = z.infer<typeof schema>

const state = reactive<Schema>({
  shop_name: user.value ? `${user.value.first_name}-ийн дэлгүүр` : '',
  currency: 'MNT',
  timezone: 'Asia/Ulaanbaatar'
})

const currencies = [
  { label: 'Монгол төгрөг (MNT)', value: 'MNT' },
  { label: 'Америк доллар (USD)', value: 'USD' },
  { label: 'Евро (EUR)', value: 'EUR' }
]

const timezones = [
  { label: 'Улаанбаатар (GMT+8)', value: 'Asia/Ulaanbaatar' },
  { label: 'Ховд (GMT+7)', value: 'Asia/Hovd' }
]

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true

  try {
    await $fetch(`${config.public.apiUrl}/api/onboarding`, {
      method: 'POST',
      credentials: 'include',
      body: event.data
    })

    toast.add({
      title: 'Амжилттай!',
      description: 'Таны дэлгүүр үүслээ',
      color: 'success'
    })

    // Refresh user data
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
  <UCard class="max-w-md w-full">
    <template #header>
      <div class="text-center">
        <UIcon name="i-lucide-store" class="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 class="text-2xl font-bold">Дэлгүүрээ үүсгээрэй</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2">
          Борлуулалт эхлүүлэхийн өмнө дэлгүүрийнхээ мэдээллийг оруулна уу
        </p>
      </div>
    </template>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Дэлгүүрийн нэр" name="shop_name" required>
        <UInput v-model="state.shop_name" placeholder="Миний дэлгүүр" />
      </UFormField>

      <UFormField label="Валют" name="currency">
        <USelect v-model="state.currency" :items="currencies" value-key="value" />
      </UFormField>

      <UFormField label="Цагийн бүс" name="timezone">
        <USelect v-model="state.timezone" :items="timezones" value-key="value" />
      </UFormField>

      <UButton type="submit" block size="lg" :loading="isSubmitting">
        Дэлгүүр үүсгэх
      </UButton>
    </UForm>
  </UCard>
</template>
