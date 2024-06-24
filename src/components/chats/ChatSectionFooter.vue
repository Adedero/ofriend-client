<script setup>
import { computed, inject, ref } from 'vue';
import useFirebaseUpload from '@/composables/utils/firebase-upload';
import { useUserStore } from '@/stores/user';
import socket from '@/config/socket.config';
import { usePost } from '@/composables/utils/use-fetch';
import { useRouter } from 'vue-router';

const router = useRouter();

const emit = defineEmits(['onOptimisticMessage', 'updateOptimisticMessage', 'cancelReply', 'onMessageSend']);
const props = defineProps({
  isReplying: { type: Boolean }, quotedMessage: { type: Object }, receiver: { type: Object }
});


const firebase = useFirebaseUpload();
const userStore = useUserStore();
const chatId = inject('chatId');


const text = ref('');

const isTyping = computed(() => {
  if (text.value) {
    socket.emit('typing', chatId.value);
    return true;
  }
  socket.emit('stopTyping', chatId.value);
  return false;
});


const file = ref(null);
const hasFile = computed(() => file.value ? true : false);

const handleFile = (data) => {
  file.value = data;
  text.value = '';
  if (file.value) sendMessage();
}

const message = ref({})

const sendMessage = async () => {
  message.value = {
    chat: chatId.value,
    sender: userStore.user.id,
    isEdited: false,
    isSent: false,
    isRead: false,
    readBy: [],
    hasError: false,
    hasText: isTyping.value,
    textContent: text.value,
    hasFile: hasFile.value,
    file: { type: file.value?.type ?? '', url: file.value?.url ?? '', name: file.value?.name ?? '', extension: file.value?.extension ?? '' },
    isReplying: props.isReplying,
    quotedMessage: props.quotedMessage,
    createdAt: Date.now(),
    tempId: `message-${Date.now()}`
  }

  emit('onOptimisticMessage', message.value);
  text.value = '';

  if (hasFile.value && file.value) {

    const [url, error] = await firebase.uploadSingleFile('CHATS', file.value.file);
    if (error) {
      message.value.hasError = true;
      return;
    }
    const data = { name: file.value.name, url: url, type: file.value.type, extension: file.value.extension }
    file.value = null;
    message.value.file = data;
  }

  const { status, data, error } = await usePost('api/send-message', message.value);
  if (error.value) {
    message.value.hasError = true;
    return;
  }
  if (status.value === 401 && data.value.authMessage) return router.push({ name: 'signin' });

  //console.log(data.value);
  const emittedMessage = {
    ...data.value.newMessage,
    quotedMessage: props.quotedMessage
  }
  socket.emit('sendMessage', emittedMessage);
  emit('updateOptimisticMessage', message.value.tempId, data.value.newMessage._id);
  emit('onMessageSend', emittedMessage)
  message.value = {};
  emit('cancelReply');
}

</script>

<template>
  <div v-if="isReplying" class="flex">
    <div class="w-1 bg-accent"></div>
    <div class="bg-accent/10 px-2 py-1 flex-grow">
      <div class="flex items-center justify-between">
        <p class="font-bold text-primary text-sm">
          {{ quotedMessage.sender === userStore.user.id ? 'You' : receiver.name.split(' ')[0] }}
        </p>
        <span @click="$emit('cancelReply')" class="pi pi-times cursor-pointer"></span>
      </div>

      <div v-if="quotedMessage.hasText" class="w-full">
        <p class="text-xs truncate max-w-40">{{ quotedMessage.textContent }}</p>
      </div>

      <div v-if="quotedMessage.hasFile" class="flex gap-1">
        <div class="h-8 w-8 rounded overflow-hidden">
          <img v-if="quotedMessage.file.type.includes('image')" :src="quotedMessage.file.url" alt="file"
            class="h-full w-full object-cover">

          <video v-if="quotedMessage.file.type.includes('video')" :src="quotedMessage.file.url"
            class="h-full w-full object-cover"></video>

          <div v-if="quotedMessage.file.type.includes('audio')"
            class="w-full h-full rounded grid place-content-center bg-primary text-white">
            <span class="pi pi-headphones" style="font-size: 1.2rem"></span>
          </div>
          
          <div v-if="quotedMessage.file.type.includes('audio') || quotedMessage.file.type.includes('application')"
            class="w-full h-full rounded grid place-content-center bg-primary text-white">
            {{ quotedMessage.file.extension ? quotedMessage.file.extension.toUpperCase() : '?' }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <footer class="w-full min-h-10 flex items-end gap-2 bg-primary/90 rounded-br-md">

    <ChatFileAttachment @on-file-send="handleFile" />

    <Textarea v-model="text" placeholder="Type a message" rows="1" auto-resize
      class="flex-grow py-2 mb-[0.4rem] pl-2  outline-none border-none bg-transparent focus:border-none cs:text-sm max-h-32 text-white overflow-y-scroll" />

    <Button @click="sendMessage" v-if="isTyping" icon="pi pi-send" class="border-transparent bg-transparent rounded-none" />
    <AudioRecorder v-else @on-stop="handleFile" />
  </footer>
</template>