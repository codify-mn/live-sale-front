<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Шинэ нууц үг - Singulatim'
})

const route = useRoute()
const { resetPassword, isLoading, authError, clearError } = useAuth()

const token = computed(() => route.query.token as string || '')
const isSubmitted = ref(false)
const isInvalidToken = ref(!token.value)

const schema = z.object({
  password: z.string().min(8, 'Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой'),
  confirmPassword: z.string().min(8, 'Нууц үг давтана уу')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Нууц үг таарахгүй байна',
  path: ['confirmPassword']
})

type Schema = z.output<typeof schema>

const state = reactive({
  password: '',
  confirmPassword: ''
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  const success = await resetPassword(token.value, event.data.password)
  if (success) {
    isSubmitted.value = true
  }
}
</script>

<template>
  <UCard class="max-w-sm w-full">
    <template #header>
      <div class="text-center">
        <UIcon
          name="i-lucide-lock-keyhole"
          class="w-12 h-12 text-primary mx-auto mb-4"
        />
        <h1 class="text-2xl font-bold">
          Шинэ нууц үг
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2">
          Шинэ нууц үгээ оруулна уу
        </p>
      </div>
    </template>

    <div class="space-y-4">
      <!-- Invalid Token -->
      <div v-if="isInvalidToken" class="text-center space-y-4">
        <UIcon
          name="i-lucide-alert-triangle"
          class="w-16 h-16 text-amber-500 mx-auto"
        />
        <p class="text-gray-600 dark:text-gray-300">
          Буруу эсвэл хугацаа дууссан холбоос байна.
        </p>
        <UButton
          to="/forgot-password"
          variant="outline"
          block
        >
          Дахин холбоос авах
        </UButton>
      </div>

      <!-- Success Message -->
      <div v-else-if="isSubmitted" class="text-center space-y-4">
        <UIcon
          name="i-lucide-check-circle"
          class="w-16 h-16 text-green-500 mx-auto"
        />
        <p class="text-gray-600 dark:text-gray-300">
          Нууц үг амжилттай солигдлоо!
        </p>
        <UButton
          to="/login"
          block
        >
          Нэвтрэх
        </UButton>
      </div>

      <!-- Form -->
      <template v-else>
        <!-- Error Alert -->
        <UAlert
          v-if="authError"
          color="error"
          variant="subtle"
          :title="authError"
          icon="i-lucide-alert-circle"
          :close-button="{ icon: 'i-lucide-x', color: 'error', variant: 'link', padded: false }"
          @close="clearError"
        />

        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField label="Шинэ нууц үг" name="password">
            <UInput
              v-model="state.password"
              type="password"
              placeholder="Хамгийн багадаа 8 тэмдэгт"
              icon="i-lucide-lock"
              size="lg"
            />
          </UFormField>

          <UFormField label="Нууц үг давтах" name="confirmPassword">
            <UInput
              v-model="state.confirmPassword"
              type="password"
              placeholder="Нууц үг давтана уу"
              icon="i-lucide-lock"
              size="lg"
            />
          </UFormField>

          <UButton
            type="submit"
            block
            size="lg"
            :loading="isLoading"
          >
            Нууц үг солих
          </UButton>
        </UForm>

        <div class="text-center">
          <NuxtLink
            to="/login"
            class="text-sm text-primary hover:underline"
          >
            Нэвтрэх хуудас руу буцах
          </NuxtLink>
        </div>
      </template>
    </div>
  </UCard>
</template>
