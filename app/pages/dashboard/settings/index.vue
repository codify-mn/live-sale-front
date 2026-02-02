<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const fileRef = ref<HTMLInputElement>()

const profileSchema = z.object({
    name: z.string().min(2, 'Нэр хэт богино байна'),
    email: z.string().email('Имэйл хаяг буруу байна'),
    username: z.string().min(2, 'Хэрэглэгчийн нэр хэт богино байна'),
    avatar: z.string().optional(),
    bio: z.string().optional()
})

type ProfileSchema = z.output<typeof profileSchema>

const profile = reactive<Partial<ProfileSchema>>({
    name: 'Benjamin Canac',
    email: 'ben@nuxtlabs.com',
    username: 'benjamincanac',
    avatar: undefined,
    bio: undefined
})
const toast = useToast()
async function onSubmit(event: FormSubmitEvent<ProfileSchema>) {
    toast.add({
        title: 'Амжилттай',
        description: 'Тохиргоо хадгалагдлаа.',
        icon: 'i-lucide-check',
        color: 'success'
    })
    console.log(event.data)
}

function onFileChange(e: Event) {
    const input = e.target as HTMLInputElement

    if (!input.files?.length) {
        return
    }

    profile.avatar = URL.createObjectURL(input.files[0]!)
}

function onFileClick() {
    fileRef.value?.click()
}
</script>

<template>
    <UForm id="settings" :schema="profileSchema" :state="profile" @submit="onSubmit">
        <UPageCard
            title="Хувийн мэдээлэл"
            description="Энэ мэдээлэл олон нийтэд харагдах болно."
            variant="naked"
            orientation="horizontal"
            class="mb-4"
        >
            <UButton
                form="settings"
                label="Хадгалах"
                color="neutral"
                type="submit"
                class="w-fit lg:ms-auto"
            />
        </UPageCard>

        <UPageCard variant="subtle" class="mb-4">
            <UFormField
                name="name"
                label="Нэр"
                description="Баримт, нэхэмжлэх болон бусад харилцаанд харагдана."
                required
                class="flex max-sm:flex-col justify-between items-start gap-4"
            >
                <UInput v-model="profile.name" autocomplete="off" />
            </UFormField>
            <USeparator />
            <UFormField
                name="email"
                label="Имэйл"
                description="Нэвтрэх, имэйл мэдэгдэл болон шинэчлэлт хүлээн авахад ашиглагдана."
                required
                class="flex max-sm:flex-col justify-between items-start gap-4"
            >
                <UInput v-model="profile.email" type="email" autocomplete="off" />
            </UFormField>
            <USeparator />
            <UFormField
                name="username"
                label="Хэрэглэгчийн нэр"
                description="Нэвтрэх болон профайл URL-д ашиглагдах өвөрмөц нэр."
                required
                class="flex max-sm:flex-col justify-between items-start gap-4"
            >
                <UInput v-model="profile.username" type="username" autocomplete="off" />
            </UFormField>
            <USeparator />
            <UFormField
                name="avatar"
                label="Зураг"
                description="JPG, GIF эсвэл PNG. Хамгийн ихдээ 1MB."
                class="flex max-sm:flex-col justify-between sm:items-center gap-4"
            >
                <div class="flex flex-wrap items-center gap-3">
                    <UAvatar :src="profile.avatar" :alt="profile.name" size="lg" />
                    <UButton label="Сонгох" color="neutral" @click="onFileClick" />
                    <input
                        ref="fileRef"
                        type="file"
                        class="hidden"
                        accept=".jpg, .jpeg, .png, .gif"
                        @change="onFileChange"
                    />
                </div>
            </UFormField>
            <USeparator />
            <UFormField
                name="bio"
                label="Танилцуулга"
                description="Профайлын товч танилцуулга."
                class="flex max-sm:flex-col justify-between items-start gap-4"
                :ui="{ container: 'w-full' }"
            >
                <UTextarea v-model="profile.bio" :rows="5" autoresize class="w-full" />
            </UFormField>
        </UPageCard>

        <UPageCard
            title="Integrations"
            description="These informations will be displayed publicly."
            variant="naked"
            orientation="horizontal"
            class="mb-4"
        >
            <UButton
                form="settings"
                label="Save changes"
                color="neutral"
                type="submit"
                class="w-fit lg:ms-auto"
            />
        </UPageCard>
    </UForm>
</template>
