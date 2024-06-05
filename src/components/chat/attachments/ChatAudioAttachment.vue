<script setup>
import { computed, ref } from 'vue';
import { AudioPlayer } from 'vue-md-player';
import 'vue-md-player/dist/style.css';

const emit = defineEmits(['onFileSend', 'onCancelUpload'])
const file = ref(null);
const isUrlAvailable = ref(false);

const visible = computed(() => file.value ? true : false);

const setFile = (event) => {
  file.value = event.target.files[0];

  const reader = new FileReader();
  reader.readAsDataURL(file.value);
  reader.onload = () => {
    file.value.url = reader.result;
    isUrlAvailable.value = true;
  }
};

const sendFile = () => {
  emit('onFileSend', file.value);
  file.value = null;
  isUrlAvailable.value = false;
}

const cancelUpload = () => {
  file.value = null;
  isUrlAvailable.value = false;
  emit('onCancelUpload');
};

</script>

<template>
  <Dialog v-model:visible="visible" modal :closable="false" class="w-80">
    <template #header>
      <div class="flex items-center w-full justify-between">
        <h1 class="text-lg font-bold">Send audio</h1>
        <Button @click="cancelUpload" outlined severity="secondary" icon="pi pi-times" rounded />
      </div>
    </template>

    <div class="card bg-primary p-2 rounded-md w-full">
      <div v-if="isUrlAvailable" class="grid gap-2 w-full">
        <AudioPlayer v-if="file && isUrlAvailable" light :src="file.url" class="w-full rounded-md" />
        <Button @click="sendFile" label="Send" severity="secondary" icon="pi pi-send" class="w-full" />
      </div>

      <div v-else class="grid place-content-center w-full h-40">
        <span class="pi pi-spinner pi-spin text-white" style="font-size: 1.2rem"></span>
      </div>
    </div>
  </Dialog>

  <div>
    <label class="cursor-pointer flex flex-col items-center" for="audio">
      <span
        class="p-3 aspect-square rounded-full grid place-content-center bg-purple-400 text-white pi pi-headphones"></span>
      <p class="text-xs text-center">Audio</p>
    </label>
    <input @input="setFile" id="audio" type="file" accept="audio/*" class="hidden">
  </div>
</template>