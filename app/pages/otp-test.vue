<script setup lang="ts">
const otpValue = ref('')

const handleComplete = (code: string) => {
    alert(`OTP Completed: ${code}`)
}
</script>

<template>
    <div class="p-8 flex flex-col items-center gap-4">
        <h1 class="text-2xl font-bold">OTP Input Test</h1>

        <OtpInput v-model="otpValue" :length="6" @complete="handleComplete" />

        <div class="mt-4">Current Value: {{ otpValue }}</div>
    </div>
</template>
