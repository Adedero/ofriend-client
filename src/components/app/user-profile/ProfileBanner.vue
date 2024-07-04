<script setup>
import { ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { usePost } from '@/composables/utils/use-fetch';
import { addToast, useToastError } from '@/composables/utils/add-toast';
import useFirebaseUpload from '@/composables/utils/firebase-upload';
import Toast from 'primevue/toast';

const firebaseUpload = useFirebaseUpload();
const toast = useToast();

const props = defineProps({
  bannerImageUrl: {
    type: String,
    required: true
  },
  isViewingSelf: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['onBannerImageChange']);

const imageUrl = ref(props.bannerImageUrl);
watch(
  () => props.bannerImageUrl,
  () => imageUrl.value = props.bannerImageUrl
)
const file = ref(null);
const isEditing = ref(false);

const setFile = async (event) => {
  const image = event.target.files[0];
  if (!image.type.includes('image')) return;
  file.value = image;
  const reader = new FileReader();
  reader.readAsDataURL(file.value);
  reader.onload = (e) => {
    imageUrl.value = e.target.result;
  }
}

const cancelUpload = () => {
  file.value = null;
  imageUrl.value = props.bannerImageUrl;
  isEditing.value = false;
}

const loading = ref(false);

const updateBannerImage = async () => {
  loading.value = true;
  try {
    if (props.bannerImageUrl) {
      const error = await firebaseUpload.deleteMultipleFiles([props.bannerImageUrl]);
      if (error) return useToastError(toast, error);
    }

    const [url, error] = await firebaseUpload.uploadSingleFile('PROFILES', file.value);
    if (error) return addToast(error, toast, false);

    const res = await usePost('api/update-banner-image-url', { imageUrl: url }, 'PUT');
    if (res.status.value !== 200) return;
    imageUrl.value = url;
    file.value = null;
    isEditing.value = false;
    emit('onBannerImageChange', url);
  } catch (error) {
    console.log(error);
    useToastError(toast, error)
  } finally {
    loading.value = false;
    cancelUpload();
  }
}
</script>

<template>
  <Toast class="max-w-96" />
  <div class="relative">
    <div id="banner-bg" class="aspect-[16/8] md:aspect-[16/6] bg-slate-200">
      <Image v-if="imageUrl" :src="imageUrl" preview alt="banner image" class="w-full h-full overflow-hidden"
        image-class="w-full h-full object-cover object-center" />
    </div>
    <Button v-if="isViewingSelf" @click="isEditing? cancelUpload() : isEditing = true" icon="pi pi-camera" rounded
      severity="secondary" class="absolute z-10 right-2 bottom-2" />

    <div v-if="isEditing" class="bg-white border rounded-xl absolute right-0 z-10 p-2 w-60">
      <div class="text-sm">
        <input @input="setFile" @cancel="cancelUpload" type="file" id="banner-image" accept="image/*" class="hidden">
        <label for="banner-image"
          class="justify-center font-medium px-2 py-3 cursor-pointer rounded-md flex items-center gap-2 bg-slate-200">
          <span class="pi pi-upload"></span>
          <span class="truncate">{{ file ? file.name : 'Upload image' }}</span>
        </label>
      </div>
      <Divider />
      <div class="mt-4 grid grid-cols-2 gap-3">
        <Button @click="cancelUpload" label="Cancel" severity="secondary" class="w-full" />
        <Button @click="updateBannerImage" :loading label="Save" class="w-full btn" />
      </div>
    </div>
  </div>

</template>
