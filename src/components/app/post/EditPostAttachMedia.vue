<script setup>
import { onUnmounted, ref } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import safeFileFormats from '@/data/safe-file-formats';

const MAX_MEDIA = 20;
const toast = useToast();
const props = defineProps({ mediaLength: { type: Number } });
const emit = defineEmits(['onFileUpload', 'onCancelUpload']);

const formatsAsString = safeFileFormats.join(',') // Use join for comma separator

const files = ref([]);

const onSelectFiles = async(event) => {
  const totalFilesAllowed = MAX_MEDIA - props.mediaLength ?? 0;
  if (event.target.files.length > totalFilesAllowed) {
    toast.add({ severity: 'warn', info: 'Too many files', detail: 'You can only upload up to 20 files in one post.', life: 5000 });
    return;
  }
  const invalidUpload = [...event.target.files].some(file => {
    const fileType = file.type.split('/')[0];
    return fileType !== 'image' && fileType !== 'video';
  });

  if (invalidUpload) {
    toast.add({ severity: 'warn', info: 'Invalid files', detail: 'You can only upload photos or videos', life: 5000 });
    return;
  }
  files.value = [...event.target.files];
  
  for (const file of files.value) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    file._id = `${timestamp}${randomString}`;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => file.url = e.target.result;
  }
  emit('onFileUpload', files.value);
}

const onRemoveUploadedFiles = () =>{
  files.value = []
  emit('onCancelUpload')
}

onUnmounted(() => onRemoveUploadedFiles());
</script>

<template>
  <div class="relative">
    <Toast class="max-w-96" />

    <label for="edit-post-media"
      class="w-fit cursor-pointer flex items-center justify-center gap-1 p-2 rounded text-slate-500 hover:bg-soft-gray-2">
      <span class="pi pi-images" style="font-size: 1.2rem"></span>
      <small class="font-semibold">Photo/video</small>
    </label>

    <input @input="onSelectFiles" @cancel="onRemoveUploadedFiles" id="edit-post-media" type="file" multiple
      :accept="formatsAsString" class="hidden" />
  </div>
</template>