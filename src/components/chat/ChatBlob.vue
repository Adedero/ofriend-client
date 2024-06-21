<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { formatTime } from '@/composables/utils/formats';

const props = defineProps({
  seen: {
    type: Boolean
  },
  message: {
    type: Object
  }
});


const userStore = useUserStore();

const user = computed(() => props.message.sender === userStore.user.id ? 'sender' : 'receiver')
</script>

<template>
  <div :class="[
      ' p-2 text-[0.9rem] cs-2:text-sm rounded-lg w-fit max-w-[80%] cs-2:max-w-[50%]',
      user === 'sender' ? 'bg-primary justify-self-end rounded-br-none text-white' : '',
      user === 'receiver' ? 'bg-accent/20 rounded-bl-none text-primary' : ''
    ]">
    <div>

      <div v-if="message.hasText" class="whitespace-pre-wrap">
        {{ message.textContent }}
      </div>

      <div v-if="message.hasMedia">
        <ChatMediaDisplay :media="message.media" />
      </div>

      <div v-if="message.hasDocument" class="w-full">
        <!-- <a :href="message.document.url" class="w-full flex items-center gap-2 p-2 border rounded">
          <span class="pi pi-paperclip"></span>
          <span class="max-w-full truncate">{{ message.document.name }}</span>
        </a> -->
      </div>

      <div class="flex items-center justify-end gap-4">
        <p class="text-[0.65rem] text-right">{{ formatTime(message.createdAt) }}</p>

        <div v-if="user === 'sender'" class="text-accent">
          <span :class="message.isSent ? 'pi pi-check' : 'pi pi-spinner pi-spin'" style="font-weight: 600; font-size: 0.75rem"></span>

          <span v-if="message.isRead" class="pi pi-check -translate-x-2"
            style="font-weight: 600; font-size: 0.75rem"></span>
        </div>
      </div>
    </div>
  </div>
</template>

