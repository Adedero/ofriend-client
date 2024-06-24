<script setup>
import { ref } from "vue";
import { usePost } from '@/composables/utils/use-fetch';
import { timeAgo } from '@/composables/utils/formats';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  saveDate: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['onPostUnsaved']);

const unsaveLoading = ref(false);
const unsavePost = async () => {
  unsaveLoading.value = true;
  try {
    const { data, error } = await usePost(`api/toggle-post-save/${props.post._id}`,{},'PUT');
    if (error.value) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong. Please, try again later.' });
      return;
    }
    if (data.value.success) {
      emit('onPostUnsaved', props.post._id);
      return;
    }
  } catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: 'Error', detail: error.message });
  } finally {
    unsaveLoading.value = false;
  }
}

const isCopied = ref(false);
const copyLink = async () => {
  await navigator.clipboard.writeText(`${import.meta.env.VITE_BASE_URL}app/post/${props.post._id}`);
  isCopied.value = true;
  setTimeout(() => {
    isCopied.value = false;
  }, 2000);
}

const op = ref();
const toggle = (event) => {
  op.value.toggle(event);
};
</script>

<template>
  <div class="flex items-center h-fit gap-3 w-full">
    <Toast class="max-w-96" />
    <div @click="$router.push({ name: 'user-post', params: { postId: post._id }})"
      class="flex items-center gap-3 flex-grow cursor-pointer">
      <div v-if="post.hasMedia"
        class="w-20 md:w-24 aspect-square rounded-xl flex-shrink-0 bg-slate-300 overflow-hidden">
        <img v-if="post.media[0].type.includes('image')" :src="post.media[0].url" alt="image"
          class="w-full h-full object-cover">
        <video v-else :src="post.media[0].url"></video>
      </div>

      <div v-else class="w-24 aspect-square rounded-xl flex-shrink-0 bg-slate-300 overflow-hidden">
        <DynamicAvatar :user="post.author" class="w-24 h-24 text-4xl" image-class="w-full h-full object-cover" />
      </div>
      <div>
        <h1 class="font-bold truncate-3">{{ post.hasText ? post.textContent : `${post.author.name}'s post` }}</h1>
        <p class="text-sm md:text-base">{{ post.author.name }}</p>
        <p class="text-sm text-slate-500">Saved {{ timeAgo(saveDate) }}</p>
      </div>
    </div>


    <div>
      <Button type="button" icon="pi pi-ellipsis-h" @click="toggle" rounded text />
      <OverlayPanel ref="op">
        <div class="grid">
          <Button @click="copyLink" :label="isCopied ? 'Copied' : 'Copy link'"
            :icon="isCopied ? 'pi pi-check' : 'pi pi-link'" severity="secondary" text class="text-left" />

          <Button @click="unsavePost" :loading="unsaveLoading" label="Unsave" icon="pi pi-bookmark-fill"
            severity="secondary" text class="text-left" />
        </div>
      </OverlayPanel>
    </div>
  </div>
</template>

<style scoped>
.truncate-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>