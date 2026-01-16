<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Нууц үг сэргээх - Singulatim'
})

const { forgotPassword, isLoading, authError, clearError } = useAuth()

const isSubmitted = ref(false)

const schema = z.object({
  email: z.string().email('Зөв имэйл хаяг оруулна уу')
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: ''
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  const success = await forgotPassword(event.data.email)
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
          name="i-lucide-key-round"
          class="w-12 h-12 text-primary mx-auto mb-4"
        />
        <h1 class="text-2xl font-bold">
          Нууц үг сэргээх
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2">
          Имэйл хаягаа оруулна уу
        </p>
      </div>
    </template>

    <div class="space-y-4">
      <!-- Success Message -->
      <div v-if="isSubmitted" class="text-center space-y-4">
        <UIcon
          name="i-lucide-mail-check"
          class="w-16 h-16 text-green-500 mx-auto"
        />
        <p class="text-gray-600 dark:text-gray-300">
          Хэрэв таны имэйл хаяг бүртгэлтэй бол нууц үг сэргээх холбоосыг илгээлээ.
        </p>
        <p class="text-sm text-gray-500">
          Имэйлээ шалгана уу. Spam хавтсыг мөн шалгахаа мартуузай.
        </p>
        <UButton
          to="/login"
          variant="outline"
          block
        >
          Нэвтрэх хуудас руу буцах
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
          <UFormField label="Имэйл" name="email">
            <UInput
              v-model="state.email"
              type="email"
              placeholder="you@example.com"
              icon="i-lucide-mail"
              size="lg"
            />
          </UFormField>

          <UButton
            type="submit"
            block
            size="lg"
            :loading="isLoading"
          >
            Сэргээх холбоос илгээх
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
