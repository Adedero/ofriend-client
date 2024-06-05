<script setup>
import { computed, ref } from 'vue';
const emit = defineEmits(['onFileUpload']);
const formats = ".jpg,.jpeg,.png,.gif,.mp4.,.mpeg";

const file = ref(null);
const isUploaded = computed(() => file.value ? true : false);

const setFile = (event) => {
  file.value = event.target.files[0];
  emit('onFileUpload', file.value);
};
const cancelUpload = () => file.value = null;

</script>

<template>
  <div class="relative grid place-content-center  w-fit">
    <Chip v-if="isUploaded" @remove="cancelUpload" label="file attached" icon="pi pi-paperclip" removable
      class="absolute bg-primary text-white py-2 rounded-full w-40 bottom-12 text-sm font-semibold" />

    <label for="media" class="cursor-pointer p-3 h-9 grid place-content-center text-slate-500 bg-soft-gray rounded-md">
      <span class="pi pi-images" style="font-size: 1.2rem"></span>
    </label>
    <input @input="setFile" id="media" type="file" :accept="formats" class="hidden">
  </div>
</template>