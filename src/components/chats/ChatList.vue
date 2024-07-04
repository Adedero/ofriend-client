<script setup>
import { formatTime } from '@/composables/utils/formats';
import { revertHTML } from '@/composables/utils/html-parse';
import { useUserStore } from '@/stores/user';
import { computed, ref } from 'vue';

const props = defineProps({
  chats: {
    type: Array,
    required: true
  }
})
defineEmits(['onUserSelect']);
const userStore = useUserStore();


const text = ref('');

const filteredChats = computed(() => props.chats.filter(chat => chat.friend.name.toLowerCase().includes(text.value.toLowerCase())))


</script>

<template>

  <div class="relative mt-3 h-[calc(100%-4rem)] w-full overflow-y-auto">
    <div class="sticky top-0 bg-white z-10 pb-3">
      <!-- <ChatSearchbar /> -->
      <IconField iconPosition="left">
        <InputIcon class="pi pi-search"> </InputIcon>
        <InputText v-model.trim="text" placeholder="Search..." class="w-full border-transparent bg-soft-gray-2 focus:bg-white" />
      </IconField>
    </div>

    <div class="flex flex-col gap-3 mt-2">

      <div v-for="chat in filteredChats" :key="chat.id" class="relative flex-shrink-0">
        <label :for="chat.id" class="flex items-center gap-2 pl-2 py-2 pr-2">
          <DynamicAvatar :user="chat.friend" shape="circle" size="large" class="w-[3.5rem] h-[3.5rem] flex-shrink-0" />
          <div class="flex-grow overflow-hidden">

            <div class="w-full flex items-end justify-between">
              <h3 class="font-semibold truncate">{{ chat.friend.name }}</h3>
              <small v-if="chat.lastMessage" class="flex-shrink-0">
                {{ formatTime(chat.lastMessage.createdAt, true) }}
              </small>
            </div>

            <div v-if="chat.lastMessage" class="flex items-center justify-between">
              <p v-if="chat.lastMessage.isDeleted" class="truncate text-text-light text-sm italic">
                This message was deleted.
              </p>

              <div v-else class="min-w-0 grid">
                <p v-if="chat.lastMessage.hasText" class="max-w-full truncate text-text-light text-sm flex gap-1">
                  <span v-show="chat.lastMessage.sender === userStore.user.id">
                    You: {{ revertHTML(chat.lastMessage.textContent) }}
                  </span>

                  <span v-show="chat.lastMessage.sender !== userStore.user.id" class="truncate text-text-light text-sm">
                    {{ revertHTML(chat.lastMessage.textContent) }}
                  </span>
                </p>

                <p v-else-if="chat.lastMessage.hasFile" class="truncate text-text-light text-sm">
                  <span v-show="chat.lastMessage.sender === userStore.user.id">
                    You sent a file
                  </span>

                  <span v-show="chat.lastMessage.sender !== userStore.user.id" class="truncate text-text-light text-sm">
                    Received a file
                  </span>
                </p>
              </div>

              <Badge v-show="chat.unreadMessages" :value="chat.unreadMessages" class="bg-accent flex-shrink-0" />
            </div>
          </div>
        </label>
        <input @input="$emit('onUserSelect', chat.id)" type="radio" name="user" :id="chat.id"
          class="absolute rounded hover:bg-accent/5 appearance-none w-full h-full left-0 top-0  before:absolute before:content-[''] before:left-0 before:h-full before:w-1 checked:before:bg-accent -z-10">
      </div>
    </div>
  </div>
</template>
