<script setup>
import { onUnmounted, ref } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import safeFileFormats from '@/data/safe-file-formats';

const MAX_MEDIA = 20;
const toast = useToast();
const emit = defineEmits(['onFileUpload', 'onCancelUpload']);

const formatsAsString = safeFileFormats.join(',') // Use join for comma separator

const files = ref([])
const firstFileURL = ref(null);

const isUploading = ref(false);

const onSelectFiles = (event) => {
  if (event.target.files.length > MAX_MEDIA) {
    toast.add({ severity: 'warn', info: 'Too many files', detail: 'You can only upload up to 20 files in one post.', life: 5000 });
    return;
  }
  isUploading.value = true;
  const invalidUpload = [...event.target.files].some(file => {
    const fileType = file.type.split('/')[0];
    return fileType !== 'image' && fileType !== 'video';
  });

  if(invalidUpload) {
    toast.add({ severity: 'warn', info: 'Invalid files', detail: 'You can only upload photos or videos', life: 5000 });
    isUploading.value = false;
    return;
  }
  files.value = [...event.target.files];
  const reader = new FileReader()
  reader.readAsDataURL(event.target.files[0])
  reader.onload = (e) => {
    firstFileURL.value = e.target.result
  }
  emit('onFileUpload', files.value);
  isUploading.value = false;
}

const isImage = (file) => {
  if (file.type.split('/')[0] === 'image') return true;
  return false;
}

const isVideo = (file) => {
  if (file.type.split('/')[0] === 'video') return true;
  return false;
}

const onRemoveUploadedFiles = () => {
  files.value = []
  firstFileURL.value = null
  emit('onCancelUpload')
}

onUnmounted(() => onRemoveUploadedFiles());
</script>

<template>
  <Toast class="max-w-96" />
  <div class="relative">
    <label for="media"
      class="w-fit cursor-pointer flex items-center justify-center gap-1 p-2 rounded text-slate-500 hover:bg-soft-gray-2">
      <span class="pi pi-images" style="font-size: 1.2rem"></span>
      <small class="font-semibold">Photo/video</small>
    </label>

    <input @input="onSelectFiles" @cancel="onRemoveUploadedFiles" id="media" type="file" multiple :accept="formatsAsString" class="hidden" />

    <div v-if="files.length" class="attachment-box">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="pi pi-paperclip text-slate-500"></span>
          <p class="text-slate-500 text-sm font-semibold">
            {{ files.length }} {{ files.length > 1 ? 'files' : 'file' }} attached
          </p>
        </div>
        <Button @click="onRemoveUploadedFiles" icon="pi pi-times-circle" severity="danger" text rounded />
      </div>

      <div v-if="isUploading" class="grid place-content-center">
        <span class="pi pi-spinner pi pi-spin text-accent" style="font-size: 1.2rem"></span>
      </div>

      <div v-else>
        <div v-if="firstFileURL" class="relative cursor-context-menu hover:brightness-75 transition-all">
          <p v-if="files.length > 1"
            class="text-6xl absolute text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            + {{ files.length - 1 }}
          </p>
          <img v-if="isImage(files[0])" :src="firstFileURL" alt="file-image" class="max-w-60">
          <video v-if="isVideo(files[0])" controls :src="firstFileURL" class="max-w-60"></video>
        </div>
      </div>
    </div>
  </div>
</template>
