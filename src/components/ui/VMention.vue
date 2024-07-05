<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useGet } from '@/composables/server/use-fetch';

const emit = defineEmits(['onMention']);

defineProps({
  popupClass: { type: String },
  buttonClass: { type: String },
  buttonSize: { type: String, default: 'small' }
})

const router = useRouter();
const toast = useToast();

const visible = ref(false);
const isLoading = ref(false);

const users = ref([]);
const searchText = ref('');
const initial = ref('');

const limit = 20;
const allLoaded = ref(false);

const getUsers = async () => {
  if (!searchText.value) return;
  if (isLoading.value || allLoaded.value) return;
  isLoading.value = true;

  if (searchText.value === !initial.value) users.value = [];

  await useGet(`api/get-mentions/${searchText.value}?skip=${users.value.length}&limit=${limit}`,
    { router, toast },
    (data) => {
    users.value.push(...data);
    if (data.length < limit) allLoaded.value = true;
    searchText.value = '';
  });
  isLoading.value = false;
}

watch(searchText, () => allLoaded.value = false);

const getMoreUsers = async (event) => {
  const container = event.target;
  const { scrollHeight, scrollTop, clientHeight } = container;
  if (scrollTop + clientHeight >= scrollHeight - 20) {
    getUsers();
  }
};

const handleUserClick = (user) => {
  emit('onMention', user);
  users.value = [];
  visible.value = false;
}

</script>

<template>
  <div>
    <Toast class="max-w-96" />
    <Button @click="visible = !visible" severity="secondary" :icon="visible ? 'pi pi-times' : 'pi pi-at'"
      :size="buttonSize" :class="buttonClass" />

    <div v-if="visible" @scroll="getMoreUsers" :class="[
        popupClass,
        'w-72 max-h-80 p-2 rounded-lg z-20 bg-white border shadow-md border-slate-400 absolute overflow-y-auto']">

      <div v-if="isLoading" class="w-full grid gap-2">
        <div v-for="i in 3" :key="i" class="w-full flex items-center gap-2">
          <Skeleton shape="circle" width="2rem" height="2rem" class="flex-shrink-0" />
          <Skeleton height="1rem" />
        </div>
      </div>

      <div v-else class="w-full grid gap-2">
        <div>
          <IconField iconPosition="left">
            <InputIcon class="pi pi-search"> </InputIcon>
            <InputText type="search" v-model.trim="searchText" @search="getUsers" placeholder="Search to mention"
              class="w-full" />
          </IconField>
        </div>

        <div v-if="users.length" class="w-full grid gap-2">
          <div v-for="user in users" :key="user._id" @click="handleUserClick(user)"
            class="py-1 px-2 hover:bg-accent/10 cursor-pointer rounded-md flex items-center gap-2">
            <DynamicAvatar shape="circle" :user class="w-8 h-8" />
            <p class="text-sm font-semibold">{{ user.name }}</p>
          </div>
        </div>

        <div v-else>No results</div>

      </div>
    </div>
  </div>
</template>