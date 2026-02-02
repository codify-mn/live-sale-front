<script setup lang="ts">
const state = reactive<{ [key: string]: boolean }>({
    email: true,
    desktop: false,
    product_updates: true,
    weekly_digest: false,
    important_updates: true
})

const sections = [
    {
        title: 'Мэдэгдлийн суваг',
        description: 'Бид танд хаана мэдэгдэл илгээх вэ?',
        fields: [
            {
                name: 'email',
                label: 'Имэйл',
                description: 'Өдөр бүрийн имэйл мэдэгдэл хүлээн авах.'
            },
            {
                name: 'desktop',
                label: 'Ширээний',
                description: 'Ширээний мэдэгдэл хүлээн авах.'
            }
        ]
    },
    {
        title: 'Бүртгэлийн шинэчлэлт',
        description: 'Системийн шинэчлэлтийн талаар мэдэгдэл авах.',
        fields: [
            {
                name: 'weekly_digest',
                label: 'Долоо хоногийн тойм',
                description: 'Долоо хоног бүрийн мэдээний тойм хүлээн авах.'
            },
            {
                name: 'product_updates',
                label: 'Бүтээгдэхүүний шинэчлэлт',
                description:
                    'Сар бүрийн шинэ боломжууд болон шинэчлэлтийн талаар имэйл хүлээн авах.'
            },
            {
                name: 'important_updates',
                label: 'Чухал шинэчлэлт',
                description:
                    'Аюулгүй байдлын засвар, засвар үйлчилгээ гэх мэт чухал шинэчлэлтийн талаар мэдэгдэл авах.'
            }
        ]
    }
]

async function onChange() {
    // Do something with data
    console.log(state)
}
</script>

<template>
    <div>
        <div v-for="(section, index) in sections" :key="index">
            <UPageCard
                :title="section.title"
                :description="section.description"
                variant="naked"
                class="mb-4"
            />

            <UPageCard variant="subtle" :ui="{ container: 'divide-y divide-default' }">
                <UFormField
                    v-for="field in section.fields"
                    :key="field.name"
                    :name="field.name"
                    :label="field.label"
                    :description="field.description"
                    class="flex items-center justify-between not-last:pb-4 gap-2"
                >
                    <USwitch v-model="state[field.name]" @update:model-value="onChange" />
                </UFormField>
            </UPageCard>
        </div>
    </div>
</template>
