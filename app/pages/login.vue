<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Эхлэх - Singulatim'
})

const { loginWithFacebook, isLoading } = useAuth()
</script>

<template>
  <UCard class="max-w-sm w-full">
    <template #header>
      <div class="text-center">
        <UIcon
          name="i-lucide-store"
          class="w-12 h-12 text-primary mx-auto mb-4"
        />
        <h1 class="text-2xl font-bold">
          Тавтай морил
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2">
          Facebook хаягаараа бүртгүүлэх эсвэл нэвтрэх
        </p>
      </div>
    </template>

    <UButton
      block
      size="lg"
      color="primary"
      variant="solid"
      icon="i-simple-icons-facebook"
      :loading="isLoading"
      @click="loginWithFacebook"
    >
      Facebook-ээр үргэлжлүүлэх
    </UButton>

    <template #footer>
      <p class="text-center text-sm text-gray-500 dark:text-gray-400">
        Үргэлжлүүлснээр та манай
        <NuxtLink
          to="/"
          class="text-primary font-medium"
        >Үйлчилгээний нөхцөл</NuxtLink>-ийг зөвшөөрч байна.
      </p>
    </template>
  </UCard>
</template>
