<script setup lang="ts">
import type { LiveSale } from '~/types'

const config = useRuntimeConfig()
const toast = useToast()

const { data: lives, refresh } = await useFetch<LiveSale[]>(
  `${config.public.apiUrl}/api/live-sales`,
  {
    credentials: 'include'
  }
)

const isLiveModalOpen = ref(false)
const isLoading = ref(false)
const liveForm = reactive({
  title: '',
  description: ''
})

const createLive = async () => {
  try {
    if (!liveForm.title) {
      toast.add({
        title: 'Error',
        description: 'Title is required',
        color: 'error'
      })
      return
    }

    isLoading.value = true

    const { id } = await $fetch<LiveSale>(`${config.public.apiUrl}/api/live-sales/start-new`, {
      method: 'POST',
      body: liveForm,
      credentials: 'include'
    })

    navigateTo(`/app/live/${id}`)
  } catch (error) {
    console.error('Failed to create live:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to create live',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

const columns = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'title',
    header: 'Title'
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },
  {
    accessorKey: 'views',
    header: 'Views'
  },
  {
    accessorKey: 'Likes',
    header: 'Likes'
  },
  {
    accessorKey: 'status',
    header: 'Status'
  }
]
</script>

<template>
  <div class="w-full h-full">
    <UDashboardPanel id="live-sales">
      <UDashboardNavbar title="Facebook Live" />
      <div class="p-6 space-y-6 overflow-y-auto mt-6">
        <DashboardSection
          title="Түргэн үйлдлүүд"
          description="Түгээмэл хэрэглэгддэг үйлдлүүд"
        >
          <DashboardQuickAction
            title="Start Live"
            description="Start a new live sale stream"
            icon="i-lucide-video"
            color="blue"
            @click="
              () => {
                console.log('Start live clicked')
                isLiveModalOpen = true
              }
            "
          />
        </DashboardSection>

        <UTable
          :data="lives"
          :columns="columns"
        >
          <template #title-cell="{ row }">
            <NuxtLink
              :to="`/app/live/${row.original.id}`"
              class="font-medium text-gray-900 dark:text-white hover:text-primary-500"
            >
              {{ row.original.title }}
            </NuxtLink>
          </template>
        </UTable>
      </div>

      <UModal v-model:open="isLiveModalOpen">
        <template #header>
          <div class="flex-1 flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Start Live Sale
            </h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isLiveModalOpen = false"
            />
          </div>
        </template>

        <template #body>
          <div class="space-y-4">
            <UFormField
              label="Title"
              required
            >
              <UInput
                v-model="liveForm.title"
                placeholder="Enter stream title..."
              />
            </UFormField>
            <UFormField label="Description">
              <UTextarea
                v-model="liveForm.description"
                placeholder="Enter stream description..."
              />
            </UFormField>
          </div>
        </template>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="secondary"
              variant="ghost"
              @click="isLiveModalOpen = false"
            >
              Cancel
            </UButton>
            <UButton
              color="primary"
              :loading="isLoading"
              @click="createLive"
            >
              Go Live
            </UButton>
          </div>
        </template>
      </UModal>
    </UDashboardPanel>
  </div>
</template>
