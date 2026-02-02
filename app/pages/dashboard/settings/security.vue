<script setup lang="ts">
import * as z from 'zod'
import type { FormError } from '@nuxt/ui'

const passwordSchema = z.object({
    current: z.string().min(8, 'Хамгийн багадаа 8 тэмдэгт байх ёстой'),
    new: z.string().min(8, 'Хамгийн багадаа 8 тэмдэгт байх ёстой')
})

type PasswordSchema = z.output<typeof passwordSchema>

const password = reactive<Partial<PasswordSchema>>({
    current: undefined,
    new: undefined
})

const validate = (state: Partial<PasswordSchema>): FormError[] => {
    const errors: FormError[] = []
    if (state.current && state.new && state.current === state.new) {
        errors.push({ name: 'new', message: 'Нууц үг өөр байх ёстой' })
    }
    return errors
}
</script>

<template>
    <div class="flex flex-col gap-4"> 
        <UPageCard
            title="Нууц үг"
            description="Шинэ нууц үг тохируулахын өмнө одоогийн нууц үгээ баталгаажуулна уу."
            variant="subtle"
        >
            <UForm
                :schema="passwordSchema"
                :state="password"
                :validate="validate"
                class="flex flex-col gap-4 max-w-xs"
            >
                <UFormField name="current">
                    <UInput
                        v-model="password.current"
                        type="password"
                        placeholder="Одоогийн нууц үг"
                        class="w-full"
                    />
                </UFormField>

                <UFormField name="new">
                    <UInput
                        v-model="password.new"
                        type="password"
                        placeholder="Шинэ нууц үг"
                        class="w-full"
                    />
                </UFormField>

                <UButton label="Шинэчлэх" class="w-fit" type="submit" />
            </UForm>
        </UPageCard>

        <UPageCard
            title="Бүртгэл"
            description="Манай үйлчилгээг цаашид ашиглахгүй бол бүртгэлээ устгах боломжтой. Энэ үйлдлийг буцаах боломжгүй бөгөөд бүх мэдээлэл бүрмөсөн устгагдах болно."
            class="bg-gradient-to-tl from-error/10 from-5% to-default"
        >
            <template #footer>
                <UButton label="Бүртгэл устгах" color="error" />
            </template>
        </UPageCard>
    </div>
</template>
