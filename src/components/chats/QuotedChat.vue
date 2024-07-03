<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { revertHTML } from '@/composables/utils/html-parse';

const props = defineProps({
  message: {
    type: Object
  },
  receiver: {
    type: Object
  },
  parentMessage: {
    type: Object
  }
});

const userStore = useUserStore();

const viewerIsSender = computed(() => props.message.sender === userStore.user.id)
const senderIsViewer = computed(() => props.parentMessage.sender !== userStore.user.id)

const scrollToMessage = (id) => {
  const message = document.getElementById(id);
  if (message) {
    message.scrollIntoView({
      behavior:'smooth',
      block:'start',
      inline: 'nearest'
    });

    message.style.backgroundColor = 'rgb(17 203 244 / 0.1)';
    setTimeout(() => message.style.backgroundColor = 'transparent', 3000)
    return;
  }

  //Display message on screen

}

</script>

<template>
  <div @click="scrollToMessage(message._id)" class="cursor-pointer flex">
    <div :class="['w-1 flex-shrink-0', senderIsViewer ? 'bg-primary' : 'bg-accent']"></div>
    <div :class="['px-2 py-1 flex-grow', senderIsViewer ? 'bg-primary/20' : 'bg-accent/10']">
      <div class="flex items-center justify-between">
        <p :class="['font-bold text-accent text-sm', senderIsViewer ? 'text-primary' : 'text-accent']">
          {{ viewerIsSender ? 'You' : receiver.name.split(' ')[0] }}
        </p>
      </div>

      <div v-if="message.isDeleted" class="flex items-center gap-1 cursor-not-allowed opacity-50">
        <span class="pi pi-times-circle" style="font-size: 0.8rem;"></span>
        <span class="italic text-xs">this message was deleted.</span>
      </div>

      <div v-else>
        <div v-if="message.hasText">
          <p class="text-xs max-w-full clamped whitespace-pre-wrap">{{ revertHTML(message.textContent) }}</p>
        </div>

        <div v-if="message.hasFile" class="flex gap-1">
          <div class="h-8 w-8 rounded overflow-hidden">
            <img v-if="message.file.type.includes('image')" :src="message.file.url" alt="file"
              class="h-full w-full object-cover">
            <video v-if="message.file.type.includes('video')" :src="message.file.url"
              class="h-full w-full object-cover"></video>
            <div v-if="message.file.type.includes('video') || message.file.type.includes('application')"
              class="w-full h-full rounded grid place-content-center bg-primary text-white">
              {{ message.file.extension ? message.file.extension.toUpperCase() : '?' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.clamped {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: calc(1.4em * 3);
  line-height: 1.4em;
}
</style>