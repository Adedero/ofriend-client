<script setup>
import { computed, defineAsyncComponent, ref, onMounted, provide } from 'vue';
import { useGet } from "@/composables/utils/use-fetch.js";
import ChatListSkeleton from '@/components/skeletons/ChatListSkeleton.vue';
import socket from '@/config/socket.config';

const ChatList = defineAsyncComponent({
  loader: () => import('@/components/chat/ChatList.vue'),
  loadingComponent: ChatListSkeleton
})

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

const onChatDeleted = () => chats.value = chats.value.filter(chat => chat.id.toString() !== currentChatId.value.toString())

//Change the current chat Id when the user clicks on another user to chat with
const changeCurrentChatId = (id) => {
  currentChatId.value = id;
  const chat = chats.value.find(chat => chat.id === id);
  if (!chat) return;
  chat.unreadMessages = 0;
  chat.isCurrent = true;
}


//Socket operations
//Update the unreadMessages count if a new message comes in a chat that isn't the current one
socket.on('newMessageNotification', (message) => {
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

const updateLastMessageOfViewer = (message) => {
  const chat = chats.value.find(chat => chat.id === message.chat);
  if (!chat) return;
  chat.lastMessage = message;
} 

onMounted(async () => await getChats());

</script>

<template>
  <main class="p-2 ">
    <AppHeader />

    <section class="mt-4 h-[calc(100dvh-6rem)] flex gap-3">
      <div>
        <ChatNavbar />
      </div>

      <div class="flex-grow flex border border-primary rounded-lg ">
        <div class="h-full p-3 border-r border-primary w-[30%] xl:w-[25%]">
          <header class="pb-3 border-b border-primary flex items-center justify-between">
            <h1 class="font-bold text-lg">Messages</h1>
            <Button @click="$router.push('/app')" severity="secondary" text icon="pi pi-angle-left" label="Home"
              size="small" class="p-2" />
          </header>

          <div v-if="!res.loading" class="max-w-full">
            <ChatList v-if="chats.length" :chats @on-user-select="changeCurrentChatId" />
            <div v-else>No chats</div>
          </div>
          <ChatListSkeleton v-else />
        </div>

        <div class="flex-grow">
          <ChatSection v-if="currentChatId" @onUserMessageSend="updateLastMessageOfViewer" @chatDeleted="onChatDeleted" />

          <div v-else class="cursor-context-menu flex flex-col items-center justify-center text-center h-full w-full">
            <img src="../../assets/images/default-profile-img.png" alt="Ofriend logo" class="opacity-90 block">
            <p class="text-primary text-lg font-semibold">Ofriend Private Chat</p>
            <p class="text-slate-400">Select from one of your contacts to start chatting.</p>
          </div>

          <!-- <ChatBox :currentChatId /> -->
        </div>
      </div>
    </section>
  </main>
</template>
