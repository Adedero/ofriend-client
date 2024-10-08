<script setup>
import { computed, inject, ref, watch } from 'vue';
import useFirebaseUpload from '@/composables/utils/firebase-upload';
import { useUserStore } from '@/stores/user';
import socket from '@/config/socket.config';
import { usePost } from '@/composables/server/use-fetch';
import { useRouter } from 'vue-router';
import { revertHTML, showLinks } from '@/composables/utils/html-parse';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

const emit = defineEmits(['onOptimisticMessage', 'updateOptimisticMessage', 'cancelReply', 'onMessageSend']);
const props = defineProps({
  isReplying: { type: Boolean }, quotedMessage: { type: Object }, receiver: { type: Object }
});

watch(() => props.isReplying, () => props.isReplying && document.getElementById('textbox').focus());


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
    chat: chatId.value || chatId,
    sender: userStore.user.id,
    receiver: props.receiver._id,
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
    tempId: `message-${Date.now()}`,
    isVisibleTo: [userStore.user.id, props.receiver._id]
  }

  emit('onOptimisticMessage', message.value);

  text.value = '';

  if (hasFile.value && file.value) {

    const [url, error] = await firebase.uploadSingleFile('CHATS', file.value.file);
    if (error) {
      //message.value.hasError = true;
      toast.add({ severity: 'error', summary: 'Failed to send file', life: 5000 });
      return;
    }

    const data = { name: file.value.name, url: url, type: file.value.type, extension: file.value.extension }
    file.value = null;
    message.value.file = data;
  }

  message.value.textContent = showLinks(message.value.textContent);
  const { error, _fetch } = await usePost('api/send-message', { body: message.value , router, toast }, (data) => {

    const emittedMessage = { ...data.newMessage, quotedMessage: props.quotedMessage };

    const payload = { message: emittedMessage, senderName: userStore.user.name, receiverId: props.receiver._id };

    socket.emit('sendMessage', payload);

    emit('updateOptimisticMessage', message.value.tempId, data.newMessage._id);
    emit('onMessageSend', emittedMessage)
    message.value = {};
    emit('cancelReply');
  });

  if (error.value) {
    message.value.hasError = true;
    message.value.resend = _fetch('api/send-message');
  }

}

</script>

<template>
  <div>
    <Toast class="max-w-96" />
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
          <p class="text-xs truncate max-w-40">{{ revertHTML(quotedMessage.textContent) }}</p>
        </div>

        <div v-if="quotedMessage.hasFile" class="flex gap-1">
          <div class="rounded overflow-hidden">
            <img v-if="quotedMessage.file.type.includes('image')" :src="quotedMessage.file.url" alt="file"
              class="h-8 w-8 object-cover">

            <video v-if="quotedMessage.file.type.includes('video')" :src="quotedMessage.file.url"
              class="h-8 w-8 object-cover"></video>

            <div v-if="quotedMessage.file.type.includes('audio')"
              class="h-8 w-8 rounded grid place-content-center bg-primary text-white">
              <span class="pi pi-headphones" style="font-size: 1.2rem"></span>
            </div>

            <div v-if="quotedMessage.file.type.includes('application')"
              class="h-8 w-fit p-1 text-xs rounded grid place-content-center bg-primary text-white">
              {{ quotedMessage.file.extension ? quotedMessage.file.extension.toUpperCase() : '?' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="w-full min-h-10 flex items-end gap-2 bg-primary/90 rounded-br-md">

      <ChatFileAttachment @on-file-send="handleFile" />

      <!--  <Textarea v-model="text" placeholder="Type a message" rows="1" auto-resize
      class="flex-grow py-2 mb-[0.4rem] pl-2  outline-none border-none bg-transparent focus:border-none cs:text-sm max-h-32 text-white overflow-y-auto" /> -->

      <VTextbox input-id="textbox" v-model="text" placeholder="Type a message" rows="1" auto-resize :max-rows="5" />

      <Button @click="sendMessage" v-if="isTyping" icon="pi pi-send"
        class="border-transparent bg-transparent rounded-none" />
      <AudioRecorder v-else @on-stop="handleFile" />
    </footer>
  </div>
</template>

<style scoped>
.v-textbox {
  @apply bg-transparent border-transparent focus:bg-transparent focus:border-transparent text-white
}
</style>