<script setup>
import { ref, watchEffect } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import visibilityOptions from '@/data/visibilty';
import { usePost } from '@/composables/utils/use-fetch';
import { addToast } from '@/composables/utils/add-toast';
import { useUserStore } from '@/stores/user.js';

const userStore = useUserStore();

const toast = useToast();
const status = ref(visibilityOptions[0]);

const props = defineProps({
  postId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['onPostShared']);

const isCopied = ref(false);
const postLink = ref(`${import.meta.env.VITE_BASE_URL}app/post/${props.postId}`);
const copyPostLink = async () => {
  await navigator.clipboard.writeText(postLink.value);
  isCopied.value = true;
  setTimeout(() => {
    isCopied.value = false;
  }, 2000);
}

const post = ref({
  textContent: '',
  status: '',
  hasText: false,
  isReposting: true,
  repostedPost: props.postId
});

watchEffect(() => {
  post.value.status = status.value.name;
  post.value.hasText = !!post.value.textContent;
});

const res = ref({});
const createPost = async () => {
  res.value.loading = true;
  try {
    res.value = await usePost('api/create-post', post.value);
    if (!res.value) {
      return toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong. Please try again later', life: 5000 });
    }

    if (res.value.data.success) {
      post.value.textContent = ''
      toast.add({ severity: 'success', summary: 'Post shared', life: 5000 });
      emit('onPostShared');
      return;
    }
    addToast(res.value, toast, false);    
  } catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred. Please try again later.', life: 5000 });
  } finally {
    res.value.loading = false;
  }
}
</script>

<template>
  <Toast class="max-w-96" />
  <div class="p-3 border rounded-md">
    <div class="flex flex-col gap-1">
      <div class="flex items-center justify-end gap-2">
        <p class="text-[0.8rem] font-medium">Who can see this?</p>
        <Dropdown v-model="status" :options="visibilityOptions" option-label="desc"
          input-class="text-[0.8rem] h-7 flex items-center px-1" />
      </div>

      <div class="flex items-center gap-2 justify-between">
        <DynamicAvatar :user="userStore.user" shape="circle" size="large" />
        <div class="flex-grow">
          <Textarea v-model="post.textContent" placeholder="Say something about this." rows="1" auto-resize
            class="bg-soft-gray-2 focus:bg-white w-full max-h-[100px]" />
        </div>
      </div>
    </div>

    <div class="mt-3 flex items-start justify-between">
      <div>
        <Button @click="copyPostLink" :label="isCopied ? 'Copied' : 'Copy link'" :icon="isCopied ? 'pi pi-check' : 'pi pi-link'" severity="secondary" />
      </div>

      <Button @click="createPost" :loading="res.loading" label="Post" icon="pi pi-angle-double-right" icon-pos="right"
        size="small" class="bg-primary border-primary hover:bg-primary-lighter transition-colors" />
    </div>
  </div>
</template>
