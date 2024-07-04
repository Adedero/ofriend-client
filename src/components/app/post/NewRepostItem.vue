<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import visibilityOptions from '@/data/visibilty';
import { usePost } from '@/composables/server/use-fetch';
import { useUserStore } from '@/stores/user.js';
import filterMentions from '@/composables/utils/filter-mentions';

const router = useRouter();
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

const text = ref('');
const mentions = ref([]);
const filteredMentions = ref([]);

const handleMention = (user) => {
  mentions.value.push({ id: user._id, name: user.name });
  text.value = text.value.concat(`@${user.name.split(' ').join('')} `);
  document.getElementById('text-box').focus();
}

const post = ref({});

const loading = ref(false);
const createPost = () => {
  if (!text.value) return;

  post.value = {
    hasText: !!text.value,
    status: status.value.name,
    isReposting: true,
    repostedPost: props.postId
  }

  loading.value = true;

  post.value.textContent = filterMentions(text.value, mentions.value, filteredMentions.value);
  post.value.mentions = filteredMentions.value;

  usePost('api/create-post', { body: post.value, router, toast }, () => {
    loading.value = false;
    text.value = '';
    emit('onPostShared')
  });
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
        <DynamicAvatar :user="userStore.user" shape="circle" size="large" class="h-12 aspect-square" />
        <div class="flex-grow">
          <VTextbox input-id="text-box" v-model="text" placeholder="Say something about this." rows="1" auto-resize
            :max-rows="5" />
          <!-- <Textarea v-model="post.textContent" class="bg-soft-gray-2 focus:bg-white w-full max-h-[100px]" /> -->
        </div>
      </div>
    </div>

    <div class="mt-3 flex items-start justify-between">
      <div>
        <Button @click="copyPostLink" :label="isCopied ? 'Copied' : 'Copy link'"
          :icon="isCopied ? 'pi pi-check' : 'pi pi-link'" severity="secondary" />
      </div>

      <div class="flex gap-5">
        <VMention @on-mention="handleMention" popup-class="bottom-20 right-8" button-size="" />

        <Button @click="createPost" :loading="loading" label="Post" icon="pi pi-angle-double-right" icon-pos="right"
          size="small" class="bg-primary border-primary hover:bg-primary-lighter transition-colors" />
      </div>

    </div>
  </div>
</template>
