<script setup>
import { computed, defineAsyncComponent, ref, onMounted, provide } from 'vue';
import { useGet } from "@/composables/utils/use-fetch.js";
import ChatListSkeleton from '@/components/skeletons/ChatListSkeleton.vue';
import socket from '@/config/socket.config';
import { useRouter } from 'vue-router';

const ChatList = defineAsyncComponent({
  loader: () => import('@/components/chats/ChatList.vue'),
  loadingComponent: ChatListSkeleton
})

const router = useRouter();

const res = ref({});
const chats = ref([]);
const chatsLength = computed(() => chats.value.length);

const getChats = async () => {
  res.value.loading = true;
  try {
    res.value = await useGet(`api/get-chats?skip=${chatsLength.value}`);
    //console.log(res.value.data);
    if (res.value.status !== 200) return;
    chats.value.push(...res.value.data);
  } catch (e) {
    console.log(e);
    res.value.error = e.message;
  }
}

const currentChatId = ref(null);
provide('chatId', currentChatId);

//const onChatDeleted = () => chats.value = chats.value.filter(chat => chat.id.toString() !== currentChatId.value.toString())

//Change the current chat Id when the user clicks on another user to chat with
const changeCurrentChatId = (id) => {
  currentChatId.value = id;
  const chat = chats.value.find(chat => chat.id === id);
  if (!chat) return;
  chat.unreadMessages = 0;
  chat.isCurrent = true;
  router.push({
    name: 'mobile-private-chat',
    params: {
      chatId: currentChatId.value
    }
  })
}


//Socket operations
//Update the unreadMessages count if a new message comes in a chat that isn't the current one
socket.on('newMessageNotification', (message) => {
  console.log(message)
  const chatIdStr = message.chat.toString();
  const chat = chats.value.find(chat => chat.id === chatIdStr);
  if (!chat) return;
  chat.lastMessage = message;
  let index = chats.value.indexOf(chat);
  //Bring chat to the top of the list
  if (index > 0) {
    chats.value.splice(index, 1);
    chats.value.unshift(chat);
  }
  if (!currentChatId.value || currentChatId.value !== chatIdStr) {
    chat.unreadMessages += 1;
  }
});

/* const updateLastMessageOfViewer = (message) => {
  const chat = chats.value.find(chat => chat.id === message.chat);
  if (!chat) return;
  chat.lastMessage = message;
}
 */
onMounted(async () => await getChats());

</script>

<template>
  <main class="p-2 ">
    <div v-if="!res.loading" class="max-w-full">
      <ChatList v-if="chats.length" :chats @on-user-select="changeCurrentChatId" />
      <div v-else>
        <img src="../../assets/images/no-chats.svg" alt="no chats">
      </div>
    </div>
    <ChatListSkeleton v-else />
  </main>
</template>
