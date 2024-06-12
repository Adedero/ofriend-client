<script setup>
import { ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { usePost } from '@/composables/utils/use-fetch';
import { addToast, useToastError } from '@/composables/utils/add-toast';
import { useUserStore } from '@/stores/user';
import useFirebaseUpload from '@/composables/utils/firebase-upload';
import Toast from 'primevue/toast';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['onProfilePictureChange']);
const userStore = useUserStore();
const firebaseUpload = useFirebaseUpload();
const toast = useToast();
const file = ref(null);
const imageUrl = ref(props.user.imageUrl);
watch(
  () => props.user.imageUrl,
  () => imageUrl.value = props.user.imageUrl
)

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
  imageUrl.value = props.user.imageUrl
}

const loading = ref(false);
const uploadPhoto = async () => {
  loading.value = true;
  try {
    if (props.user.imageUrl) {
      const error = await firebaseUpload.deleteFiles([props.user.imageUrl]);
      if (error) return useToastError(toast, error);
    }

    const [url, error] = await firebaseUpload.uploadSingleFile('PROFILES', file.value);
    if (error) return addToast(error, toast, false);
     
    const res = await usePost('api/update-image-url', { imageUrl: url }, 'PUT');
    if (res.status.value !== 200) return;
    imageUrl.value = url;
    userStore.setUser({
      ...userStore.user,
      imageUrl: url
    })
    file.value = null;
    emit('onProfilePictureChange', url);
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
  <div id="profile-pic"
    class="relative w-full h-full border-[3px] aspect-square rounded-full lg:border-[4px] border-white">
    <Toast class="max-w-96" />
    <Image v-if="imageUrl" :src="imageUrl" preview class="w-full h-full rounded-full overflow-hidden"
      image-class="h-full  w-full object-cover object-center" />

    <Avatar v-else :label="user.name[0]" shape="circle" class="text-6xl w-full h-full bg-accent/30" />

    <div v-if="user.isViewingSelf && !file" class="absolute right-0 bottom-2">
      <input @input="setFile" @cancel="cancelUpload" type="file" id="profile-image" accept="image/*" class="hidden">
      <label for="profile-image"
        class="justify-center font-medium p-3 rounded-full cursor-pointer flex items-center gap-2 bg-slate-100 hover:bg-slate-200">
        <span class="pi pi-camera"></span>
      </label>
    </div>

    <div v-if="user.isViewingSelf && file" class="absolute right-0 bottom-2">
      <Button @click="uploadPhoto" rounded :loading icon="pi pi-check" class="text-accent" />
    </div>

    <div v-if="user.isViewingSelf && file && !loading" class="absolute -right-12 bottom-2">
      <Button @click="cancelUpload" rounded icon="pi pi-times" outlined severity="danger" />
    </div>
  </div>
</template>
