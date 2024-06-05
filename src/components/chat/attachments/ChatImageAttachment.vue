<script setup>
import { computed, ref } from 'vue'

const emit = defineEmits(['onFileSend', 'onCancelUpload'])
const files = ref(null)
const isImageAvailable = ref(false)

const images = ref([])

const visible = computed(() => (files.value && files.value.length ? true : false))

const setFiles = (event) => {
  files.value = [...event.target.files]
  files.value.forEach((file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      images.value.push({
        file: file,
        imageURL: reader.result,
        caption: ''
      })
    }
  })
  isImageAvailable.value = true
}

const sendFiles = () => {
  emit('onFileSend', images.value)
  files.value = null
  images.value = []
  isImageAvailable.value = false
}

const cancelUpload = () => {
  files.value = null
  images.value = []
  isImageAvailable.value = false
  emit('onCancelUpload')
}
</script>

<template>
  <Dialog v-model:visible="visible" modal :closable="false" class="max-w-full md:max-w-[32rem]">
    <template #header>
      <div class="flex items-center w-full justify-between">
        <h1 class="text-lg font-bold">Send images</h1>
        <Button @click="cancelUpload" outlined severity="secondary" icon="pi pi-times" rounded />
      </div>
    </template>

    <div class="card bg-primary p-1 rounded-md w-full">
      <Carousel v-if="isImageAvailable" :value="images" :numVisible="1" :numScroll="1">
        <template #item="slotProps">
          <div class="grid place-content-center gap-2 max-w-96">
            <img
              :src="slotProps.data.imageURL"
              :alt="slotProps.data.name"
              class="w-full h-80 object-cover"
            />
            <InputText
              v-model="slotProps.data.caption"
              placeholder="Caption (optional)"
              class="w-full"
            />
          </div>
        </template>
      </Carousel>

      <Button
        @click="sendFiles"
        label="Send"
        severity="secondary"
        icon="pi pi-send"
        class="w-full"
      />
    </div>
  </Dialog>

  <div>
    <label class="cursor-pointer flex flex-col items-center" for="images">
      <span
        class="p-3 aspect-square rounded-full grid place-content-center bg-sky-400 text-white pi pi-images"
      ></span>
      <p class="text-xs text-center">Picture</p>
    </label>
    <input @input="setFiles" id="images" type="file" multiple accept="image/*" class="hidden" />
  </div>
</template>
