<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useShopSettings } from '~/composables/useShopSettings'

const { shop, isLoading, isSaving, fetchShop, updateShop } = useShopSettings()

const fileRef = ref<HTMLInputElement>()
const config = useRuntimeConfig()

const paymentMethods = [
    { label: 'Бэлэн мөнгө', value: 'cash', icon: 'i-lucide-banknote' },
    { label: 'Банкны шилжүүлэг', value: 'bank_transfer', icon: 'i-lucide-landmark' },
    { label: 'QPay', value: 'qpay', icon: 'i-lucide-smartphone' }
]

const banks = [
    { label: 'Хаан банк', value: 'Хаан банк' },
    { label: 'Худалдаа хөгжлийн банк', value: 'Худалдаа хөгжлийн банк' },
    { label: 'Голомт банк', value: 'Голомт банк' },
    { label: 'Төрийн банк', value: 'Төрийн банк' },
    { label: 'Хас банк', value: 'Хас банк' },
    { label: 'Богд банк', value: 'Богд банк' }
]

const shopSchema = z.object({
    name: z.string().min(1, 'Дэлгүүрийн нэр оруулна уу'),
    phone_number: z.string().optional(),
    description: z.string().optional(),
    picture: z.string().optional()
})

type ShopSchema = z.output<typeof shopSchema>

const state = reactive({
    name: '',
    phone_number: '',
    description: '',
    picture: '',
    payment_method: 'cash',
    bank_name: '',
    bank_account_number: '',
    bank_account_name: '',
    delivery_fee: 0,
    free_delivery_over: 0,
    delivery_note: '',
    auto_reply: false,
    reply_message: '',
    comment_prefix: '',
})

const showBankFields = computed(() => state.payment_method === 'bank_transfer')

onMounted(async () => {
    await fetchShop()
    if (shop.value) {
        state.name = shop.value.name || ''
        state.phone_number = shop.value.phone_number || ''
        state.description = shop.value.description || ''
        state.picture = shop.value.picture || ''
        state.payment_method = shop.value.settings?.payment_method || 'cash'
        state.bank_name = shop.value.settings?.bank_name || ''
        state.bank_account_number = shop.value.settings?.bank_account_number || ''
        state.bank_account_name = shop.value.settings?.bank_account_name || ''
        state.delivery_fee = shop.value.settings?.delivery_fee || 0
        state.free_delivery_over = shop.value.settings?.free_delivery_over || 0
        state.delivery_note = shop.value.settings?.delivery_note || ''
        state.auto_reply = shop.value.settings?.auto_reply || false
        state.reply_message = shop.value.settings?.reply_message || ''
        state.comment_prefix = shop.value.settings?.comment_prefix || ''
    }
})

async function onSubmit(_event: FormSubmitEvent<ShopSchema>) {
    await saveSettings()
}

async function saveSettings() {
    const updates = {
        name: state.name,
        phone_number: state.phone_number,
        description: state.description,
        picture: state.picture,
        settings: {
            payment_method: state.payment_method,
            bank_name: state.bank_name,
            bank_account_number: state.bank_account_number,
            bank_account_name: state.bank_account_name,
            delivery_fee: state.delivery_fee,
            free_delivery_over: state.free_delivery_over,
            delivery_note: state.delivery_note,
            auto_reply: state.auto_reply,
            reply_message: state.reply_message,
            comment_prefix: state.comment_prefix,
        }
    }
    await updateShop(updates)
}

function onFileChange(e: Event) {
    const input = e.target as HTMLInputElement
    if (!input.files?.length) return

    const file = input.files[0]!
    const formData = new FormData()
    formData.append('file', file)

    $fetch<{ url: string }>(`${config.public.apiUrl}/api/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
    })
        .then((response) => {
            state.picture = response.url
        })
        .catch((err) => {
            console.error('Upload failed:', err)
        })
}

function onFileClick() {
    fileRef.value?.click()
}
</script>

<template>
    <div>
        <div v-if="isLoading" class="flex justify-center py-12">
            <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-muted" />
        </div>

        <UForm v-else id="shop-settings" :schema="shopSchema" :state="state" @submit="onSubmit">
            <!-- Section 1: Basic Info -->
            <UPageCard
                title="Дэлгүүрийн мэдээлэл"
                description="Дэлгүүрийн үндсэн мэдээлэл."
                variant="naked"
                orientation="horizontal"
                class="mb-4"
            >
                <UButton
                    form="shop-settings"
                    label="Хадгалах"
                    color="neutral"
                    type="submit"
                    :loading="isSaving"
                    class="w-fit lg:ms-auto"
                />
            </UPageCard>

            <UPageCard variant="subtle" class="mb-8">
                <UFormField
                    name="name"
                    label="Нэр"
                    description="Дэлгүүрийн нэр хэрэглэгчдэд харагдана."
                    required
                    class="flex max-sm:flex-col justify-between items-start gap-4"
                >
                    <UInput v-model="state.name" autocomplete="off" />
                </UFormField>
                <USeparator />
                <UFormField
                    name="phone_number"
                    label="Утас"
                    description="Холбоо барих утасны дугаар."
                    class="flex max-sm:flex-col justify-between items-start gap-4"
                >
                    <UInput v-model="state.phone_number" type="tel" autocomplete="off" />
                </UFormField>
                <USeparator />
                <UFormField
                    name="description"
                    label="Тайлбар"
                    description="Дэлгүүрийн товч танилцуулга."
                    class="flex max-sm:flex-col justify-between items-start gap-4"
                    :ui="{ container: 'w-full' }"
                >
                    <UTextarea v-model="state.description" :rows="3" autoresize class="w-full" />
                </UFormField>
                <USeparator />
                <UFormField
                    name="picture"
                    label="Лого"
                    description="JPG, GIF эсвэл PNG. Хамгийн ихдээ 1MB."
                    class="flex max-sm:flex-col justify-between sm:items-center gap-4"
                >
                    <div class="flex flex-wrap items-center gap-3">
                        <UAvatar :src="state.picture" :alt="state.name" size="lg" />
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
            </UPageCard>

            <!-- Section 2: Payment Settings -->
            <UPageCard
                title="Төлбөрийн тохиргоо"
                description="Төлбөр хүлээн авах арга зам."
                variant="naked"
                class="mb-4"
            />

            <UPageCard variant="subtle" class="mb-8">
                <UFormField
                    name="payment_method"
                    label="Төлбөрийн арга"
                    description="Хэрэглэгчдээс төлбөр хүлээн авах арга."
                    class="flex max-sm:flex-col justify-between items-start gap-4"
                >
                    <URadioGroup
                        v-model="state.payment_method"
                        :items="paymentMethods"
                        class="gap-4"
                    />
                </UFormField>

                <template v-if="showBankFields">
                    <USeparator />
                    <UFormField
                        name="bank_name"
                        label="Банк"
                        description="Шилжүүлэг хүлээн авах банк."
                        class="flex max-sm:flex-col justify-between items-start gap-4"
                    >
                        <USelect
                            v-model="state.bank_name"
                            :items="banks"
                            placeholder="Банк сонгох"
                        />
                    </UFormField>
                    <USeparator />
                    <UFormField
                        name="bank_account_number"
                        label="Дансны дугаар"
                        description="Банкны дансны дугаар."
                        class="flex max-sm:flex-col justify-between items-start gap-4"
                    >
                        <UInput v-model="state.bank_account_number" autocomplete="off" />
                    </UFormField>
                    <USeparator />
                    <UFormField
                        name="bank_account_name"
                        label="Дансны нэр"
                        description="Дансны эзэмшигчийн нэр."
                        class="flex max-sm:flex-col justify-between items-start gap-4"
                    >
                        <UInput v-model="state.bank_account_name" autocomplete="off" />
                    </UFormField>
                </template>
            </UPageCard>

            <!-- Section 3: Delivery Settings -->
            <UPageCard
                title="Хүргэлтийн тохиргоо"
                description="Хүргэлтийн төлбөр болон нөхцөл."
                variant="naked"
                class="mb-4"
            />

            <UPageCard variant="subtle" class="mb-8">
                <UFormField
                    name="delivery_fee"
                    label="Хүргэлтийн төлбөр"
                    description="Захиалга бүрийн хүргэлтийн төлбөр."
                    class="flex max-sm:flex-col justify-between items-start gap-4"
                >
                    <UInput v-model.number="state.delivery_fee" type="number" autocomplete="off">
                        <template #trailing>
                            <span class="text-muted text-xs">₮</span>
                        </template>
                    </UInput>
                </UFormField>
                <USeparator />
                <UFormField
                    name="free_delivery_over"
                    label="Үнэгүй хүргэлтийн босго"
                    description="Энэ дүнгээс дээш захиалга хүргэлт үнэгүй."
                    class="flex max-sm:flex-col justify-between items-start gap-4"
                >
                    <UInput
                        v-model.number="state.free_delivery_over"
                        type="number"
                        autocomplete="off"
                    >
                        <template #trailing>
                            <span class="text-muted text-xs">₮</span>
                        </template>
                    </UInput>
                </UFormField>
                <USeparator />
                <UFormField
                    name="delivery_note"
                    label="Хүргэлтийн тэмдэглэл"
                    description="Хэрэглэгчдэд харуулах хүргэлтийн нэмэлт мэдээлэл."
                    class="flex max-sm:flex-col justify-between items-start gap-4"
                    :ui="{ container: 'w-full' }"
                >
                    <UTextarea v-model="state.delivery_note" :rows="2" autoresize class="w-full" />
                </UFormField>
            </UPageCard>

            <!-- Section 4: Auto Reply Settings -->
            <UPageCard
                title="Автомат хариулт"
                description="Facebook мессенжерийн автомат хариултын тохиргоо."
                variant="naked"
                class="mb-4"
            />

            <UPageCard variant="subtle" class="mb-8">
                <UFormField
                    name="auto_reply"
                    label="Идэвхжүүлэх"
                    description="Мессенжер хариултыг автоматаар илгээх."
                    class="flex items-center justify-between gap-2"
                >
                    <USwitch v-model="state.auto_reply" />
                </UFormField>
                <USeparator />
                <UFormField
                    name="reply_message"
                    label="Хариултын мессеж"
                    description="Автоматаар илгээх мессеж."
                    class="flex max-sm:flex-col justify-between items-start gap-4"
                    :ui="{ container: 'w-full' }"
                >
                    <UTextarea
                        v-model="state.reply_message"
                        :rows="3"
                        autoresize
                        class="w-full"
                        placeholder="Сайн байна уу! Таны захиалга хүлээн авлаа."
                    />
                </UFormField>
                <USeparator />
                <UFormField
                    name="comment_prefix"
                    label="Коммент prefix"
                    description="Захиалга авах комментын эхний тэмдэгт (жишээ: #, !, +)."
                    class="flex max-sm:flex-col justify-between items-start gap-4"
                >
                    <UInput v-model="state.comment_prefix" autocomplete="off" placeholder="#" />
                </UFormField>
            </UPageCard>
        </UForm>
    </div>
</template>
