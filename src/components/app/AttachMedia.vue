<script setup>
import { ref } from 'vue'
import safeFileFormats from '@/data/safe-file-formats'

const emit = defineEmits(['onFileUpload', 'onCancelUpload'])

const formatsAsString = safeFileFormats.join(',') // Use join for comma separator

const files = ref([])
const firstFileURL = ref(null)

const onSelectFiles = (event) => {
  files.value = [...event.target.files]
  const reader = new FileReader()
  reader.readAsDataURL(event.target.files[0])
  reader.onload = (e) => {
    firstFileURL.value = e.target.result
  }
  emit('onFileUpload', files.value)
}

const onRemoveUploadedFiles = () => {
  files.value = []
  firstFileURL.value = null
  emit('onCancelUpload')
}
</script>

<template>
  <div class="relative">
    <label
      for="media"
      class="w-fit cursor-pointer flex items-center justify-center gap-1 p-2 rounded text-slate-500 hover:bg-soft-gray-2"
    >
      <span class="pi pi-images" style="font-size: 1.2rem"></span>
      <small class="font-semibold">Photo/video</small>
    </label>

    <input
      @input="onSelectFiles"
      id="media"
      type="file"
      multiple
      :accept="formatsAsString"
      class="hidden"
    />

    <div v-if="files.length" class="attachment-box">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="pi pi-paperclip text-slate-500"></span>
          <p class="text-slate-500 text-sm font-semibold">
            {{ files.length }} {{ files.length > 1 ? 'files' : 'file' }} attached
          </p>
        </div>
        <Button
          @click="onRemoveUploadedFiles"
          icon="pi pi-times-circle"
          severity="danger"
          text
          rounded
        />
      </div>

      <div
        v-if="firstFileURL"
        class="relative cursor-context-menu hover:brightness-75 transition-all"
      >
        <p
          v-if="files.length > 1"
          class="text-6xl absolute text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          + {{ files.length - 1 }}
        </p>
        <img :src="firstFileURL" alt="file-image" class="max-w-60" />
      </div>
    </div>
  </div>
</template>
