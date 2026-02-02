<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
    layout: 'auth'
})

useSeoMeta({
    title: 'Нэвтрэх - CommentBoost'
})

const route = useRoute()
const { loginWithEmail, register, isLoading, authError, clearError } = useAuth()

// Check for mode in URL query
const isRegisterMode = ref(route.query.mode === 'register')

const loginSchema = z.object({
    email: z.string().email('Зөв имэйл хаяг оруулна уу'),
    password: z.string().min(1, 'Нууц үг оруулна уу')
})

const registerSchema = z.object({
    email: z.string().email('Зөв имэйл хаяг оруулна уу'),
    password: z.string().min(8, 'Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой'),
    first_name: z.string().min(1, 'Нэрээ оруулна уу'),
    last_name: z.string().min(1, 'Овгоо оруулна уу')
})

type LoginSchema = z.output<typeof loginSchema>
type RegisterSchema = z.output<typeof registerSchema>

const loginState = reactive({
    email: '',
    password: ''
})

const registerState = reactive({
    email: '',
    password: '',
    first_name: '',
    last_name: ''
})

const toggleMode = () => {
    isRegisterMode.value = !isRegisterMode.value
    clearError()
}

const onLoginSubmit = async (event: FormSubmitEvent<LoginSchema>) => {
    const success = await loginWithEmail(event.data)
    if (success) {
        navigateTo('/auth/callback')
    }
}

const onRegisterSubmit = async (event: FormSubmitEvent<RegisterSchema>) => {
    const success = await register(event.data)
    if (success) {
        navigateTo('/auth/callback')
    }
}

const features = [
    {
        icon: 'i-lucide-zap',
        title: 'Автомат захиалга',
        description: 'Live коммент дээрээс захиалга автоматаар хүлээн авна'
    },
    {
        icon: 'i-lucide-bar-chart-3',
        title: 'Бодит цагийн статистик',
        description: 'Борлуулалтаа бодит цагаар хянаж, шийдвэр гарга'
    },
    {
        icon: 'i-lucide-shield-check',
        title: '99.9% Uptime',
        description: 'Найдвартай, тасралтгүй үйлчилгээний баталгаа'
    }
]
</script>

<template>
    <div class="min-h-screen flex">
        <!-- Left side - Branding & Features -->
        <div class="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
            <!-- Animated gradient background -->
            <div class="absolute inset-0 bg-gradient-animated" />

            <!-- Content overlay -->
            <div class="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white">
                <!-- Logo -->
                <NuxtLink to="/" class="flex items-center gap-3 group">
                    <div
                        class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-white/30 transition-colors"
                    >
                        <UIcon name="i-lucide-zap" class="w-5 h-5 text-white" />
                    </div>
                    <span class="font-bold text-xl">CommentBoost</span>
                </NuxtLink>

                <!-- Main content -->
                <div class="max-w-lg">
                    <h1 class="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
                        Live худалдааг
                        <br />
                        автоматжуулаарай
                    </h1>
                    <p class="text-lg text-white/80 mb-10">
                        Мянга мянган худалдаачид итгэдэг платформ. Захиалга автоматаар хүлээн авч,
                        бизнесээ өсгөөрэй.
                    </p>

                    <!-- Feature list -->
                    <div class="space-y-6">
                        <div
                            v-for="feature in features"
                            :key="feature.title"
                            class="flex items-start gap-4"
                        >
                            <div
                                class="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center flex-shrink-0"
                            >
                                <UIcon :name="feature.icon" class="w-5 h-5" />
                            </div>
                            <div>
                                <h3 class="font-semibold mb-1">
                                    {{ feature.title }}
                                </h3>
                                <p class="text-sm text-white/70">
                                    {{ feature.description }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bottom testimonial -->
                <div class="glass-card rounded-2xl p-6 max-w-md bg-white/10 border-white/20">
                    <p class="text-white/90 mb-4 leading-relaxed">
                        "CommentBoost ашиглаж эхэлснээс хойш захиалгын боловсруулалтанд зарцуулах
                        цаг 80%-иар багассан."
                    </p>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-white/20" />
                        <div>
                            <div class="font-medium text-sm">Б. Сарангэрэл</div>
                            <div class="text-xs text-white/60">Гоо сайхны дэлгүүр эзэмшигч</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Decorative floating shapes -->
            <div class="absolute top-20 right-20 w-32 h-32 rounded-full bg-white/5 float" />
            <div
                class="absolute bottom-40 right-40 w-20 h-20 rounded-2xl bg-white/5 float-delay-1 rotate-12"
            />
            <div
                class="absolute top-1/2 right-10 w-16 h-16 rounded-xl bg-white/5 float-delay-2 -rotate-6"
            />
        </div>

        <!-- Right side - Form -->
        <div class="flex-1 flex items-center justify-center p-6 md:p-12 bg-white dark:bg-gray-950">
            <div class="w-full max-w-md">
                <!-- Mobile logo -->
                <NuxtLink to="/" class="flex lg:hidden items-center gap-2.5 mb-8 justify-center">
                    <div
                        class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center"
                    >
                        <UIcon name="i-lucide-zap" class="w-5 h-5 text-white" />
                    </div>
                    <span class="font-bold text-lg text-gray-900 dark:text-white">
                        Comment<span class="text-gradient">Boost</span>
                    </span>
                </NuxtLink>

                <!-- Header -->
                <div class="text-center mb-8">
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {{ isRegisterMode ? 'Бүртгүүлэх' : 'Тавтай морилно уу' }}
                    </h1>
                    <p class="text-gray-500 dark:text-gray-400">
                        {{
                            isRegisterMode
                                ? 'Шинэ хаяг үүсгэж эхлээрэй'
                                : 'Өөрийн хаягаар нэвтрээрэй'
                        }}
                    </p>
                </div>

                <!-- OAuth Buttons -->
                <!-- <div class="space-y-3 mb-6">
          <UButton
            block
            size="lg"
            color="neutral"
            variant="outline"
            :loading="isLoading"
            class="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            @click="loginWithGoogle"
          >
            <UIcon
              name="i-simple-icons-google"
              class="w-5 h-5 mr-3"
            />
            Google-ээр үргэлжлүүлэх
          </UButton>

          <UButton
            block
            size="lg"
            color="neutral"
            variant="outline"
            :loading="isLoading"
            class="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            @click="loginWithFacebook"
          >
            <UIcon
              name="i-simple-icons-facebook"
              class="w-5 h-5 mr-3 text-blue-600"
            />
            Facebook-ээр үргэлжлүүлэх
          </UButton>
        </div>

        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200 dark:border-gray-800" />
          </div>
          <div class="relative flex justify-center">
            <span class="px-4 text-sm text-gray-500 bg-white dark:bg-gray-950">эсвэл</span>
          </div>
        </div> -->

                <!-- Error Alert -->
                <Transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition duration-150 ease-in"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-2"
                >
                    <UAlert
                        v-if="authError"
                        color="error"
                        variant="subtle"
                        :title="authError"
                        icon="i-lucide-alert-circle"
                        class="mb-6"
                        :close-button="{
                            icon: 'i-lucide-x',
                            color: 'error',
                            variant: 'link',
                            padded: false
                        }"
                        @close="clearError"
                    />
                </Transition>

                <!-- Login Form -->
                <UForm
                    v-if="!isRegisterMode"
                    :schema="loginSchema"
                    :state="loginState"
                    class="space-y-5"
                    @submit="onLoginSubmit"
                >
                    <UFormField label="Имэйл хаяг" name="email">
                        <UInput
                            v-model="loginState.email"
                            type="email"
                            placeholder="you@example.com"
                            icon="i-lucide-mail"
                            size="lg"
                        />
                    </UFormField>

                    <UFormField label="Нууц үг" name="password">
                        <UInput
                            v-model="loginState.password"
                            type="password"
                            placeholder="••••••••"
                            icon="i-lucide-lock"
                            size="lg"
                        />
                    </UFormField>

                    <div class="flex justify-end">
                        <NuxtLink
                            to="/forgot-password"
                            class="text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
                        >
                            Нууц үг мартсан?
                        </NuxtLink>
                    </div>

                    <UButton
                        type="submit"
                        block
                        size="lg"
                        :loading="isLoading"
                        class="bg-gradient-to-r from-primary-500 to-pink-500 hover:from-primary-600 hover:to-pink-600 border-0 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300"
                    >
                        Нэвтрэх
                    </UButton>
                </UForm>

                <!-- Register Form -->
                <UForm
                    v-else
                    :schema="registerSchema"
                    :state="registerState"
                    class="space-y-5"
                    @submit="onRegisterSubmit"
                >
                    <div class="grid grid-cols-2 gap-4">
                        <UFormField label="Овог" name="last_name">
                            <UInput
                                v-model="registerState.last_name"
                                placeholder="Овог"
                                icon="i-lucide-user"
                                size="lg"
                            />
                        </UFormField>

                        <UFormField label="Нэр" name="first_name">
                            <UInput
                                v-model="registerState.first_name"
                                placeholder="Нэр"
                                icon="i-lucide-user"
                                size="lg"
                            />
                        </UFormField>
                    </div>

                    <UFormField label="Имэйл хаяг" name="email">
                        <UInput
                            v-model="registerState.email"
                            type="email"
                            placeholder="you@example.com"
                            icon="i-lucide-mail"
                            size="lg"
                        />
                    </UFormField>

                    <UFormField label="Нууц үг" name="password">
                        <UInput
                            v-model="registerState.password"
                            type="password"
                            placeholder="Хамгийн багадаа 8 тэмдэгт"
                            icon="i-lucide-lock"
                            size="lg"
                        />
                    </UFormField>

                    <UButton
                        type="submit"
                        block
                        size="lg"
                        :loading="isLoading"
                        class="bg-gradient-to-r from-primary-500 to-pink-500 hover:from-primary-600 hover:to-pink-600 border-0 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300"
                    >
                        Бүртгүүлэх
                    </UButton>
                </UForm>

                <!-- Toggle Mode -->
                <div class="text-center mt-8">
                    <span class="text-gray-500 dark:text-gray-400">
                        {{ isRegisterMode ? 'Хаяг байгаа юу?' : 'Хаяг байхгүй юу?' }}
                    </span>
                    <button
                        type="button"
                        class="ml-2 text-primary-500 hover:text-primary-600 font-semibold transition-colors cursor-pointer"
                        @click="toggleMode"
                    >
                        {{ isRegisterMode ? 'Нэвтрэх' : 'Бүртгүүлэх' }}
                    </button>
                </div>

                <!-- Terms -->
                <p class="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
                    Үргэлжлүүлснээр та манай
                    <NuxtLink to="/terms" class="text-primary-500 hover:underline"
                        >Үйлчилгээний нөхцөл</NuxtLink
                    >
                    болон
                    <NuxtLink to="/privacy" class="text-primary-500 hover:underline"
                        >Нууцлалын бодлого</NuxtLink
                    >-г зөвшөөрч байна.
                </p>
            </div>
        </div>
    </div>
</template>
