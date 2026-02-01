<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Нэвтрэх - Comment Boost'
})

const {
  loginWithFacebook,
  loginWithGoogle,
  loginWithEmail,
  register,
  isLoading,
  authError,
  clearError
} = useAuth()

const isRegisterMode = ref(false)

const loginSchema = z.object({
  email: z.string().email('Зөв имэйл хаяг оруулна уу'),
  password: z.string().min(1, 'Нууц үг оруулна уу')
})

const registerSchema = z.object({
  email: z.string().email('Зөв имэйл хаяг оруулна уу'),
  password: z.string().min(8, 'Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой'),
  first_name: z.string().min(1, 'Нэрээ оруулна уу'),
  last_name: z.string().min(1, 'Овгоо оруулна уу')
})

type LoginSchema = z.output<typeof loginSchema>
type RegisterSchema = z.output<typeof registerSchema>

const loginState = reactive({
  email: '',
  password: ''
})

const registerState = reactive({
  email: '',
  password: '',
  first_name: '',
  last_name: ''
})

const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value
  clearError()
}

const onLoginSubmit = async (event: FormSubmitEvent<LoginSchema>) => {
  const success = await loginWithEmail(event.data)
  if (success) {
    navigateTo('/auth/callback')
  }
}

const onRegisterSubmit = async (event: FormSubmitEvent<RegisterSchema>) => {
  const success = await register(event.data)
  if (success) {
    navigateTo('/auth/callback')
  }
}
</script>

<template>
  <UCard class="max-w-sm w-full">
    <template #header>
      <div class="text-center">
        <UIcon name="i-lucide-store" class="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 class="text-2xl font-bold">
          {{ isRegisterMode ? 'Бүртгүүлэх' : 'Тавтай морил' }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2">
          {{ isRegisterMode ? 'Шинэ хаяг үүсгэх' : 'Өөрийн хаягаар нэвтрэх' }}
        </p>
      </div>
    </template>

    <div class="space-y-4">
      <!-- OAuth Buttons -->
      <div class="space-y-3">
        <UButton
          block
          size="lg"
          color="neutral"
          variant="outline"
          icon="i-simple-icons-google"
          :loading="isLoading"
          @click="loginWithGoogle"
        >
          Google-ээр үргэлжлүүлэх
        </UButton>

        <UButton
          block
          size="lg"
          color="neutral"
          variant="outline"
          icon="i-simple-icons-facebook"
          :loading="isLoading"
          @click="loginWithFacebook"
        >
          Facebook-ээр үргэлжлүүлэх
        </UButton>
      </div>

      <!-- Divider -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white dark:bg-gray-900 text-gray-500">эсвэл</span>
        </div>
      </div>

      <!-- Error Alert -->
      <UAlert
        v-if="authError"
        color="error"
        variant="subtle"
        :title="authError"
        icon="i-lucide-alert-circle"
        :close-button="{
          icon: 'i-lucide-x',
          color: 'error',
          variant: 'link',
          padded: false
        }"
        @close="clearError"
      />

      <!-- Login Form -->
      <UForm
        v-if="!isRegisterMode"
        :schema="loginSchema"
        :state="loginState"
        class="space-y-4"
        @submit="onLoginSubmit"
      >
        <UFormField label="Имэйл" name="email">
          <UInput
            v-model="loginState.email"
            type="email"
            placeholder="you@example.com"
            icon="i-lucide-mail"
            size="lg"
          />
        </UFormField>

        <UFormField label="Нууц үг" name="password">
          <UInput
            v-model="loginState.password"
            type="password"
            placeholder="Нууц үг"
            icon="i-lucide-lock"
            size="lg"
          />
        </UFormField>

        <div class="flex justify-end">
          <NuxtLink to="/forgot-password" class="text-sm text-primary hover:underline">
            Нууц үг мартсан?
          </NuxtLink>
        </div>

        <UButton type="submit" block size="lg" :loading="isLoading"> Нэвтрэх </UButton>
      </UForm>

      <!-- Register Form -->
      <UForm
        v-else
        :schema="registerSchema"
        :state="registerState"
        class="space-y-4"
        @submit="onRegisterSubmit"
      >
        <div class="grid grid-cols-2 gap-3">
          <UFormField label="Овог" name="last_name">
            <UInput
              v-model="registerState.last_name"
              placeholder="Овог"
              icon="i-lucide-user"
              size="lg"
            />
          </UFormField>

          <UFormField label="Нэр" name="first_name">
            <UInput
              v-model="registerState.first_name"
              placeholder="Нэр"
              icon="i-lucide-user"
              size="lg"
            />
          </UFormField>
        </div>

        <UFormField label="Имэйл" name="email">
          <UInput
            v-model="registerState.email"
            type="email"
            placeholder="you@example.com"
            icon="i-lucide-mail"
            size="lg"
          />
        </UFormField>

        <UFormField label="Нууц үг" name="password">
          <UInput
            v-model="registerState.password"
            type="password"
            placeholder="Хамгийн багадаа 8 тэмдэгт"
            icon="i-lucide-lock"
            size="lg"
          />
        </UFormField>

        <UButton type="submit" block size="lg" :loading="isLoading"> Бүртгүүлэх </UButton>
      </UForm>

      <!-- Toggle Mode -->
      <div class="text-center">
        <button type="button" class="text-sm text-primary hover:underline" @click="toggleMode">
          {{ isRegisterMode ? 'Хаяг байгаа? Нэвтрэх' : 'Хаяг байхгүй юу? Бүртгүүлэх' }}
        </button>
      </div>
    </div>

    <template #footer>
      <p class="text-center text-sm text-gray-500 dark:text-gray-400">
        Үргэлжлүүлснээр та манай
        <NuxtLink to="/" class="text-primary font-medium">Үйлчилгээний нөхцөл</NuxtLink>-ийг
        зөвшөөрч байна.
      </p>
    </template>
  </UCard>
</template>
