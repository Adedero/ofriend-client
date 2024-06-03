<script setup>
import { ref } from 'vue';
/* 

import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

const emojiBox = ref();
const isAddingEmoji = ref(false);
const onSelectEmoji = (emoji) => {
  message.value = message.value.concat(emoji.i)
  onClickOutside(emojiBox, () => isAddingEmoji.value = false)
}

 */
const message = ref('')

</script>

<template>
  <div class="sticky bottom-0 bg-white p-3 rounded-br-lg">
    <div class="relative flex items-end gap-2">
      <div class="absolute right-12 -top-0.5 z-10 cs-2:relative cs-2:right-[unset] cs-2:top-[unset]">
        <!-- <Button @click="isAddingEmoji = true" text severity="secondary" icon="pi pi-face-smile" /> -->
        <Button text severity="secondary" icon="pi pi-paperclip" />
      </div>

      <Editor v-model="message" editorStyle="max-width: 100%; max-height: 4.2rem; font-size: 0.875rem; overflow-y: auto"
        class="flex-grow bg-soft-gray-2 text-sm max-h-28 overflow-x-hidden">
        <template v-slot:toolbar>
          <span class="ql-formats">
            <button class="ql-bold"></button>
            <button class="ql-italic"></button>
            <button class="ql-underline"></button>
          </span>
        </template>
      </Editor>
      <!-- <Textarea v-model="message"  placeholder="Type a message" rows="1" auto-resize
        class="flex-grow bg-soft-gray-2 text-sm max-h-28" /> -->
      <div class="s-2:relative">
        <Button text severity="secondary" icon="pi pi-microphone" class="hidden" />
        <Button text severity="secondary" icon="pi pi-send" />
      </div>
    </div>
  </div>
  <!-- 
  <div v-if="isAddingEmoji" ref="emojiBox" class="fixed bottom-20">
    <EmojiPicker @select="onSelectEmoji" :native="true" :display-recent="true" />
  </div>
 -->
  <!--  <div class="fixed bottom-20">
    <VueVoiceRecording @getAsMp3="saveAsMp3" visualizationType="FrequencyBars" :visualization-options="options">
    </VueVoiceRecording>
  </div> -->
</template>