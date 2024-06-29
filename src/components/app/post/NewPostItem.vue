<script setup>
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import visibilityOptions from '@/data/visibilty';
import useFirebaseUpload from '@/composables/utils/firebase-upload';
import {  usePost } from '@/composables/utils/use-fetch';
import { addToast } from '@/composables/utils/add-toast';
import DynamicAvatar from '@/components/ui/DynamicAvatar.vue';
import { useUserStore } from '@/stores/user';
import socket from '@/config/socket.config';
//import generateHTML from '@/composables/utils/generate-html';

const router = useRouter();
const toast = useToast();
const userStore = useUserStore();

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

watchEffect(() => {
  post.value.status = status.value.name;
  post.value.hasText = !!post.value.textContent;
  post.value.hasMedia = files.value.length > 0;
});

const res = ref({});
const createPost = async () => {
  if (!post.value.hasText && !post.value.hasMedia) return;
  //Upload images and videos and get the url
  res.value.loading = true;
  try {
    
    let media = [];
    if (post.value.hasMedia) {
      for (let i = 0; i < files.value.length; i++) {
        const fileType = files.value[i].type;
        const [url, error] = await useFirebaseUpload().uploadSingleFile('POSTS', files.value[i]);
        if (error) {
          toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload files. Please, check your network connection and try again later.' });
          res.value.loading = false;
          return;
        }
        media.push({
          url: url,
          type: fileType
        });
      }
    }
    if (media.length) {
      post.value.media = media;
    }
    res.value = await usePost('api/create-post', post.value);
    if (res.value.error) {
      return toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong. Please try again later', life: 5000 });
    }

    if (res.value.data.success) {
      //Emit socket to send notifications to subscribers
      
      socket.emit('post-created', userStore.user, res.value.data.post._id);

      files.value = [];
      post.value = {
        textContent: '',
        status: status.value.name,
        hasText: false,
        hasMedia: false,
      }

      router.push({
        name: 'user-post',
        params: {
          postId: res.value.data.post._id
        }
      });
      return
    }
    addToast(res.value, toast, false);    
  } catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred. Please try again later.', life: 5000 });
  } finally {
    res.value.loading = false;
  }
}

/* const textbox = ref(null)
const text = ref('');
const visible = ref(false);
const mentionsLoading = ref(false);
const users = ref([]);
const searchText = ref('');
const initial = ref('')
const mentions = ref([]);
const limit = 20;
const allLoaded = ref(false);
const html = ref('')

const getUsers = async () => {
  if (!searchText.value) return;
  if (mentionsLoading.value || allLoaded.value) return;
  if (searchText.value === initial.value) return;
  mentionsLoading.value = true;
  const { data } = await useGet(`api/get-mentions/${searchText.value}?skip=${users.value.length}&limit=${limit}`);
  console.log(data.value);
  users.value.push(...data.value);
  if (data.value < limit) allLoaded.value = true;
  mentionsLoading.value = false;
  initial.value = searchText.value;
}

watch(searchText, () => allLoaded.value = false);

const getMoreUsers = async (event) => {
  const container = event.target;
  const { scrollHeight, scrollTop, clientHeight } = container;
  if (scrollTop + clientHeight >= scrollHeight - 20) {
    getUsers();
  }
};

const addMention = (user) => {
  mentions.value.push({ id: user._id, name: user.name });
  text.value = text.value.concat(`@${user.name.split(' ').join('')} `);
  users.value = [];
  visible.value = false;
}

const handleSave = () => {
  const outputHTML = generateHTML(text.value);
  const par = document.createElement('p');
  par.style.display = 'none';
  par.innerHTML = outputHTML;
  document.body.appendChild(par);
  const tags = par.querySelectorAll('.mention-link');
  tags.forEach(tag => {
    const username = tag.innerText.split('@')[1];
    const user = mentions.value.find(u => u.name.split(' ').join('') === username);

    if (user) {
      tag.innerText = user.name;
      tag.href=`/app/profile/${user.id}`
    }
  });
}
 */
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
        <DynamicAvatar shape="circle" class="w-10 h-10" :user="userStore.user" />

        <!-- <div class="flex-grow">
          <Textarea v-model="post.textContent"
            :placeholder="post.isProduct ? 'Ready to share your product?' : 'Ready to share your knowledge?'" rows="1"
            auto-resize class="bg-soft-gray-2 focus:bg-white w-full overflow-y-scroll" />
        </div> -->

        <VTextbox v-model="post.textContent" fluid rows="1" auto-resize :max-rows="15"
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
        <!-- <Button @click="visible = !visible" severity="secondary" :icon="visible ? 'pi pi-times' : 'pi pi-at'"
          size="small" />

        <div v-if="visible" @scroll="getMoreUsers"
          class="top-12 right-0 min-w-60 max-w-72 max-h-80 p-2 rounded-lg z-20 bg-white border shadow-md border-slate-400 absolute">
          <div v-if="mentionsLoading" class="w-full grid gap-2">
            <div v-for="i in 3" :key="i" class="w-full flex items-center gap-2">
              <Skeleton shape="circle" width="2rem" height="2rem" class="flex-shrink-0" />
              <Skeleton height="1rem" />
            </div>
          </div>

          <div v-else class="w-full grid gap-2">
            <div>
              <IconField iconPosition="left">
                <InputIcon class="pi pi-search"> </InputIcon>
                <InputText type="search" v-model.trim="searchText" @search="getUsers" placeholder="Search to mention" />
              </IconField>
            </div>
            <div v-if="users.length" class="w-full grid gap-2">
              <div v-for="user in users" :key="user._id" @click="addMention(user)"
                class="py-1 px-2 hover:bg-accent/10 cursor-pointer rounded-md flex items-center gap-2">
                <DynamicAvatar shape="circle" :user class="w-8 h-8" />
                <p class="text-sm font-semibold">{{ user.name }}</p>
              </div>
            </div>

            <div v-else>No results</div>
          </div>
        </div -->

        <Button @click="createPost" :loading="res.loading" label="Post" icon="pi pi-angle-double-right" icon-pos="right"
          size="small" class="bg-primary border-primary hover:bg-primary-lighter transition-colors" />
      </div>

    </div>
  </div>
</template>
