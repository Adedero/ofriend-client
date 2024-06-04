<script setup>
import { computed, defineAsyncComponent, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import 'vue3-emoji-picker/css'

const EmojiPicker = defineAsyncComponent({
  loader: () => import('vue3-emoji-picker'),
});

const AudioRecorder = defineAsyncComponent({
  loader: () => import('@/components/ui/AudioRecorder.vue')
})

const message = ref('');
const isTyping = computed(() => message.value !== '');

const emojiBox = ref();
const isAddingEmoji = ref(false);

const onSelectEmoji = (emoji) => {
  message.value = message.value.concat(emoji.i)
}

onClickOutside(emojiBox, () => isAddingEmoji.value = false);

</script>

<template>
  <div class="sticky bottom-0 bg-white p-3 rounded-br-lg flex items-end gap-1">

    <div class="flex-grow flex items-end bg-soft-gray-2 rounded-md">
      
      <Button @click="isAddingEmoji = true" text severity="secondary" icon="pi pi-face-smile" />

      <Textarea v-model="message" placeholder="Type a message" rows="1" auto-resize
        class="flex-grow py-1 mb-[0.4rem] px-0 bg-transparent outline-none border-none focus:border-none cs:text-sm max-h-28" />

      <ChatMediaAttachment />
  
    </div>

    <Button v-if="isTyping" class="btn" icon="pi pi-send" />
    <AudioRecorder v-else />
  </div>

  <div ref="emojiBox" class="fixed bottom-20" :class="{'hidden' : !isAddingEmoji}">
    <EmojiPicker ref="emojiBox" v-if="isAddingEmoji" @select="onSelectEmoji" :native="true" :display-recent="true" />
  </div>
</template>