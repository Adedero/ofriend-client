<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['onFileSend', 'onCancelUpload'])

const file = ref(null)
const fileURL = ref(null)
const caption = ref('')
const visible = computed(() => (file.value ? true : false))

const setFile = (event) => {
  file.value = event.target.files[0]
  const reader = new FileReader()
  reader.readAsDataURL(file.value)
  reader.onload = () => (fileURL.value = reader.result)
}

const cancelUpload = () => {
  file.value = null
  fileURL.value = null
  caption.value = ''
  emit('onCancelUpload')
}

const sendFile = () => {
  emit('onFileSend', {
    file: file.value,
    caption: caption.value
  })
  cancelUpload()
}
</script>

<template>
  <Dialog v-model:visible="visible" modal :closable="false" class="max-w-96">
    <template #header>
      <div class="flex items-center w-full justify-between">
        <h1 class="text-lg font-bold">Send image</h1>
        <Button @click="cancelUpload" outlined severity="secondary" icon="pi pi-times" rounded />
      </div>
    </template>

    <div class="p-2 bg-primary rounded-md grid gap-3 place-content-center">
      <img v-if="fileURL" :src="fileURL" alt="file.name" class="max-w-full" />

      <div class="flex gap-2 justify-between">
        <InputText filled v-model="caption" placeholder="Caption (optional)" class="flex-grow" />
        <Button
          @click="sendFile"
          rounded
          severity="secondary"
          icon="pi pi-send"
          class="flex-shrink-0"
        />
      </div>
    </div>
  </Dialog>

  <div>
    <label class="cursor-pointer flex flex-col items-center" for="camera">
      <span
        class="p-3 aspect-square rounded-full grid place-content-center bg-orange-400 text-white pi pi-camera"
      ></span>
      <p class="text-xs text-center">Camera</p>
    </label>
    <input
      @input="setFile"
      id="camera"
      type="file"
      accept="image/*"
      capture="environment"
      class="hidden"
    />
  </div>
</template>
