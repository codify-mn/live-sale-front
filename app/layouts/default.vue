<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const open = ref(false)

const links = [[{
  label: 'Нүүр',
  icon: 'i-lucide-house',
  to: '/dashboard',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Facebook Live',
  icon: 'i-lucide-tv-minimal-play',
  to: '/app/live',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Бүтээгдэхүүн',
  icon: 'i-lucide-package',
  to: '/dashboard/products',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Тохиргоо',
  to: '/dashboard/settings',
  icon: 'i-lucide-settings',
  defaultOpen: false,
  type: 'trigger',
  children: [{
    label: 'Профайл',
    to: '/dashboard/settings',
    exact: true,
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Мэдэгдэл',
    to: '/dashboard/settings/notifications',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Нууцлал',
    to: '/dashboard/settings/security',
    onSelect: () => {
      open.value = false
    }
  }]
}]] satisfies NavigationMenuItem[][]

const groups = computed(() => [{
  id: 'links',
  label: 'Хуудас',
  items: links.flat()
}])
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar id="default" v-model:open="open" collapsible resizable
      class="bg-white/75 dark:bg-gray-900/75 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800"
      :ui="{ footer: 'lg:border-t lg:border-gray-200 dark:lg:border-gray-800' }">
      <template #header="{ collapsed }">
        <TeamsMenu :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu :collapsed="collapsed" :items="links[0]" orientation="vertical" tooltip popover />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />

    <!-- <NotificationsSlideover /> -->
  </UDashboardGroup>
</template>
