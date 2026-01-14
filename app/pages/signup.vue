<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Бүртгүүлэх - Singulatim'
})

const toast = useToast()

const schema = z.object({
  name: z.string().min(2, 'Нэр хамгийн багадаа 2 тэмдэгт байх ёстой'),
  email: z.string().email('Имэйл буруу байна'),
  password: z.string().min(8, 'Хамгийн багадаа 8 тэмдэгт байх ёстой')
})

type Schema = z.infer<typeof schema>

const fields = [{
  name: 'name',
  label: 'Нэр',
  type: 'text',
  placeholder: 'Нэрээ оруулна уу'
}, {
  name: 'email',
  label: 'Имэйл',
  type: 'text',
  placeholder: 'Имэйл хаягаа оруулна уу'
}, {
  name: 'password',
  label: 'Нууц үг',
  type: 'password',
  placeholder: 'Нууц үг үүсгэнэ үү'
}]

const providers = [{
  label: 'Google',
  icon: 'i-simple-icons-google',
  onClick: () => {
    toast.add({ title: 'Google бүртгэл удахгүй нэмэгдэнэ', color: 'info' })
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
  console.log('Signup payload:', event.data)
  toast.add({ title: 'Бүртгэлийн функц удахгүй нэмэгдэнэ', color: 'info' })
}
</script>

<template>
  <UAuthForm
    title="Бүртгүүлэх"
    description="Үнэгүй бүртгэл үүсгээд эхлээрэй."
    icon="i-lucide-user-plus"
    :schema="schema"
    :fields="fields"
    :providers="providers"
    submit-label="Бүртгүүлэх"
    @submit="onSubmit"
  >
    <template #description>
      Бүртгэлтэй юу? <NuxtLink to="/login" class="text-primary font-medium">Нэвтрэх</NuxtLink>
    </template>

    <template #footer>
      Бүртгүүлснээр та манай
      <NuxtLink to="/" class="text-primary font-medium">Үйлчилгээний нөхцөл</NuxtLink>
      болон
      <NuxtLink to="/" class="text-primary font-medium">Нууцлалын бодлого</NuxtLink>-г зөвшөөрч байна.
    </template>
  </UAuthForm>
</template>
