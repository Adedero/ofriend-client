<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useGet } from '@/composables/server/use-fetch';
import { watchDebounced } from '@vueuse/core';

const props = defineProps({ 
  searchText: { type: String, default: '' }
});

const emit = defineEmits(['onUserClick']);

const router = useRouter();
const toast = useToast();

const limit = 10;

const users = ref([]);

const loading = ref(false);
const allLoaded = ref(false);

let getUsers = async () => {
  if (props.searchText === '') return;
  if (loading.value || allLoaded.value) return;

  loading.value = true;

  await useGet(`api/get-mentions/${props.searchText}?skip=0&limit=${limit}`, { router, toast }, (data) => {
    users.value = [...data];
    if (data.length < limit) allLoaded.value = true;
  });

  loading.value = false;
}

watchDebounced(
  () => props.searchText,
  () => !!props.searchText && getUsers(),
  { debounce: 2000, maxWait: 5000 },
)

const loadMoreResults = async () => {
  loading.value = true;
  await useGet(`api/get-mentions/${props.searchText}?skip=${users.value.length}&limit=${limit}`, { router, toast }, (data) => {
    users.value.push(...data);
  });
  loading.value = false;
}

const handleScroll = (event) => {
  const container = event.target;
  const { scrollHeight, scrollTop, clientHeight } = container;
  if (scrollTop + clientHeight >= scrollHeight - 20) {
    loadMoreResults();
  }
}

const goToProfile = (user) => {
  router.push(`/app/profile/${user._id}`);
  emit('onUserClick')
}

onMounted(() => getUsers());

onUnmounted(() => getUsers = () => null);
</script>

<template>
  <div @scroll="handleScroll" class="h-[calc(100dvh-13rem)] overflow-y-auto">
    <Toast class="max-w-96" />

    <div v-for="user in users" :key="user._id" @click="goToProfile(user)"
      class="mb-2  hover:bg-slate-100 rounded p-1 cursor-pointer flex items-center gap-2">
      <DynamicAvatar :user shape="circle" class="w-12 h-12 flex-shrink-0" />
      <p class="font-semibold">{{ user.name }}</p>
    </div>

    <div v-show="!users.length">
      <p>No results</p>
    </div>

    <div v-if="loading">
      <div v-for="i in 3" :key="i" class="flex items-center gap-2 mb-2">
        <Skeleton shape="circle" width="3rem" height="3rem" class="flex-shrink-0" />
        <Skeleton width="75%" height="1rem" />
      </div>
    </div>
  </div>
</template>