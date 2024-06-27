<script setup>
import { computed, inject, onMounted, ref, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import socket from '@/config/socket.config';
import { useGet, usePost } from '@/composables/utils/use-fetch';
import { useUserStore } from '@/stores/user';
import { formatChatDate } from '@/composables/utils/formats';

const emit = defineEmits(['onUserMessageSend', 'chatDeleted'])

const router = useRouter();
const userStore = useUserStore();

const scrollThreshold = 150
const hasScrolledTooFar = ref(false);

const chatId = inject('chatId');

const isTyping = ref(false);

const loading = ref(false);
const allLoaded = ref(false);
const receiver = ref({});
const messages = ref([]);
//Get messages
const groupedMessages = computed(() => {
  return messages.value.reduce((acc, message) => {
    const date = new Date(message.createdAt).toLocaleDateString();
    acc[date] = acc[date] || [];
    acc[date].push(message);
    return acc;
  }, {});
});

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
    console.log(data.value);
    messages.value.unshift(...data.value.messages);
    receiver.value = data.value.receiver;
    if (data.value.messages.length < limit) {
      allLoaded.value = true;
    }

    //console.log(groupedMessages.value)

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


const unreadMessagesBadge = ref(0);
socket.on('newMessage', (message) => {
  messages.value.push(message);
  isTyping.value = false;
  setObserver();
  if (hasScrolledTooFar.value) {
    unreadMessagesBadge.value++;
  } else {
    scrollToBottom(true)
  };
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

const emitOpenMessage = () => socket.emit('openMessage', chatId.value, userStore.user.id);

const onMessageSend = (message) => emit('onUserMessageSend', message);

const addOptimisticMessage = (data) => {
  messages.value.push(data);
  scrollToBottom(true);
}

const updateOptimisticMessage = (tempId, id) => {
  const msg = messages.value.find(msg => msg.tempId === tempId);
  msg.isSent = true;
  msg._id = id;
}

watch(chatId, () => socket.emit('joinRoom', chatId.value));
watch(chatId, async () => await getMessages(15))

const box = ref(null);

const scrollToBottom = (smooth = false) => {
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

const unblockLoading = ref(false);
const unblockUser = async () => {
  if (!receiver.value.blockId) return;
  unblockLoading.value = true;
  const { data } = await usePost(`api/unblock-user/${receiver.value.blockId}`);
  if (data.value.success) {
    receiver.value.isBlocked = false;
  }
  unblockLoading.value = false;
}

</script>

<template>
  <div class="w-full h-full flex flex-col relative">
    <Button v-show="hasScrolledTooFar" @click="scrollToBottom" :badge="unreadMessagesBadge ? unreadMessagesBadge : ''"
      icon="pi pi-arrow-down" size="small" rounded
      class="z-10 border-none w-8 h-8 bg-slate-700 shadow-lg fixed bottom-24 left-[65%]" />

    <header v-if="receiver.name">
      <ChatSectionHeader :receiver :chatId @messagesCleared="onMessagesCleared" @chatDeleted="$emit('chatDeleted')"
        @userBlocked="receiver.isBlocked = true" />
    </header>

    <main ref="box" @scroll="handleScroll" class="flex-grow overflow-y-auto">
      <div v-show="loading" class="grid place-content-center">
        <span class="pi pi-spinner pi-spin text-accent" style="font-size: 1.2rem"></span>
      </div>

      <section v-for="msgs, date in groupedMessages" :key="date" class="relative flex flex-col gap-2 p-3">
        <div class="flex items-center gap-2 translate-y-9">
          <Divider />
          <p class="flex-shrink-0 bg-accent text-white text-sm font-medium px-2 py-1 rounded-md w-fit">
            {{ formatChatDate(date) }}
          </p>
          <Divider />
        </div>


        <div class="w-full grid place-content-center sticky top-0">
          <p v-show="hasScrolledTooFar" class="bg-accent text-white text-sm font-medium px-2 py-1 rounded-md w-fit">
            {{ formatChatDate(date) }}
          </p>
        </div>

        <div class="flex flex-col gap-2 mt-10">
          <ChatMessage v-for="message in msgs" :key="message._id" :message @onDelete="deleteMessage"
            @onEdit="editMessage" @onReply="replyMessage" :receiver />
        </div>
      </section>

      <div v-show="isTyping" class="bg-accent/20 p-3 ml-3 mb-3 rounded-lg rounded-bl-none w-fit">
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