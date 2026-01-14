<script setup lang="ts">
const columns = [
  {
    label: 'Бүтээгдэхүүн',
    children: [
      {
        label: 'Боломжууд',
        to: '/#features'
      },
      {
        label: 'Үнийн мэдээлэл',
        to: '/pricing'
      },
      {
        label: 'Тусламж',
        to: '/docs'
      }
    ]
  },
  {
    label: 'Компани',
    children: [
      {
        label: 'Бидний тухай',
        to: '/'
      },
      {
        label: 'Холбоо барих',
        to: '/'
      },
      {
        label: 'Үйлчилгээний нөхцөл',
        to: '/'
      }
    ]
  }
]
</script>

<template>
  <USeparator icon="i-lucide-zap" />

  <UFooter class="p-12">
    <template #left>
      <div>
        <AppLogo class="mb-2" />
        <p class="text-muted text-sm">
          Live худалдааны ухаалаг платформ
        </p>
      </div>
    </template>

    <template #top>
      <UFooterColumns :columns="columns" />
    </template>

    <template #right>
      <UButton
        to="https://facebook.com"
        target="_blank"
        icon="i-simple-icons-facebook"
        color="neutral"
        variant="ghost"
      />
      <UButton
        to="https://instagram.com"
        target="_blank"
        icon="i-simple-icons-instagram"
        color="neutral"
        variant="ghost"
      />
    </template>

    <template #bottom>
      <p class="text-muted text-sm">
        &copy; {{ new Date().getFullYear() }} Singulatim. Бүх эрх хуулиар
        хамгаалагдсан.
      </p>
    </template>
  </UFooter>
</template>
