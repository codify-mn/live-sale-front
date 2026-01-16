<script setup lang="ts">
interface Props {
  modelValue: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement>()

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files) {
    handleFiles(files)
  }
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    handleFiles(target.files)
  }
}

const handleFiles = (files: FileList) => {
  // In real app, upload to server and get URLs
  // For now, create object URLs for preview
  const newUrls = Array.from(files).map(file => URL.createObjectURL(file))
  emit('update:modelValue', [...props.modelValue, ...newUrls])
}

const removeImage = (index: number) => {
  const newImages = [...props.modelValue]
  newImages.splice(index, 1)
  emit('update:modelValue', newImages)
}

const openFilePicker = () => {
  fileInput.value?.click()
}
</script>

<template>
  <div class="space-y-3">
    <!-- Image Preview Grid -->
    <div v-if="modelValue.length > 0" class="grid grid-cols-4 gap-2">
      <div
        v-for="(img, index) in modelValue"
        :key="index"
        class="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 group"
      >
        <img :src="img" class="w-full h-full object-cover" alt="">
        <button
          type="button"
          class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          @click="removeImage(index)"
        >
          <UIcon name="i-lucide-x" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Upload Area -->
    <div
      class="relative border-2 border-dashed rounded-xl p-8 text-center transition-colors"
      :class="[
        isDragging
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        @change="handleFileSelect"
      >

      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Зөвхөн PNG, JPG, WEBP ба ихдээ 1 MB оруулах боломжтой
      </p>

      <div class="flex items-center justify-center gap-3">
        <UButton
          type="button"
          color="neutral"
          variant="outline"
          icon="i-lucide-upload"
          @click="openFilePicker"
        >
          Зураг оруулах
        </UButton>

        <UButton
          type="button"
          color="primary"
          icon="i-lucide-sparkles"
        >
          AI зураг үүсгэх
        </UButton>
      </div>

      <p class="text-xs text-gray-400 mt-4">эсвэл</p>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Зураг холбоосоор оруулах
      </p>
    </div>
  </div>
</template>
