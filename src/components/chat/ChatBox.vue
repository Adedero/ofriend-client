<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useGet } from '@/composables/utils/use-fetch';

const router = useRouter();
const props = defineProps({
  currentChatId: {
    type: String
  }
});

const section = ref(null);
const scrollToBottom = () => section.value ? section.value.scrollTop = section.value.scrollHeight : 'Not yet mounted'


const loading = ref(false);
const allLoaded = ref(false);
const receiver = ref({});
const messages = ref([]);
//Get messages
const getMessages = async () => {
  if (loading.value || allLoaded.value) return;
  try {
    const { status, data, error } = await useGet(`api/get-messages/${props.currentChatId}?skip=${messages.value.length}`);
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
    if (data.value.messages.length === 0) {
      allLoaded.value = true;
    }

  } catch (error) {
    console.log(error);
    router.push('/500');
  } finally {
    loading.value = false;
  }
}

const handleScroll = async () => {
  if (section.value.scrollTop === 0) {
    await getMessages();
  }
}

const addMessage = (data) => {
  //console.log(data)
  messages.value.push(data);
  data.isSent = true;
  scrollToBottom();
  return;
}

watch(
  () => props.currentChatId,
  async () => {
    if (props.currentChatId && props.currentChatId.length) {
      await getMessages();
      scrollToBottom();
    }
  }
)


const menu = ref()
const items = ref([
  {
    label: 'Options',
    items: [
      {
        label: 'Refresh',
        icon: 'pi pi-refresh'
      },
      {
        label: 'Export',
        icon: 'pi pi-upload'
      }
    ]
  }
])

const toggle = (event) => {
  menu.value.toggle(event)
}

//watchEffect(() => section.value ? scrollToBottom(section.value)  : 'Not yet mounted')

</script>

<template>
  <div v-if="!messages.length"></div>
  <main v-else class="h-full grid relative grid-rows-10">
    <header class="flex-shrink-0 bg-white p-3 h-16 border-b border-primary flex items-center justify-between">
      <div class="flex items-center gap-2">
        <DynamicAvatar :user="receiver" shape="circle" size="large" class="w-12 h-12" />
        <div>
          <h3 class="font-medium">{{ receiver.name }}</h3>
          <p class="text-sm truncate max-w-72 text-text-light cs:max-w-96">
            {{ receiver.bio }}
          </p>
        </div>
      </div>
      <Button @click="toggle" text icon="pi pi-ellipsis-h" class="flex-shrink-0" />
      <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
    </header>

    <section v-if="messages.length" ref="section" @scroll="handleScroll" class="row-span-8 overflow-y-auto pb-2">
      <div id="conversation" class="p-3">
        <header class="flex gap-2 items-center justify-between">
          <hr class="border-primary/50 w-1/2" />
          <p class="text-sm text-primary/60 font-semibold">Today</p>
          <hr class="border-primary/50 w-1/2" />
        </header>

        <div id="chat-body" class="grid gap-2 cs-2:gap-1">
          <ChatBlob v-for="message, i in messages" :key="i" :message />
        </div>
      </div>
    </section>


    <section v-else class="flex-grow flex-shrink-0 row-span-8"></section>

    <NewChat :currentChatId @onSendMessage="addMessage" />
  </main>
</template>

