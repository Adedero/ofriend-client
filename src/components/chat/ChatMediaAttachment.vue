<script setup>
import { ref } from 'vue';

/* const cameraFile = ref(null);
const images = ref(null);
const video = ref(null);
const documents = ref(null); */

const op = ref();
const toggle = (event) => op.value.toggle(event);
</script>


<template>
  <div>
    <Button @click="toggle" text severity="secondary" icon="pi pi-paperclip" />
    <OverlayPanel ref="op">
      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="cursor-pointer flex flex-col items-center" for="camera">
            <span
              class="p-3 aspect-square rounded-full grid place-content-center bg-orange-400 text-white pi pi-camera"></span>
            <p class="text-xs text-center">Camera</p>
          </label>
          <input id="camera" type="file" class="hidden">
        </div>

        <div>
          <label class="cursor-pointer flex flex-col items-center" for="media">
            <span
              class="p-3 aspect-square rounded-full grid place-content-center bg-sky-400 text-white pi pi-images"></span>
            <p class="text-xs text-center">Picture</p>
          </label>
          <input id="media" type="file" class="hidden">
        </div>

        <div>
          <label class="cursor-pointer flex flex-col items-center" for="media">
            <span
              class="p-3 aspect-square rounded-full grid place-content-center bg-green-400 text-white pi pi-video"></span>
            <p class="text-xs text-center">Video</p>
          </label>
          <input id="media" type="file" class="hidden">
        </div>

        <div>
          <label class="cursor-pointer flex flex-col items-center" for="document">
            <span
              class="p-3 aspect-square rounded-full grid place-content-center bg-red-400 text-white pi pi-file"></span>
            <p class="text-xs text-center">Document</p>
          </label>
          <input id="document" type="file" class="hidden">
        </div>
      </div>
    </OverlayPanel>
  </div>
</template>

<style lang="scss" scoped></style>