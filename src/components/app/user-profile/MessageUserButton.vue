<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePost } from '@/composables/utils/use-fetch.js';
import { useUserStore } from '@/stores/user';
import socket from '@/config/socket.config';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});
const userStore = useUserStore();

const router = useRouter();
const loading = ref(false);
const isError = ref(false);

const visible = ref(false);

const showDrawer = () => {
  visible.value = true;
  const textarea = document.getElementById('t-area');
  if (textarea) textarea.focus();
}
const text = ref('');

const sendMessage = async () => {
  if (!text.value) return;
  loading.value = true;
  const msg = {
    sender: userStore.user.id,
    hasText: true,
    textContent: text.value,
    readBy: [userStore.user.id]
  }
  const { status, data, error } = await usePost(`api/initialize-chat?receiver=${props.user._id}`, { msg });
  if (error.value) {
    isError.value = true;
    loading.value = false;
    return;
  }
  if (status.value === 401 && data.value.authMessage) {
    loading.value = false;
    return router.push({ name: 'signin' });
  }
  loading.value = false;
  
  const payload = { message: data.value.newMessage, senderName: userStore.user.name, receiverId: props.user._id }
  socket.emit('sendMessage', payload);
  text.value = '';
  isError.value = false;
  visible.value = false;
}
</script>

<template>
  <Button @click="showDrawer" :loading :label="`Message ${user.name.split(' ')[0]}`" icon="pi pi-comments"
    size="small" class="btn w-fit mt-4 lg:w-full" />

  <Sidebar v-model:visible="visible" :header="'Send '+ user.name.split(' ')[0] + ' a message'" position="bottom" class="h-auto">
    <small v-if="isError" class="text-[red]">There was an error sending your message</small>
    <div class="relative h-12 flex flex-col">
      <Textarea id="t-area" v-model.trim="text" rows="1" auto-resize placeholder="Enter your message"
        class="flex-grow max-h-full bg-soft-gray-2 w-full rounded-md pr-12" />

      <Button @click="sendMessage" v-show="text.length" :loading icon="pi pi-send"
        class="btn h-10 absolute right-1 top-1">
        <template #loadingicon>
          <span class="pi pi-spinner pi-spin"></span>
        </template>
      </Button>
    </div>
  </Sidebar>
</template>
