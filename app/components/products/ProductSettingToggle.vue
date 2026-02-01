<script setup lang="ts">
interface Props {
  label: string
  description?: string
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div class="flex items-start justify-between gap-4 py-3 cursor-pointer group" @click="toggle">
    <div class="flex-1 min-w-0">
      <p
        class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
      >
        {{ label }}
      </p>
      <p v-if="description" class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
        {{ description }}
      </p>
    </div>
    <USwitch
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
      @click.stop
    />
  </div>
</template>
