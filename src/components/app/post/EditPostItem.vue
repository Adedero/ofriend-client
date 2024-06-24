<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import visibilityOptions from '@/data/visibilty';
import useFirebaseUpload from '@/composables/utils/firebase-upload';
import { usePost } from '@/composables/utils/use-fetch';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { addToast, useToastError } from '@/composables/utils/add-toast';


const props = defineProps({ post: { type: Object, required: true } });
const emit = defineEmits(['onPostEdited']);

const router = useRouter();

const editedPost = ref(null);

const toast = useToast();

const text = ref(props.post.textContent || '');
const status = ref(visibilityOptions.find(opt => opt.name === props.post.status));
const media = ref(props.post.media || []);
const addedMedia = ref([]);
const hasNewMedia = computed(() => addedMedia.value.length > 0);

const handleFileUpload = (data) => addedMedia.value.push(...data);

const removeMedia = (id) => media.value = media.value.filter(item => item._id !== id);

const removeAddedMedia = (id) => addedMedia.value = addedMedia.value.filter(item => item._id !== id);

const handleCancelUpload = () => {
  media.value = props.post.media || [];
  addedMedia.value = [];
}

const res = ref({});
const loading = ref(false);

const saveEdit = async () => {
  if (!text.value && !media.value.length) return;
  if (text.value === props.post.textContent) return;
  editedPost.value = {
    hasText: text.value.length > 0,
    textContent: text.value,
    media: media.value,
    status: status.value.name.toUpperCase(),
    isEdited: true
  }

  loading.value = true;
  if (hasNewMedia.value) {
    try {
      const files = await Promise.all(addedMedia.value.map(async (file) => {
        const [url] = await useFirebaseUpload().uploadSingleFile('POSTS', file);
        return {
          url: url,
          type: file.type
        }
      }));

      editedPost.value.media.push(...files);

    } catch (error) {
      useToastError(toast, error)
      console.error(error);
      loading.value = false;
    }
  }
  //console.log(editedPost.value)
  editedPost.value.hasMedia = editedPost.value.media.length > 0;
  
  res.value = await usePost(`api/edit-post/${props.post._id}`, { edit: editedPost.value }, 'PUT');
  loading.value = false;
  addToast(res.value, toast);

  if (res.value.status !== 200) {
    //Do something
  }

  router.push(`/app/post/${props.post._id}`);
  emit('onPostEdited');
  text.value = props.post.textContent || '';
  status.value = visibilityOptions.find(opt => opt.name === props.post.status);
  media.value = props.post.media || [];
  addedMedia.value = [];

}
</script>

<template>
  <div>
    <Toast class="max-w-96" />
    <div v-if="media.length || addedMedia.length" class="w-full rounded-md border overflow-x-auto h-40 mb-2 flex items-center gap-3">
      <div v-for="item in media" :key="item._id" @mouseover="item.isHovering = true" @mouseout="item.isHovering = false"
        @click="removeMedia(item._id)"
        class="hover:brightness-50 transition cursor-pointer relative flex-shrink-0 h-36 aspect-square overflow-hidden">

        <img v-if="item.type.includes('image')" :src="item.url" alt="image" class="w-full h-full object-cover">
        <span v-show="item.type.includes('image')"
          class="pi pi-image absolute left-1 text-white top-1 p-2 bg-primary rounded-full"></span>

        <video v-if="item.type.includes('video')" :src="item.url" class="w-full h-full object-cover"></video>
        <span v-show="item.type.includes('video')"
          class="pi pi-video absolute left-1 text-white top-1 p-2 bg-primary rounded-full"></span>

        <span
          :class="['transition-all pi pi-times text-white absolute top-1/2 left-1/2 -translate-x-1/2', item.isHovering ? '-translate-y-1/2 opacity-100 scale-125' : 'translate-y-2 opacity-0']"
          style="font-size: 2.5rem; font-weight: light"></span>
      </div>

      <div v-for="item in addedMedia" :key="item._id" @mouseover="item.isHovering = true" @mouseout="item.isHovering = false"
        @click="removeAddedMedia(item._id)"
        class="hover:brightness-50 transition cursor-pointer relative flex-shrink-0 h-36 aspect-square overflow-hidden">

        <img v-if="item.type.includes('image')" :src="item.url" alt="image" class="w-full h-full object-cover">
        <span v-show="item.type.includes('image')"
          class="pi pi-image absolute left-1 text-white top-1 p-2 bg-primary rounded-full"></span>

        <video v-if="item.type.includes('video')" :src="item.url" class="w-full h-full object-cover"></video>
        <span v-show="item.type.includes('video')"
          class="pi pi-video absolute left-1 text-white top-1 p-2 bg-primary rounded-full"></span>

        <span
          :class="['transition-all pi pi-times text-white absolute top-1/2 left-1/2 -translate-x-1/2', item.isHovering ? '-translate-y-1/2 opacity-100 scale-125' : 'translate-y-2 opacity-0']"
          style="font-size: 2.5rem; font-weight: light"></span>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <EditPostAttachMedia @onFileUpload="handleFileUpload" @onCancelUpload="handleCancelUpload"
        :mediaLength="media.length" />

      <div class="flex items-center justify-end gap-2">
        <p class="text-[0.8rem] font-medium">Who can see this?</p>
        <Dropdown v-model="status" :options="visibilityOptions" option-label="desc"
          input-class="text-[0.8rem] h-7 flex items-center px-1" />
      </div>
    </div>

    <div class="flex flex-col cs-2:flex-row cs-2:items-end gap-3 mt-2">
      <Textarea v-if="post.hasText" v-model.trim="text" rows="1" auto-resize class="textarea max-h-80 flex-grow" />
      <Button :loading @click="saveEdit" label="Save" icon="pi pi-check" class="btn h-10 flex-shrink-0 w-fit self-end" />
    </div>
  </div>
</template>

<style>
.textarea {
  @apply  outline-none bg-soft-gray-2 focus:bg-white focus:border-primary
}
</style>
