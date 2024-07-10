<script setup>
import { computed, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useAmOrPm } from '@/composables/utils/formats';
import { revertHTML, showLinks } from '@/composables/utils/html-parse';

const props = defineProps({
  message: {
    type: Object
  },
  receiver: {
    type: Object
  }
});


const emit = defineEmits(['onEdit', 'onReply', 'onDelete', 'removeDeletedMessage']);
const userStore = useUserStore();

const user = computed(() => props.message.sender === userStore.user.id ? 'sender' : 'receiver');

const menu = ref();
const items = ref( props.message.hasText ? [
  {
    label: 'Reply',
    icon: 'pi pi-reply',
    command: () => emit('onReply', props.message)
  },
  {
    label: 'Copy',
    icon: 'pi pi-copy',
    command: async () => await navigator.clipboard.writeText(revertHTML(props.message.textContent))
  },
  {
    label: 'Edit',
    icon: 'pi pi-pencil',
    command: () => {
      visible.value = true;
      document.getElementById('textbox').focus();
    }
  },
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => emit('onDelete', props.message)
  }
] : [
  {
    label: 'Reply',
    icon: 'pi pi-reply',
    command: () => emit('onReply', props.message)
  },
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => emit('onDelete', props.message)
  }
]);

const menu2 = ref();
const items2 = ref([
  {
    label: 'Reply',
    icon: 'pi pi-reply',
    command: () => emit('onReply', props.message)
  },
  {
    label: 'Copy',
    icon: 'pi pi-copy',
    command: async () => await navigator.clipboard.writeText(revertHTML(props.message.textContent))
  }
]);

const menu3 = ref();

const toggle = (event) => {
  menu.value.toggle(event);
};

const toggle2 = (event) => {
  menu2.value.toggle(event);
};

const visible = ref(false);
const text = ref(revertHTML(props.message.textContent));

const saveEdit = () => {
  text.value = showLinks(text.value)
  emit('onEdit', props.message, text.value);
  text.value = '';
  visible.value = false;
};

</script>

<template>
  <div :id="message._id"
    :class="['transition-colors flex-shrink-0 flex flex-wrap', user === 'sender' ? 'justify-end' : '']">

    <div :class="[' p-2 text-[0.9rem] cs-2:text-sm rounded-lg w-fit max-w-[80%] cs-2:max-w-[50%]',
      user === 'sender' ? 'bg-primary rounded-br-none text-white' : '',
      user === 'receiver' ? 'bg-accent/20 rounded-bl-none text-primary' : '']">

      <div v-if="message.isDeleted" class="flex items-center gap-1 cursor-not-allowed opacity-50">
        <span class="pi pi-times-circle" style="font-size: 0.8rem;"></span>
        <span class="italic">this message was deleted.</span>

        <span @click="(event) => menu3.toggle(event)"
          class="pi pi-ellipsis-v cursor-pointer p-1 rounded hover:bg-accent/10"></span>
        <Menu ref="menu3"
          :model="[{ label: 'Remove for me', icon: 'pi pi-times', command: () => $emit('removeDeletedMessage', message) }]"
          :popup="true" />
      </div>

      <div v-else>
        <QuotedChat v-if="message.isReplying" :message="message.quotedMessage" :parentMessage="message" :receiver />

        <div v-if="message.hasText" class="whitespace-pre-wrap" v-html="message.textContent">

        </div>

        <div v-if="message.hasFile">
          <ChatFile :file="message.file" />
        </div>

        <div class="flex items-center justify-end gap-4">
          <small v-if="message.isEdited" class="opacity-60">edited</small>
          <p class="text-[0.65rem] text-right">{{ useAmOrPm(message.createdAt) }}</p>

          <div v-if="user === 'sender'" class="text-accent">
            <span :class="message.isSent ? 'pi pi-check' : 'pi pi-spinner pi-spin'"
              style="font-weight: 600; font-size: 0.75rem"></span>

            <span v-if="message.readBy.includes(receiver._id)" class="pi pi-check -translate-x-2"
              style="font-weight: 600; font-size: 0.75rem"></span>

            <span v-if="message.isSent" @click="toggle" class="pi pi-ellipsis-v cursor-pointer p-1 rounded hover:bg-accent/10"></span>
            <Menu ref="menu" :model="items" :popup="true" />
          </div>

          <div v-else class="">
            <span @click="toggle2" class="pi pi-ellipsis-v cursor-pointer p-1 rounded hover:bg-accent/10"></span>
            <Menu ref="menu2" :model="items2" :popup="true" />
          </div>
        </div>
      </div>

    </div>

    <div v-if="message.hasError" class="mt-1 w-full flex items-center gap-2"
      :class="{ 'justify-end': user === 'sender' }">
      <span class="text-xs text-red-500">not sent</span>
      <span @click="message.resend()"
        class="cursor-pointer text-xs text-blue-700 font-semibold bg-accent/10 p-1">Resend</span>
    </div>

    <Sidebar v-model:visible="visible" header="Edit message" position="bottom" class="h-fit">
      <div class="relative flex min-h-12">
        <VTextbox input-id="textbox" v-model="text" rows="1" :max-rows="5" auto-resize
          placeholder="Enter your message" />
        <!-- <Textarea v-model.trim="text" rows="1" auto-resize placeholder="Enter your message"
          class="flex-grow max-h-full bg-soft-gray-2 w-full rounded-md pr-12" /> -->
        <Button @click="saveEdit" v-show="text.length" icon="pi pi-send" class="btn h-10 absolute right-1 bottom-1" />
      </div>
    </Sidebar>

  </div>
</template>
