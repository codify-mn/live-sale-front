<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Нэвтрэх - Singulatim'
})

const toast = useToast()

const schema = z.object({
  email: z.string().email('Имэйл буруу байна'),
  password: z.string().min(8, 'Хамгийн багадаа 8 тэмдэгт байх ёстой'),
  remember: z.boolean().optional()
})

type Schema = z.infer<typeof schema>

const fields = [{
  name: 'email',
  label: 'Имэйл',
  type: 'text',
  placeholder: 'Имэйл хаягаа оруулна уу'
}, {
  name: 'password',
  label: 'Нууц үг',
  type: 'password',
  placeholder: 'Нууц үгээ оруулна уу'
}, {
  name: 'remember',
  label: 'Намайг сана',
  type: 'checkbox'
}]

const providers = [{
  label: 'Google',
  icon: 'i-simple-icons-google',
  onClick: () => {
    toast.add({ title: 'Google нэвтрэлт удахгүй нэмэгдэнэ', color: 'info' })
  }
}, {
  label: 'Facebook',
  icon: 'i-simple-icons-facebook',
  onClick: () => {
    toast.add({ title: 'Facebook руу шилжиж байна...', color: 'info' })
    navigateTo('/auth/facebook/login', { external: true })
  }
}]

function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('Login payload:', event.data)
  toast.add({ title: 'Нэвтрэх функц удахгүй нэмэгдэнэ', color: 'info' })
}
</script>

<template>
  <UAuthForm
    title="Тавтай морил"
    description="Бүртгэлдээ нэвтрэхийн тулд мэдээллээ оруулна уу."
    icon="i-lucide-lock"
    :schema="schema"
    :fields="fields"
    :providers="providers"
    submit-label="Нэвтрэх"
    @submit="onSubmit"
  >
    <template #description>
      Бүртгэлгүй юу? <NuxtLink to="/signup" class="text-primary font-medium">Бүртгүүлэх</NuxtLink>
    </template>

    <template #password-hint>
      <NuxtLink to="/" class="text-primary font-medium text-sm">Нууц үгээ мартсан?</NuxtLink>
    </template>

    <template #footer>
      Нэвтрэснээр та манай
      <NuxtLink to="/" class="text-primary font-medium">Үйлчилгээний нөхцөл</NuxtLink>-ийг зөвшөөрч байна.
    </template>
  </UAuthForm>
</template>
