<script setup lang="ts">
import { z } from 'zod'
import type { FacebookPage } from '~/types'

definePageMeta({
    layout: 'auth'
})

useSeoMeta({
    title: 'Дэлгүүр үүсгэх - Comment Boost'
})

const config = useRuntimeConfig()
const toast = useToast()
const route = useRoute()
const { user, fetchUser } = useAuth()
const { shop, fetchShop } = useShopSettings()

const isSubmitting = ref(false)
const isSavingStep = ref(false)
const currentStep = ref(1)
const totalSteps = 4

const steps = [
    { number: 1, label: 'Facebook холболт', icon: 'i-simple-icons-facebook' },
    { number: 2, label: 'Дэлгүүр', icon: 'i-lucide-store' },
    { number: 3, label: 'QPay', icon: 'i-lucide-smartphone' },
    { number: 4, label: 'Хүргэлт', icon: 'i-lucide-truck' }
]

// Facebook connection state
const isConnecting = ref(false)
const selectedPage = ref<FacebookPage | null>(null)

// Shop state
const qpayRegistered = ref(false)
const shopCreated = ref(false)

// Step 2 schema - shop info
const shopSchema = z.object({
    shop_name: z.string().min(2, 'Дэлгүүрийн нэр хамгийн багадаа 2 тэмдэгт байх ёстой')
})

type DeliveryType = 'none' | 'fixed' | 'free_over' | 'custom' | 'all_free'
// Full state
const state = reactive({
    facebook_page_id: 0,
    shop_name: '',
    phone_number: '',
    delivery_type: 'none' as DeliveryType,
    delivery_fee: 0,
    delivery_note: '',
    free_delivery_over: 0
})

const slideDirection = ref<'left' | 'right'>('left')

// Connect to Facebook
async function connectFacebook() {
    isConnecting.value = true
    await navigateTo(`${config.public.apiUrl}/api/connect/facebook`, { external: true })
}

watch(selectedPage, (newVal) => {
    if (newVal?.page_name) {
        state.shop_name = newVal.page_name
    }
})

const {
    data: facebookPages,
    pending: isLoadingPages,
    refresh: fetchFacebookPages
} = useLazyFetch<FacebookPage[]>(`${config.public.apiUrl}/api/connect/facebook/list`, {
    credentials: 'include',
    immediate: false
})

// On mount, check if user is returning from Facebook callback
onMounted(async () => {
    if (route.query.callback_status === 'connected' || user.value?.is_facebook_connected) {
        fetchFacebookPages()
    }

    // Load existing shop data if resuming onboarding
    await fetchShop()
    if (shop.value) {
        shopCreated.value = true
        state.shop_name = shop.value.name || state.shop_name
        state.phone_number = shop.value.phone_number || ''
        state.delivery_fee = shop.value.settings?.delivery_fee || 0
        state.delivery_note = shop.value.settings?.delivery_note || ''
        state.free_delivery_over = shop.value.settings?.free_delivery_over || 0

        // Check if QPay is already registered
        if (shop.value.qpay?.is_registered) {
            qpayRegistered.value = true
        }
    }
})

// Create shop (called after step 2)
async function createShop() {
    try {
        await $fetch(`${config.public.apiUrl}/api/onboarding`, {
            method: 'POST',
            credentials: 'include',
            body: {
                facebook_page_id: state.facebook_page_id,
                shop_name: state.shop_name,
                phone_number: state.phone_number,
                delivery_fee: state.delivery_fee,
                delivery_note: state.delivery_note,
                free_delivery_over: state.free_delivery_over
            }
        })
        shopCreated.value = true
        await fetchUser()
        await fetchShop()
        return true
    } catch (err: any) {
        toast.add({
            title: 'Алдаа',
            description: err.data?.message || 'Дэлгүүр үүсгэхэд алдаа гарлаа',
            color: 'error'
        })
        return false
    }
}

// Update shop settings (called on subsequent steps)
async function updateShopSettings() {
    if (!shop.value) return true // Skip if no shop yet

    try {
        await $fetch(`${config.public.apiUrl}/api/shops/my`, {
            method: 'PUT',
            credentials: 'include',
            body: {
                name: state.shop_name,
                phone_number: state.phone_number,
                settings: {
                    delivery_fee: state.delivery_fee,
                    delivery_note: state.delivery_note,
                    free_delivery_over: state.free_delivery_over
                }
            }
        })
        return true
    } catch (err: any) {
        console.error('Failed to update shop:', err)
        return true // Don't block navigation on update failure
    }
}

async function nextStep() {
    // Step 1: Facebook connection validation
    if (currentStep.value === 1) {
        if (!selectedPage.value) {
            toast.add({
                title: 'Анхааруулга',
                description: 'Facebook хуудас сонгоно уу',
                color: 'warning'
            })
            return
        }
        state.facebook_page_id = selectedPage.value.id
        if (state.shop_name === '') {
            state.shop_name = selectedPage.value.page_name
        }
    }

    // Step 2: Shop info validation and creation
    if (currentStep.value === 2) {
        const result = shopSchema.safeParse({ shop_name: state.shop_name })
        if (!result.success) {
            toast.add({
                title: 'Алдаа',
                description: result.error.issues[0]?.message || 'Мэдээллээ шалгана уу',
                color: 'error'
            })
            return
        }

        // Create shop after step 2
        if (!shopCreated.value) {
            isSavingStep.value = true
            const success = await createShop()
            isSavingStep.value = false
            if (!success) return
        } else {
            // Update existing shop
            isSavingStep.value = true
            await updateShopSettings()
            isSavingStep.value = false
        }
    }

    // Step 3: QPay - validation is optional, user can skip
    if (currentStep.value === 3) {
        // Just update settings and continue
        isSavingStep.value = true
        await updateShopSettings()
        isSavingStep.value = false
    }

    if (currentStep.value < totalSteps) {
        slideDirection.value = 'left'
        currentStep.value++
    }
}

function prevStep() {
    if (currentStep.value > 1) {
        slideDirection.value = 'right'
        currentStep.value--
    }
}

function skipQPayStep() {
    // Skip QPay registration and go to delivery
    slideDirection.value = 'left'
    currentStep.value++
}

function onQPaySuccess() {
    qpayRegistered.value = true
    toast.add({
        title: 'Амжилттай!',
        description: 'QPay бүртгэл амжилттай',
        color: 'success'
    })
    // Auto advance to next step
    nextStep()
}

async function onSubmit() {
    isSubmitting.value = true

    try {
        // Save final settings
        await updateShopSettings()

        toast.add({
            title: 'Амжилттай!',
            description: 'Таны дэлгүүр бэлэн боллоо',
            color: 'success'
        })

        navigateTo('/dashboard')
    } catch (err: any) {
        toast.add({
            title: 'Алдаа гарлаа',
            description: err.data?.message || 'Тохиргоо хадгалахад алдаа гарлаа',
            color: 'error'
        })
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div
        class="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
        <!-- Background decorations -->
        <div class="fixed inset-0 overflow-hidden pointer-events-none">
            <div
                class="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"
            />
            <div
                class="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"
            />
        </div>

        <div class="relative w-full max-w-lg">
            <!-- Progress stepper -->
            <div class="mb-8">
                <div class="flex items-center justify-between relative">
                    <!-- Progress line background -->
                    <div
                        class="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-800 mx-8"
                    />
                    <!-- Progress line active -->
                    <div
                        class="absolute top-5 left-0 h-0.5 bg-primary-500 mx-12 transition-all duration-500 ease-out"
                        :style="{
                            width: `calc(${((currentStep - 1) / (totalSteps - 1)) * 100}% - ${(currentStep - 1) * 3}rem)`
                        }"
                    />

                    <div
                        v-for="step in steps"
                        :key="step.number"
                        class="relative z-10 flex flex-col items-center gap-2"
                    >
                        <div
                            class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                            :class="[
                                currentStep >= step.number
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                    : 'bg-white dark:bg-gray-800 text-gray-400 border-2 border-gray-200 dark:border-gray-700'
                            ]"
                        >
                            <UIcon
                                v-if="currentStep > step.number"
                                name="i-lucide-check"
                                class="w-5 h-5"
                            />
                            <UIcon v-else :name="step.icon" class="w-5 h-5" />
                        </div>
                        <span
                            class="text-xs font-medium whitespace-nowrap transition-colors duration-300"
                            :class="
                                currentStep >= step.number
                                    ? 'text-primary-600 dark:text-primary-400'
                                    : 'text-gray-400 dark:text-gray-500'
                            "
                        >
                            {{ step.label }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Glass card -->
            <div
                class="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl shadow-gray-200/50 dark:shadow-gray-950/50 overflow-hidden"
            >
                <!-- Header -->
                <div class="px-8 pt-8 pb-4">
                    <Transition
                        :name="slideDirection === 'left' ? 'slide-left' : 'slide-right'"
                        mode="out-in"
                    >
                        <div v-if="currentStep === 1" key="header-1" class="text-center">
                            <div
                                class="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4"
                            >
                                <UIcon
                                    name="i-simple-icons-facebook"
                                    class="w-7 h-7 text-blue-500"
                                />
                            </div>
                            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                                Facebook холболт
                            </h1>
                            <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                                Facebook хуудсаа холбож онлайн борлуулалт эхлүүлээрэй
                            </p>
                        </div>

                        <div v-else-if="currentStep === 2" key="header-2" class="text-center">
                            <div
                                class="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4"
                            >
                                <UIcon name="i-lucide-store" class="w-7 h-7 text-primary-500" />
                            </div>
                            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                                Дэлгүүрээ үүсгээрэй
                            </h1>
                            <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                                Дэлгүүрийнхээ үндсэн мэдээллийг оруулна уу
                            </p>
                        </div>

                        <div v-else-if="currentStep === 3" key="header-3" class="text-center">
                            <div
                                class="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-4"
                            >
                                <UIcon name="i-lucide-smartphone" class="w-7 h-7 text-purple-500" />
                            </div>
                            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                                QPay бүртгэл
                            </h1>
                            <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                                QPay мерчант болж бүртгүүлнэ үү
                            </p>
                        </div>

                        <div v-else key="header-4" class="text-center">
                            <div
                                class="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4"
                            >
                                <UIcon name="i-lucide-truck" class="w-7 h-7 text-primary-500" />
                            </div>
                            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                                Хүргэлтийн тохиргоо
                            </h1>
                            <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                                Хүргэлтийн нөхцлөө тохируулна уу
                            </p>
                        </div>
                    </Transition>
                </div>

                <!-- Form content -->
                <div class="px-8 pb-8">
                    <Transition
                        :name="slideDirection === 'left' ? 'slide-left' : 'slide-right'"
                        mode="out-in"
                    >
                        <!-- Step 1: Facebook Connection -->
                        <div v-if="currentStep === 1" key="step-1" class="space-y-4">
                            <div v-if="!user?.is_facebook_connected" class="text-center space-y-4">
                                <UButton
                                    size="lg"
                                    icon="i-simple-icons-facebook"
                                    color="primary"
                                    @click="connectFacebook"
                                    :loading="isConnecting"
                                    block
                                >
                                    Facebook холбох
                                </UButton>
                            </div>

                            <div v-else-if="isLoadingPages" class="text-center py-8">
                                <UIcon
                                    name="i-lucide-loader-2"
                                    class="w-6 h-6 animate-spin text-gray-400"
                                />
                            </div>

                            <div
                                v-else-if="facebookPages && facebookPages.length > 0"
                                class="space-y-4"
                            >
                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                    Дараах Facebook хуудаснуудаас нэгийг сонгоно уу:
                                </p>

                                <div class="space-y-2">
                                    <label
                                        v-for="page in facebookPages"
                                        :key="page.id"
                                        class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200"
                                        :class="[
                                            selectedPage?.id === page.id
                                                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-blue-500/20'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                        ]"
                                    >
                                        <input
                                            v-model="selectedPage"
                                            type="radio"
                                            :value="page"
                                            class="sr-only"
                                        />
                                        <div
                                            class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                            :class="
                                                selectedPage?.id === page.id
                                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                            "
                                        >
                                            <UIcon name="i-simple-icons-facebook" class="w-5 h-5" />
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p
                                                class="text-sm font-semibold text-gray-900 dark:text-white truncate"
                                            >
                                                {{ page.page_name }}
                                            </p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">
                                                Page ID: {{ page.ref_id }}
                                            </p>
                                        </div>
                                        <div
                                            class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                                            :class="
                                                selectedPage?.id === page.id
                                                    ? 'border-blue-500 bg-blue-500'
                                                    : 'border-gray-300 dark:border-gray-600'
                                            "
                                        >
                                            <div
                                                v-if="selectedPage?.id === page.id"
                                                class="w-2 h-2 rounded-full bg-white"
                                            />
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div v-else class="text-center py-4 text-gray-500">
                                Facebook хуудас олдсонгүй
                            </div>
                        </div>

                        <!-- Step 2: Shop Info -->
                        <div v-else-if="currentStep === 2" key="step-2" class="space-y-4">
                            <UFormField label="Дэлгүүрийн нэр" required>
                                <UInput
                                    v-model="state.shop_name"
                                    placeholder="Миний дэлгүүр"
                                    size="lg"
                                    icon="i-lucide-store"
                                />
                            </UFormField>

                            <UFormField label="Утасны дугаар">
                                <UInput
                                    v-model="state.phone_number"
                                    placeholder="99001122"
                                    size="lg"
                                    icon="i-lucide-phone"
                                />
                            </UFormField>
                        </div>

                        <!-- Step 3: QPay Registration -->
                        <div
                            v-else-if="currentStep === 3"
                            key="step-3"
                            class="max-h-[60vh] overflow-y-auto -mx-2 px-2"
                        >
                            <div v-if="qpayRegistered" class="text-center py-8 space-y-4">
                                <div
                                    class="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto"
                                >
                                    <UIcon name="i-lucide-check" class="w-8 h-8 text-green-500" />
                                </div>
                                <p class="text-gray-600 dark:text-gray-400">
                                    QPay бүртгэл амжилттай хийгдсэн байна
                                </p>
                            </div>
                            <QPayMerchantForm v-else inline @success="onQPaySuccess" />
                        </div>

                        <!-- Step 4: Delivery Settings -->
                        <div v-else-if="currentStep === 4" key="step-4" class="space-y-4">
                            <Delivery
                                v-model:delivery_type="state.delivery_type"
                                v-model:delivery_fee="state.delivery_fee"
                                v-model:free_delivery_over="state.free_delivery_over"
                                v-model:delivery_note="state.delivery_note"
                            />
                        </div>
                    </Transition>

                    <!-- Navigation buttons -->
                    <div class="flex items-center justify-between mt-8 gap-3">
                        <UButton
                            v-if="currentStep > 1"
                            variant="ghost"
                            color="neutral"
                            icon="i-lucide-arrow-left"
                            @click="prevStep"
                        >
                            Өмнөх
                        </UButton>
                        <div v-else />

                        <div class="flex items-center gap-3">
                            <!-- Skip QPay button -->
                            <UButton
                                v-if="currentStep === 3 && !qpayRegistered"
                                variant="ghost"
                                color="neutral"
                                size="sm"
                                @click="skipQPayStep"
                            >
                                Дараа бүртгүүлэх
                            </UButton>

                            <!-- Skip delivery settings button -->
                            <UButton
                                v-if="currentStep === 4"
                                variant="ghost"
                                color="neutral"
                                size="sm"
                                @click="onSubmit"
                            >
                                Дараа тохируулах
                            </UButton>

                            <UButton
                                v-if="
                                    currentStep < totalSteps &&
                                    (currentStep !== 3 || qpayRegistered)
                                "
                                trailing-icon="i-lucide-arrow-right"
                                size="lg"
                                :loading="isSavingStep"
                                @click="nextStep"
                            >
                                {{
                                    currentStep === 2 && !shopCreated ? 'Дэлгүүр үүсгэх' : 'Дараах'
                                }}
                            </UButton>

                            <UButton
                                v-if="currentStep === totalSteps"
                                size="lg"
                                icon="i-lucide-rocket"
                                :loading="isSubmitting"
                                @click="onSubmit"
                            >
                                Дуусгах
                            </UButton>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Step indicator -->
            <p class="text-center text-sm text-gray-400 dark:text-gray-500 mt-6">
                Алхам {{ currentStep }} / {{ totalSteps }}
            </p>
        </div>
    </div>
</template>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.3s ease-out;
}

.slide-left-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.slide-left-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

.slide-right-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.slide-right-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.expand-enter-active,
.expand-leave-active {
    transition: all 0.3s ease-out;
    overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
    opacity: 0;
    max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
    max-height: 500px;
}
</style>
