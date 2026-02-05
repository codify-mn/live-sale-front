<script setup lang="ts">
const props = withDefaults(defineProps<{
  length?: number
  autofocus?: boolean
}>(), {
  length: 6,
  autofocus: true
})

const emit = defineEmits<{
  complete: [value: string]
}>()

const value = defineModel<string | string[]>({ default: [] })

const otpValue = computed({
  get: () => {
    if (typeof value.value === 'string') {
      return value.value.split('')
    }
    return value.value as string[]
  },
  set: (val: string[]) => {
    if (Array.isArray(value.value)) {
      value.value = val
    } else {
      value.value = val.join('')
    }
  }
})

const onComplete = (e: string[]) => {
  const code = Array.isArray(e) ? e.join('') : e
  emit('complete', code)
}
</script>

<template>
  <UPinInput
    v-model="otpValue"
    :length="length"
    :autofocus="autofocus"
    otp
    @complete="onComplete"
  />
</template>
