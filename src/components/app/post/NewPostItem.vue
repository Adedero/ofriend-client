<script setup>
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import visibilityOptions from '@/data/visibilty';
import useFirebaseUpload from '@/composables/utils/firebase-upload';
import { usePost } from '@/composables/server/use-fetch';
import DynamicAvatar from '@/components/ui/DynamicAvatar.vue';
import { useUserStore } from '@/stores/user';
import socket from '@/config/socket.config';
import { generateHTML } from '@/composables/utils/html-parse';

const router = useRouter();
const toast = useToast();
const userStore = useUserStore();
const firebase = useFirebaseUpload();

const status = ref(visibilityOptions[0]);

const files = ref([]);
const setFiles = (data) => (files.value = data);

const post = ref({
  textContent: '',
  status: '',
  hasText: false,
  hasMedia: false,
  isProduct: false,
});

const text = ref('');
const mentions = ref([]);
const filteredMentions = ref([]);

watchEffect(() => {
  post.value.status = status.value.name;
  //post.value.hasText = post.value.textContent.length > 0;
  post.value.hasText = text.value.length > 0;
  post.value.hasMedia = files.value.length > 0;
});


const handleMention = (user) => {
  mentions.value.push({ id: user._id, name: user.name });
  text.value = text.value.concat(`@${user.name.split(' ').join('')} `);
  document.getElementById('text-box').focus();
}

const isPosting = ref(false);
const createPost = async () => {

  if (!post.value.hasText && !post.value.hasMedia) return;

  isPosting.value = true;

  let media = [];
  if (post.value.hasMedia) {
    const [fileArray, error] = await firebase.uploadMultipleFiles('POSTS', files.value);
    if (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload files. Please, check your network connection and try again later.' });
      isPosting.value = false;
      return;
    }
    media.push(...fileArray);
  }

  if (media.length) post.value.media = media;

  //post.value.textContent = text.value;

  post.value.textContent = handleHTMLGeneration(text.value);
  post.value.mentions = filteredMentions.value;

  usePost('api/create-post', { body: post.value, toast, router }, (data) => {
    isPosting.value = false;

    socket.emit('post-created', userStore.user, data.post);

    files.value = [];

    router.push({
      name: 'user-post',
      params: {
        postId: data.post._id
      }
    });
  });
}

function handleHTMLGeneration(input) {
  const outputHTML = generateHTML(input);

  const par = document.createElement('p');
  par.style.display = 'none';
  par.innerHTML = outputHTML;
  document.body.appendChild(par);

  const tags = par.querySelectorAll('.mention-link');
  tags.forEach(tag => {
    const username = tag.innerText.split('@')[1];

    const user = mentions.value.find(u => u.name.split(' ').join('') === username);

    if (user) {
      tag.innerText = `@${user.name}`;
      tag.href = `/app/profile/${user.id}`;

      filteredMentions.value.push({ id: user.id, name: user.name });
    }
  });

  document.body.removeChild(par);

  return par.innerHTML;
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

      <div class="flex items-start gap-2 justify-between">
        <DynamicAvatar shape="circle" class="w-10 h-10 flex-shrink-0" :user="userStore.user" />

        <!-- <div class="flex-grow">
          <Textarea v-model="post.textContent"
            :placeholder="post.isProduct ? 'Ready to share your product?' : 'Ready to share your knowledge?'" rows="1"
            auto-resize class="bg-soft-gray-2 focus:bg-white w-full overflow-y-scroll" />
        </div> -->

        <VTextbox v-model="text" fluid rows="1" input-id="text-box" auto-resize :max-rows="15"
          :placeholder="post.isProduct ? 'Ready to share your product?' : 'Ready to share your knowledge?'" />

      </div>
    </div>

    <div v-if="userStore.user.isOrg"
      :class="[post.isProduct ? 'text-primary' : 'text-slate-500', 'mt-2 text-sm flex items-center gap-2 font-medium']">
      <Checkbox v-model="post.isProduct" :binary="true" />
      I am advertising a product
    </div>

    <div class="mt-3 flex items-start justify-between">
      <div class="flex items-start gap-2">
        <AttachMedia @on-file-upload="setFiles" @on-cancel-upload="files = []" />
      </div>

      <div class="flex items-center gap-3 relative">
        <VMention @on-mention="handleMention" />

        <Button @click="createPost" :loading="isPosting" label="Post" icon="pi pi-angle-double-right" icon-pos="right"
          size="small" class="bg-primary border-primary hover:bg-primary-lighter transition-colors" />
      </div>

    </div>
  </div>
</template>
