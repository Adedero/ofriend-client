<script setup>
import { inject, onMounted, ref, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import socket from '@/config/socket.config';
import { useGet, usePost } from '@/composables/utils/use-fetch';
import { useUserStore } from '@/stores/user';

const emit = defineEmits(['onUserMessageSend', 'chatDeleted'])

const router = useRouter();
const userStore = useUserStore();

const chatId = inject('chatId');

const isTyping = ref(false);

const loading = ref(false);
const allLoaded = ref(false);
const receiver = ref({});
const messages = ref([]);
//Get messages
const getMessages = async (limit) => {
  if (loading.value || allLoaded.value) return;
  loading.value = true;
  try {
    const { status, data, error } = await useGet(`api/get-messages/${chatId.value}?skip=${messages.value.length}&limit=${limit}`);
    if (error.value) {
      console.log(error.value);
      router.push('/500');
      return
    }
    if (status.value !== 200) {
      return;
    }
    //console.log(data.value);
    messages.value.unshift(...data.value.messages);
    receiver.value = data.value.receiver;
    if (data.value.messages.length === 0) {
      allLoaded.value = true;
    }

  } catch (error) {
    console.log(error);
    router.push('/500');
  } finally {
    loading.value = false;
  }
}

//Methods from the options in the header
const onMessagesCleared = () => messages.value = [];

socket.on('userOnline', (id) => (receiver.value._id === id) ? receiver.value.isOnline = true : null)
socket.on('userOffline', (id) => (receiver.value._id === id) ? receiver.value.isOnline = false : null)


socket.on('newMessage', (message) => {
  messages.value.push(message);
  isTyping.value = false;
  setObserver();
  //scrollToBottom();
});

socket.on('messageRead', (userId) => {
  messages.value.forEach(message => {
    if (message.readBy.includes(userId)) return;
    message.readBy.push(userId);
  })
});

socket.on('isTyping', () => isTyping.value = true);

socket.on('isNotTyping', () => isTyping.value = false);

socket.on('messageDeleted', (messageId) => {
  const msg = messages.value.find(msg => msg._id === messageId);
  if (msg) {
    msg.isDeleted = true;
  }
});

socket.on('messageEdited', (messageId, text) => {
  const msg = messages.value.find(msg => msg._id === messageId);
  if (msg) {
    msg.textContent = text;
    msg.isEdited = true;
  }
});

const emitOpenMessage = () => socket.emit('openMessage', chatId.value, userStore.user.id);

const onMessageSend = (message) => emit('onUserMessageSend', message);

const addOptimisticMessage = (data) => {
  messages.value.push(data);
  scrollToBottom();
}

const updateOptimisticMessage = (tempId, id) => {
  const msg = messages.value.find(msg => msg.tempId === tempId);
  msg.isSent = true;
  msg._id = id;
}

watch(chatId, () => socket.emit('joinRoom', chatId.value));
watch(chatId, async () => await getMessages(15))

const box = ref(null);

const scrollToBottom = () => {
  nextTick(() => box.value.scrollTop = box.value.scrollHeight)
};

const handleScroll = async () => {
  const oldScrollHeight = box.value.scrollHeight;
  const oldScrollTop = box.value.scrollTop;
  if (box.value && box.value.scrollTop === 0) {
    await getMessages(8);
    box.value.scrollTop = box.value.scrollHeight - oldScrollHeight + oldScrollTop;
  }
}

const setObserver = () => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        emitOpenMessage();
      }
    });
  });

  if (box.value) observer.observe(box.value);
}

//watch(() => messages.value.length, () => setObserver());

onMounted(async() => {
  await getMessages(15);
  scrollToBottom();
  socket.emit('joinRoom', chatId.value);
  emitOpenMessage();
});


//Handle message actions
const deleteMessage = async (message) => {
  if (!message._id) return;
  const {status} = await usePost(`api/delete-message/${message._id}`, { url: message.file.url }, 'PUT');
  if (status.value !== 200) return;
  const msg = messages.value.find(msg => msg._id === message._id);
  msg.isDeleted = true;
  socket.emit('deleteMessage', chatId.value, message._id);
}

const editMessage = async (message, text) => {
  if (!message._id) return;
  const { status } = await usePost(`api/edit-message/${message._id}`, { edit: text }, 'PUT');
  if (status.value !== 200) return;
  const msg = messages.value.find(msg => msg._id === message._id);
  msg.textContent = text;
  socket.emit('editMessage', chatId.value, message._id, text);

}

const isReplying = ref(false);
const quotedMessage = ref({});
const replyMessage = async (message) => {
  isReplying.value = true;
  quotedMessage.value = message
}

const cancelReply = () => {
  isReplying.value = false;
  quotedMessage.value = {};
}

</script>

<template>
  <div class="w-full h-full flex flex-col">
    <header v-if="receiver.name">
      <ChatSectionHeader :receiver :chatId @messagesCleared="onMessagesCleared" @chatDeleted="$emit('chatDeleted')" />
    </header>

    <main ref="box" @scroll="handleScroll" class="flex-grow overflow-y-auto flex flex-col gap-2 p-3">
      <div v-if="loading" class="grid place-content-center">
        <span class="pi pi-spinner pi-spin text-accent" style="font-size: 1.2rem"></span>
      </div>
      <ChatMessage v-for="message in messages" :key="message._id" :message @onDelete="deleteMessage"
        @onEdit="editMessage" @onReply="replyMessage" :receiver />
      <div v-if="isTyping" class="bg-accent/20 p-3 rounded-lg rounded-bl-none w-fit">
        <div class="loader"></div>
      </div>
    </main>

    <footer class="grid items-end">
      <ChatSectionFooter @onOptimisticMessage="addOptimisticMessage" @updateOptimisticMessage="updateOptimisticMessage"
        @onMessageSend="onMessageSend" @cancelReply="cancelReply" :isReplying :quotedMessage :receiver />
    </footer>
  </div>
</template>

<style scoped>
/* HTML: <div class="loader"></div> */
.loader {
  width: 30px;
  aspect-ratio: 2;
  --_g: no-repeat radial-gradient(circle closest-side, rgb(0 19 43) 90%, #0000);
  background:
    var(--_g) 0% 50%,
    var(--_g) 50% 50%,
    var(--_g) 100% 50%;
  background-size: calc(100%/3) 50%;
  animation: l3 1s infinite linear;
}

@keyframes l3 {
  20% {
    background-position: 0% 0%, 50% 50%, 100% 50%
  }

  40% {
    background-position: 0% 100%, 50% 0%, 100% 50%
  }

  60% {
    background-position: 0% 50%, 50% 100%, 100% 0%
  }

  80% {
    background-position: 0% 50%, 50% 50%, 100% 100%
  }
}
</style>