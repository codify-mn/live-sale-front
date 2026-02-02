<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const links = [
  [
    {
      label: 'Ерөнхий',
      icon: 'i-lucide-user',
      to: '/dashboard/settings',
      exact: true
    },
    {
      label: 'Мэдэгдэл',
      icon: 'i-lucide-bell',
      to: '/dashboard/settings/notifications'
    },
    {
      label: 'Төлбөр',
      icon: 'i-lucide-credit-card',
      to: '/dashboard/settings/billing'
    },
    {
      label: 'Нууцлал',
      icon: 'i-lucide-shield',
      to: '/dashboard/settings/security'
    }
  ]
] satisfies NavigationMenuItem[][]
</script>

<template>
  <div>
  <UDashboardPanel id="settings" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar title="Тохиргоо">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <!-- NOTE: The `-mx-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
        <UNavigationMenu :items="links" highlight class="-mx-1 flex-1" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
        <NuxtPage />
      </div>
    </template>
  </UDashboardPanel>
  </div>
</template>
