<script setup lang="ts">
const isLiveModalOpen = ref(false)
</script>
<template>
    <div class="w-full h-full overflow-y-auto">
        <UDashboardPage>
            <UDashboardNavbar>
                <template #right>
                    <UButton color="primary" icon="i-lucide-plus"> Шинэ Автоматжуулалт </UButton>
                </template>
                <template #title>
                    Автоматжуулалт
                    <UTooltip
                        text="Facebook post доор comment бичихэд та автоматжуулалтаа удирдах боломжтой"
                        :delay-duration="200"
                    >
                        <UButton color="neutral" variant="ghost" icon="i-lucide-info" />
                    </UTooltip>
                </template>
            </UDashboardNavbar>

            <UDashboardPanel>
                <UDashboardPanelContent>
                    <div class="flex flex-col gap-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-500">end automationee shaana</p>
                            </div>
                        </div>
                    </div>
                </UDashboardPanelContent>
            </UDashboardPanel>
        </UDashboardPage>
    </div>
</template>
