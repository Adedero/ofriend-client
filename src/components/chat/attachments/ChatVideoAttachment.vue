<script setup>
import { computed, ref } from 'vue'
import { VideoPlayer } from 'vue-md-player'
import 'vue-md-player/dist/style.css'

const emit = defineEmits(['onFileSend', 'onCancelUpload'])
const file = ref(null)
const isUrlAvailable = ref(false)

const visible = computed(() => (file.value ? true : false))

const setFile = (event) => {
  if (!event.target.files[0].type.includes('video')) return;

  file.value = event.target.files[0];

  const reader = new FileReader()
  reader.readAsDataURL(file.value)
  reader.onload = () => {
    file.value.url = reader.result
    isUrlAvailable.value = true
  }
}

const sendFile = () => {
  emit('onFileSend', {
    file: file.value,
    fileUrl: file.value.url,
    caption: file.value.caption
  });
  file.value = null
  isUrlAvailable.value = false
}

const cancelUpload = () => {
  file.value = null
  isUrlAvailable.value = false
  emit('onCancelUpload')
}
</script>

<template>
  <Dialog v-model:visible="visible" modal :closable="false" class="max-w-full md:max-w-[32rem]">
    <template #header>
      <div class="flex items-center w-full justify-between">
        <h1 class="text-lg font-bold">Send video</h1>
        <Button @click="cancelUpload" outlined severity="secondary" icon="pi pi-times" rounded />
      </div>
    </template>

    <div class="card bg-primary p-1 rounded-md w-full">
      <div v-if="isUrlAvailable" class="grid gap-2 place-content-center w-full">
        <VideoPlayer v-if="file && isUrlAvailable" :src="file.url" />
        <div class="flex justify-between gap-2">
          <InputText v-model="file.caption" placeholder="Caption (optional)" class="flex-grow" />
          <Button @click="sendFile" severity="secondary" icon="pi pi-send" />
        </div>
      </div>

      <div v-else class="grid place-content-center w-full h-40">
        <span class="pi pi-spinner pi-spin text-white" style="font-size: 1.2rem"></span>
      </div>
    </div>
  </Dialog>

  <div>
    <label class="cursor-pointer flex flex-col items-center" for="video">
      <span
        class="p-3 aspect-square rounded-full grid place-content-center bg-green-400 text-white pi pi-video"
      ></span>
      <p class="text-xs text-center">Video</p>
    </label>
    <input @input="setFile" id="video" type="file" accept="video/*" class="hidden" />
  </div>
</template>
