<script setup>
import { computed, ref } from 'vue'
import { safeDocFormats } from '@/data/safe-file-formats'

const emit = defineEmits(['onFileSend', 'onCancelUpload'])

const formats = safeDocFormats.toString()
const file = ref(null)
const visible = computed(() => (file.value ? true : false))
const setFile = (event) => (file.value = event.target.files[0])
const sendFile = () => {
  emit('onFileSend', file.value)
  file.value = null
}
const cancelUpload = () => {
  file.value = null
  emit('onCancelUpload')
}
</script>

<template>
  <Dialog v-model:visible="visible" modal :closable="false" class="w-80">
    <template #header>
      <div class="flex items-center w-full justify-between">
        <h1 class="text-lg font-bold">Send document</h1>
        <Button @click="cancelUpload" outlined severity="secondary" icon="pi pi-times" rounded />
      </div>
    </template>

    <div
      class="card bg-primary text-white p-2 flex gap-2 items-center rounded-md w-full overflow-x-hidden"
    >
      <span class="pi pi-paperclip"></span>
      <span class="truncate">{{ file.name }}</span>
    </div>

    <div class="mt-2 w-full">
      <Button
        @click="sendFile"
        label="Send"
        severity="secondary"
        icon="pi pi-send"
        class="w-full"
      />
    </div>
  </Dialog>

  <div>
    <label class="cursor-pointer flex flex-col items-center" for="document">
      <span
        class="p-3 aspect-square rounded-full grid place-content-center bg-red-400 text-white pi pi-file"
      ></span>
      <p class="text-xs text-center">Document</p>
    </label>
    <input @input="setFile" id="document" type="file" :accept="formats" class="hidden" />
  </div>
</template>
