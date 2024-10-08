<script setup>
import { computed, onMounted, provide, ref, nextTick, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import socket from '@/config/socket.config';
import { useGet, usePost } from '@/composables/server/use-fetch';
import { useUserStore } from '@/stores/user';
import { formatChatDate } from '@/composables/utils/formats';


const emit = defineEmits(['onUserMessageSend']);

const scrollThreshold = 150
const hasScrolledTooFar = ref(false);
const unreadMessagesBadge = ref(0);


const router = useRouter();
const route = useRoute();
const toast = useToast();
const userStore = useUserStore();


provide('chatId', route.params.chatId);
//const chatId = inject('chatId');

watchEffect(() => socket.emit('joinRoom', route.params.chatId));

const isTyping = ref(false);

const loading = ref(false);
const allLoaded = ref(false);
const receiver = ref({});
const messages = ref([]);

const groupedMessages = computed(() => {
  return messages.value.reduce((acc, message) => {
    const date = new Date(message.createdAt).toLocaleDateString();
    acc[date] = acc[date] || [];
    acc[date].push(message);
    return acc;
  }, {});
});
//Get messages
const getMessages = async (limit) => {
  if (loading.value || allLoaded.value) return;
  loading.value = true;
  try {
    const { status, data, error } = await useGet(`api/get-messages/${route.params.chatId}?skip=${messages.value.length}&limit=${limit}`);
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
    if (data.value.messages.length < limit) {
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
  if (hasScrolledTooFar.value) {
    unreadMessagesBadge.value++;
  } else {
    scrollToBottom(true)
  };
  //scrollToBottom();
});

socket.on('messageRead', (userId) => {
  messages.value.forEach(message => {
    if (message.readBy.includes(userId)) return;
    message.readBy.push(userId);
  })
});

socket.on('isTyping', () => {
  isTyping.value = true;
  if (!hasScrolledTooFar.value) scrollToBottom(true);
});

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

const emitOpenMessage = () => socket.emit('openMessage', route.params.chatId, userStore.user.id);

const onMessageSend = (message) => emit('onUserMessageSend', message);

const addOptimisticMessage = (data) => {
  messages.value.push(data);
  isReplying.value = false;
  scrollToBottom(true);
}

const updateOptimisticMessage = (tempId, id) => {
  const msg = messages.value.find(msg => msg.tempId === tempId);
  msg.isSent = true;
  msg._id = id;
}

//watch(route, () => socket.emit('joinRoom', route.params.chatId));
//watch(chatId, async () => await getMessages(15))

const box = ref(null);

const scrollToBottom = (smooth = false) => {
  if (!box.value) return;
  if (smooth) box.value.style.scrollBehavior = 'smooth';
  nextTick(() => box.value.scrollTop = box.value.scrollHeight);
  unreadMessagesBadge.value = 0;
};

const handleScroll = async () => {
  if (box.value.scrollTop > (box.value.scrollHeight - box.value.clientHeight - scrollThreshold)) {
    hasScrolledTooFar.value = false;
  } else {
    hasScrolledTooFar.value = true;
  }
  const oldScrollHeight = box.value.scrollHeight;
  const oldScrollTop = box.value.scrollTop;
  if (box.value && box.value.scrollTop === 0) {
    await getMessages(10);
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

onMounted(async () => {
  await getMessages(15);
  scrollToBottom();
  emitOpenMessage();
});


//Handle message actions
const deleteMessage = async (message) => {
  if (!message._id) return;
  await usePost(`api/delete-message/${message._id}`,
    { body: { url: message.file.url }, method: 'PUT', router, toast }
  );
  const msg = messages.value.find(msg => msg._id === message._id);
  msg.isDeleted = true;
  socket.emit('deleteMessage', route.params.chatId, message._id);
}

const editMessage = async (message, text) => {
  if (!message._id) return;
  await usePost(`api/edit-message/${message._id}`,
    { body: { edit: text }, method: 'PUT', router, toast });

  const msg = messages.value.find(msg => msg._id === message._id);
  msg.textContent = text;
  socket.emit('editMessage', route.params.chatId, message._id, text);

}

//Remove deleted messages from view
const removeDeletedMessage = (message) => {
  usePost(`api/remove-deleted-message-from-view/${message._id}`, { method: 'PUT', router, toast });
  messages.value = messages.value.filter(msg => msg._id !== message._id);
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

const unblockLoading = ref(false);
const unblockUser = () => {
  if (!receiver.value.blockId) return;

  unblockLoading.value = true;
  usePost(`api/unblock-user/${receiver.value.blockId}`, { router, toast }, () => {
    unblockLoading.value = false;
    receiver.value.isBlocked = false;
  });
}

</script>

<template>
  <div class="w-full h-full flex flex-col">
    <Toast class="max-w-96" />

    <Button v-show="hasScrolledTooFar" @click="scrollToBottom" :badge="unreadMessagesBadge ? unreadMessagesBadge : ''"
      icon="pi pi-arrow-down" size="small" rounded
      class="z-20 border-none bg-slate-700 shadow-lg fixed bottom-36 left-1/2 -translate-x-1/2" />

    <header v-if="receiver.name">
      <ChatSectionHeader :receiver :chatId="route.params.chatId" @messagesCleared="onMessagesCleared"
        @chatDeleted="$router.push({ name: 'mobile-chat-list'})" @userBlocked="receiver.isBlocked = true" />
    </header>

    <main ref="box" @scroll="handleScroll" class="flex-grow overflow-y-auto flex flex-col gap-2 p-3">
      <div v-show="loading" class="grid place-content-center">
        <span class="pi pi-spinner pi-spin text-accent" style="font-size: 1.2rem"></span>
      </div>


      <section v-for="msgs, date in groupedMessages" :key="date" class="relative">
        <div class="flex items-center gap-2 translate-y-8">
          <Divider />
          <p class="flex-shrink-0 bg-accent text-white text-sm font-medium px-2 py-1 rounded-md w-fit">
            {{ formatChatDate(date) }}
          </p>
          <Divider />
        </div>


        <div class="w-full grid place-content-center sticky top-0">
          <p v-show="hasScrolledTooFar"
            class="z-30 bg-accent text-white text-sm font-medium px-2 py-1 rounded-md w-fit">
            {{ formatChatDate(date) }}
          </p>
        </div>

        <div class="flex flex-col gap-2 mt-10">
          <ChatMessage v-for="message in msgs" :key="message._id" :message @onDelete="deleteMessage"
            @onEdit="editMessage" @onReply="replyMessage" @removeDeletedMessage="removeDeletedMessage" :receiver />
        </div>
      </section>


      <div v-show="isTyping" class="bg-accent/20 p-3 rounded-lg rounded-bl-none w-fit">
        <div class="loader"></div>
      </div>
    </main>

    <footer v-if="!receiver.isBlocked && !receiver.hasBlocked" class="grid items-end">
      <ChatSectionFooter @onOptimisticMessage="addOptimisticMessage" @updateOptimisticMessage="updateOptimisticMessage"
        @onMessageSend="onMessageSend" @cancelReply="cancelReply" :isReplying :quotedMessage :receiver />
    </footer>

    <footer v-else class="p-2 bg-primary text-white">
      <div v-show="receiver.isBlocked" class="grid gap-2 place-content-center text-center">
        <p class="font-medium text-sm">You blocked {{ receiver.name }}</p>
        <Button @click="unblockUser" :loading="unblockLoading" label="Unblock" icon="pi pi-user-plus" size="small"
          severity="secondary"
          class="bg-accent border-transparent text-primary hover:bg-accent/80 text-sm mx-auto w-fit" />
      </div>

      <div v-show="!receiver.isBlocked && receiver.hasBlocked"
        class="text-center flex items-center gap-1 justify-center">
        <span class="pi pi-ban"></span>
        <p class="font-medium text-sm">{{ receiver.name }} blocked you.</p>
      </div>
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
  background-size: calc(100%/5) 50%;
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