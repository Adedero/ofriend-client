<script setup>
import { computed, ref } from 'vue';
import { usePost } from '@/composables/utils/use-fetch'
import { onClickOutside } from '@vueuse/core'
import 'vue3-emoji-picker/css'
import ChatMediaAttachment from './attachments/ChatMediaAttachment.vue';
import EmojiPicker from 'vue3-emoji-picker';
import { useUserStore } from '@/stores/user';
import useFirebaseUpload from '@/composables/utils/firebase-upload';

const userStore = useUserStore();
const firebase = useFirebaseUpload();

const props = defineProps({
  currentChatId: {
    type: String
  }
});

const emit = defineEmits(['onSendMessage']);

const message = ref({});
const optimisticMessage = ref({});

const text = ref('');
const isTyping = computed(() => text.value !== '');

const media = ref([]);
const document = ref(null);

//Handle attachments
// Camera
const onCameraFileSend = (file) => {
  //console.log(file);
  message.value.hasMedia = true;
  media.value = [];
  media.value.push(file);
  sendMessage();
}

//Images
const onImageFileSend = (file) => {
  //console.log(file);
  message.value.hasMedia = true;
  media.value = [];
  media.value.push(...file);
  sendMessage();
}

//Videos
const onVideoFileSend = (file) => {
  //console.log(file);
  message.value.hasMedia = true;
  media.value = [];
  media.value.push(file);
  sendMessage();
}

//Audio
const onAudioFileSend = (file) => {
  //console.log(file);
  message.value.hasMedia = true;
  media.value = [];
  media.value.push(file);
  sendMessage();
}

//Recording
const onRecordingFileSend = (file) => {
  console.log(file);
  message.value.hasMedia = true;
  media.value = [];
  media.value.push(file);
  sendMessage();
}

//Document
const onDocumentFileSend = (file) => {
  //console.log(file);
  message.value.hasMedia = false;
  media.value = [];
  message.value.hasDocument = true;
  document.value = file;
  sendMessage();
}


const sendMessage = async () => {
  if (!text.value && !media.value.length && !document.value) return;
  //Send optimistic message;

  message.value.chat = props.currentChatId;
  message.value.sender = userStore.user.id;
  message.value.isSent = false;
  message.value.createdAt = Date.now();
  message.value.hasText = true;
  message.value.textContent = text.value;

  optimisticMessage.value = {...message.value}
  if (message.value.hasMedia) {
    optimisticMessage.value.hasText = false;
    optimisticMessage.value.textContent = '';
    optimisticMessage.value.hasMedia = true;
    optimisticMessage.value.media = media.value.map(item => {
      return {
        type: item.file.type,
        caption: item.caption,
        url: item.fileUrl
      }
    });
  }

  if (message.value.hasDocument) {
    optimisticMessage.value.hasText = false;
    optimisticMessage.value.textContent = '';
    optimisticMessage.value.hasMedia = false;
    optimisticMessage.value.media = [];
    optimisticMessage.value.hasDocument = true;
    optimisticMessage.value.document = {
      type: document.value.type,
      url: document.value.url,
      name: document.value.name
    }
  }

  emit('onSendMessage', optimisticMessage.value);
  
  if (message.value.hasMedia && media.value.length) {
    message.value.hasText = false;
    message.value.textContent = '';
    
    message.value.media = await Promise.all(media.value.map(async(mediaItem) => {
      const fileType = mediaItem.file.type;
      const caption = mediaItem.caption;
      const [ url, error ] = await firebase.uploadSingleFile('CHATS', mediaItem.file);
      if (error) console.log('Error uploading', mediaItem.file.name);
      return {
        url,
        type: fileType,
        caption
      }
    }));

    console.log(message.value)
  }

  if (message.value.hasDocument) {
    message.value.hasText = false;
    message.value.textContent = '';
    //Upload document
  }
  

  text.value = ''

  await usePost('api/send-message', message.value);
  message.value = {};
}



const emojiBox = ref()
const isAddingEmoji = ref(false)
const onSelectEmoji = (emoji) => {
  text.value = text.value.concat(emoji.i)
}
onClickOutside(emojiBox, () => (isAddingEmoji.value = false))
</script>

<template>
  <div class="w-full bg-white p-3 rounded-br-lg flex items-end gap-1">
    <div class="flex-grow flex items-end bg-soft-gray-2 rounded-md">
      <Button @click="isAddingEmoji = true" text severity="secondary" icon="pi pi-face-smile" />

      <Textarea v-model="text" placeholder="Type a message" rows="1" auto-resize
        class="flex-grow py-1 mb-[0.4rem] px-0 bg-transparent outline-none border-none focus:border-none cs:text-sm max-h-28" />

      <div>
        <ChatMediaAttachment @on-camera-file-send="onCameraFileSend" @on-image-file-send="onImageFileSend"
          @on-video-file-send="onVideoFileSend" @on-audio-file-send="onAudioFileSend" @on-document-file-send="onDocumentFileSend" />
      </div>
    </div>

    <Button v-if="isTyping" @click="sendMessage" class="btn" icon="pi pi-send" />
    <AudioRecorder v-else @on-stop="onRecordingFileSend" />
  </div>

  <div ref="emojiBox" class="fixed bottom-20" :class="{ hidden: !isAddingEmoji }">
    <EmojiPicker ref="emojiBox" v-if="isAddingEmoji" @select="onSelectEmoji" :native="true" :display-recent="true" />
  </div>
</template>
