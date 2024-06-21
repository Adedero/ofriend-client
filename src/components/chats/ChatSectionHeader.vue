<script setup>
import { ref } from 'vue';
import { formatTime } from '@/composables/utils/formats';
import { usePost } from '@/composables/utils/use-fetch';

const props = defineProps({
  receiver: { type: Object, required: true }, chatId: { type: String, required: true }
});

const emit = defineEmits(['messagesCleared', 'chatDeleted']);

const res = ref({});
const error = ref({
  isErr: false,
  msg: ''
});

//ClearMessages
const clearMessages = async () => {
  error.value = { isErr: false, msg: '' };
  res.value = await usePost(`api/clear-messages/${props.chatId}`, {}, 'DELETE');
  if (res.value.error || res.value.status !== 200) {
    error.value.isErr = true;
    error.value.msg = 'Connection failed. Try again later.'
    return
  }
  emit('messagesCleared')
}

//Delete Conversation
const deleteConversation = async () => {
  error.value = { isErr: false, msg: '' };
  res.value = await usePost(`api/delete-conversation/${props.chatId}`, {}, 'DELETE');
  if (res.value.error || res.value.status !== 200) {
    error.value.isErr = true;
    error.value.msg = 'Connection failed. Try again later.'
    return
  }
  emit('chatDeleted')
}


const menu = ref();
const items = ref([
  {
    label: 'Clear messages',
    icon: 'pi pi-delete-left',
    command: () => clearMessages()
  },
  {
    label: 'Delete Conversation',
    icon: 'pi pi-trash',
    command: () => deleteConversation()
  },
  {
    label: 'Block',
    icon: 'pi pi-ban'
  }
]);

const toggle = (event) => {
  menu.value.toggle(event);
};
</script>

<template>
  <header class="w-full h-full bg-white p-3 border-b border-primary flex items-center justify-between">
    <div @click="$router.push(`/app/profile/${receiver._id}`)" class="flex items-center gap-2 cursor-pointer">
      <DynamicAvatar :user="receiver" shape="circle" size="large" class="w-12 h-12" />
      <div>
        <div class="flex items-start gap-2">
          <h3 class="font-medium">{{ receiver.name }}</h3>
        </div>

        <div v-if="receiver.isOnline" class="flex text-sm items-center gap-1">
          <div class="w-2 aspect-square rounded-full bg-accent"></div>
          <p>online</p>
        </div>
        <p v-else class="text-sm text-text-light">
          last seen {{ formatTime(receiver.lastSeen) }}
        </p>
      </div>
    </div>

    <div class="relative">
      <Button @click="toggle" :loading="res.loading" text icon="pi pi-ellipsis-h" class="flex-shrink-0" />
      <small v-if="error.isErr" class="text-[red] absolute whitespace-nowrap right-1 -bottom-3">{{ error.msg }}</small>
      <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
      <p v-if="false">
        <span class="pi pi-spinner pi-spin"></span>
        <span>Deleting...</span>
      </p>
    </div>
  </header>
</template>