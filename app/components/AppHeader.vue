<script setup lang="ts">
const route = useRoute()

const navigation = [
  {
    label: 'Үнийн мэдээлэл',
    to: '/pricing'
  },
  {
    label: 'Тусламж',
    to: '/docs',
    active: route.path.startsWith('/docs')
  }
]
</script>

<template>
  <UHeader>
    <template #left>
      <AppLogo />
    </template>

    <UNavigationMenu :items="navigation" variant="link" />

    <template #right>
      <UColorModeButton />
      <UButton to="/login" icon="i-lucide-user" color="neutral" variant="ghost" class="lg:hidden" />
      <UButton to="/login" label="Нэвтрэх" color="neutral" variant="ghost" class="hidden lg:flex" />
      <UButton to="/signup" label="Бүртгүүлэх" class="hidden lg:flex" />
    </template>

    <template #body>
      <UNavigationMenu :items="navigation" orientation="vertical" class="-mx-2.5" />
      <USeparator class="my-4" />
      <div class="flex flex-col gap-y-2">
        <UButton to="/login" label="Нэвтрэх" color="neutral" variant="ghost" block />
        <UButton to="/signup" label="Бүртгүүлэх" block />
      </div>
    </template>
  </UHeader>
</template>
