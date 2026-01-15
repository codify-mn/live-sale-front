<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const route = useRoute()
const toast = useToast()
const { fetchUser, isAuthenticated, needsOnboarding } = useAuth()

const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  // Check for error from backend
  const errorParam = route.query.error as string
  if (errorParam) {
    error.value = errorParam
    isLoading.value = false
    toast.add({
      title: 'Нэвтрэхэд алдаа гарлаа',
      description: errorParam,
      color: 'error'
    })
    return
  }

  // Fetch user data (cookie was set by backend)
  await fetchUser()

  if (isAuthenticated.value) {
    if (needsOnboarding.value) {
      navigateTo('/onboarding')
    } else {
      navigateTo('/dashboard')
    }
  } else {
    error.value = 'Нэвтрэхэд алдаа гарлаа'
    isLoading.value = false
  }
})
</script>

<template>
  <UCard class="max-w-sm w-full">
    <div class="text-center py-8">
      <template v-if="isLoading && !error">
        <UIcon name="i-lucide-loader-2" class="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
        <p class="text-gray-500 dark:text-gray-400">Нэвтэрч байна...</p>
      </template>

      <template v-else-if="error">
        <UIcon name="i-lucide-alert-circle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 class="text-lg font-semibold mb-2">Алдаа гарлаа</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-4">{{ error }}</p>
        <UButton to="/login" color="primary">
          Дахин оролдох
        </UButton>
      </template>
    </div>
  </UCard>
</template>
