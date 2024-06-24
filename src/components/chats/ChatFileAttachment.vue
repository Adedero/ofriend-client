<script setup>
import { computed, ref } from 'vue';
import { safeFormats } from '@/data/safe-file-formats';

const emit = defineEmits(['onFileSend']);

const file = ref(null);
const error = ref({});
const visible = ref(false);
const fileUrl = ref(null);
const fileExtension = ref('');

const setFiles = (e) => {
  error.value.isError = false;
  error.value.msg = '';
  const att = e.target.files[0];
  const allowedSize = 25 * 1024 * 1024;
  if (att.size > allowedSize) {
    error.value.isError = true;
    error.value.msg = 'File size must not be greater than 25MB.';
    return;
  }
  fileExtension.value = att.name.split('.').pop().toLowerCase();
  if (!safeFormats.includes(fileExtension.value)) {
    error.value.isError = true;
    error.value.msg = 'File format not allowed.';
    return;
  }
  file.value = att;
  const reader = new FileReader()
  reader.readAsDataURL(file.value)
  reader.onload = () => fileUrl.value = reader.result;
  visible.value = true;
}

const fileType = computed(() => file.value ? file.value.type.split('/')[0] : '');

const onSend = () => {
  const data = {
    file: file.value,
    type: file.value.type,
    url: fileUrl.value,
    name: file.value.name,
    extension: fileExtension.value
  }
  emit('onFileSend', data);
  reset();
}

const reset = () => {
  visible.value = false;
  file.value = null;
  fileUrl.value = null;
  error.value = {};
}
</script>

<template>
  <div class="relative">
    <Dialog v-model:visible="visible" modal header="Send file" :style="{ width: '25rem' }">
      <div v-if="fileUrl" class="flex flex-col gap-3">
        <div v-if="fileType === 'image'">
          <Image :src="fileUrl" :alt="file.name" />
        </div>

        <div v-if="fileType === 'audio'">
          <audio controls class="w-full">
            <source :src="fileUrl" :type="file.type">
            Your browser does not support the audio tag.
          </audio>
        </div>

        <div v-if="fileType === 'video'">
          <video controls>
            <source :src="fileUrl" :type="file.type">
          </video>
        </div>

        <div v-if="fileType === 'application'" class="flex items-center p-1 gap-2">
          <div class="p-2 rounded bg-primary text-white">
            {{ fileExtension.toUpperCase() }}
          </div>
          <p class="max-w-full truncate">{{ file.name }}</p>
        </div>

        <Button @click="onSend" label="Send" icon="pi pi-send" class="btn w-full" />
      </div>
    </Dialog>

    <Message v-if="error.isError" class="absolute -top-[4.5rem] w-96 text-sm" severity="error">{{ error.msg }}</Message>
    <label class="rounded-md cursor-pointer flex flex-col items-center p-3" for="attachment">
      <span class="text-white pi pi-paperclip" style="font-size: 0.8rem"></span>
    </label>
    <input @input="setFiles" @cancel="reset" id="attachment" type="file" class="hidden" />
  </div>
</template>