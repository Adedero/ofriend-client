<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import visibilityOptions from '@/data/visibilty';
import useFirebaseUpload from '@/composables/utils/firebase-upload';
import { usePost } from '@/composables/server/use-fetch';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { revertHTML } from '@/composables/utils/html-parse';
import filterMentions from '@/composables/utils/filter-mentions';


const props = defineProps({ post: { type: Object, required: true } });

const emit = defineEmits(['onPostEdited']);

const router = useRouter();
const route = useRoute();

const firebase = useFirebaseUpload();
const toast = useToast();


const editedPost = ref(null);

const text = ref(revertHTML(props.post.textContent) || '');

const status = ref(visibilityOptions.find(opt => opt.name === props.post.status));

const mentions = ref(props.post.mentions || []);
const filteredMentions = ref([]);

const media = ref(props.post.media || []);
const addedMedia = ref([]);

const removedMedia = ref([]);

const hasNewMedia = computed(() => addedMedia.value.length > 0);

const handleFileUpload = (data) => addedMedia.value.push(...data);

const removeMedia = (id) => {
  const removedItem = media.value.find(item => item._id === id);
  removedMedia.value.push(removedItem);
  media.value = media.value.filter(item => item._id !== id);
}

const removeAddedMedia = (id) => addedMedia.value = addedMedia.value.filter(item => item._id !== id);

const handleCancelUpload = () => {
  media.value = props.post.media || [];
  addedMedia.value = [];
}


const loading = ref(false);

const saveEdit = async () => {
  if (!text.value.length && !media.value.length) return;

  if (text.value === props.post.textContent) return;

  editedPost.value = {
    hasText: text.value.length > 0,
    media: media.value,
    status: status.value.name.toUpperCase(),
    isEdited: true,
  }

  loading.value = true;

  /* if (removedMedia.value.length) {
    const urlArray = removedMedia.value.map(item => item.url);
    await firebase.deleteMultipleFiles(urlArray);
    removedMedia.value = [];
  }

  if (hasNewMedia.value) {
    const [fileArray, error] = await firebase.uploadMultipleFiles('POSTS', addedMedia.value);
    if (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload files. Please, check your network connection and try again later.' });
      loading.value = false;
      return;
    }
    editedPost.value.media.push(...fileArray);
  } */

  const deleteFiles = removedMedia.value.length
    ? firebase.deleteMultipleFiles(removedMedia.value.map(item => item.url))
    : Promise.resolve();

  const uploadFiles = hasNewMedia.value
    ? firebase.uploadMultipleFiles('POSTS', addedMedia.value)
    : Promise.resolve([[], null]);

  // Execute both operations in parallel
  const [, [fileArray, uploadError]] = await Promise.all([deleteFiles, uploadFiles]);

  // Handle the delete operation result (optional)
  if (removedMedia.value.length) {
    removedMedia.value = [];
  }

  // Handle the upload operation result
  if (uploadError) toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload files. Please, check your network connection and try again later.' });

  if (hasNewMedia.value) {
    editedPost.value.media.push(...fileArray);
  }

  
  editedPost.value.hasMedia = editedPost.value.media.length > 0;
  editedPost.value.textContent = filterMentions(text.value, mentions.value, filteredMentions.value);
  editedPost.value.mentions = filteredMentions.value;

  usePost(`api/edit-post/${props.post._id}`, { method: 'PUT', body: { edit: editedPost.value }, router, toast }, () => {
    loading.value = false;
    emit('onPostEdited');
    text.value = revertHTML(props.post.textContent) || '';
    status.value = visibilityOptions.find(opt => opt.name === props.post.status);
    media.value = props.post.media || [];
    addedMedia.value = [];
    filteredMentions.value = [];
    if (route.name === 'user-post') window.location.reload();
    else router.push(`/app/post/${props.post._id}`);
  });  
}

const handleMention = (user) => {
  mentions.value.push({ id: user._id, name: user.name });
  text.value = text.value.concat(`@${user.name.split(' ').join('')} `);
  document.getElementById('text-box').focus();
}


</script>

<template>
  <div>
    <Toast class="max-w-96" />
    <div v-if="media.length || addedMedia.length"
      class="w-full rounded-md border overflow-x-auto h-40 mb-2 flex items-center gap-3">
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

      <div v-for="item in addedMedia" :key="item._id" @mouseover="item.isHovering = true"
        @mouseout="item.isHovering = false" @click="removeAddedMedia(item._id)"
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
        <p class="text-xs md:text-[0.8rem] font-medium">Who can see this?</p>
        <Dropdown v-model="status" :options="visibilityOptions" option-label="desc"
          input-class="text-[0.8rem] h-7 flex items-center px-1" />
      </div>
    </div>

    <div class="flex flex-col cs-2:flex-row cs-2:items-end gap-3 mt-2">
      <!-- <Textarea v-if="post.hasText" v-model.trim="text" rows="1" auto-resize class="textarea max-h-80 flex-grow" /> -->

      <VTextbox input-id="text-box" v-if="post.hasText" v-model="text" rows="1" auto-resize :max-rows="5" />

      <div class="flex gap-2 justify-between flex-shrink-0">
        <VMention @on-mention="handleMention" popup-class="bottom-16 right-5" button-class="h-10" />

        <Button :loading @click="saveEdit" label="Save" icon="pi pi-check" class="btn h-10" />
      </div>

    </div>
  </div>
</template>

<style>
.textarea {
  @apply  outline-none bg-soft-gray-2 focus:bg-white focus:border-primary
}
</style>
