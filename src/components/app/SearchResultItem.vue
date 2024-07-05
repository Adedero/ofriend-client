<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useGet } from '@/composables/server/use-fetch';
import { watchDebounced } from '@vueuse/core';

const props = defineProps({
  searchText: { type: String, default: '' },
  item: { type: String, default: 'post' }
});

const emit = defineEmits(['onPostClick']);

const router = useRouter();
const toast = useToast();

const limit = 10;

const posts = ref([]);

const allLoaded = ref(false);
const loading = ref(false);

let getPosts = async () => {
  if (props.searchText === '') return;

  if (loading.value || allLoaded.value) return;

  loading.value = true;

  await useGet(`api/search-posts-or-products/${props.item}/${props.searchText}?skip=0&limit=${limit}`, { router, toast }, (data) => {

    data.forEach(item => {
      const regex = new RegExp(props.searchText, 'i');

      const text = item.textContent.replace(regex, (match) => `<b>${match}</b>`);
      item.textContent = text;
    });
    
    posts.value = [...data];

    if (data.length < limit) allLoaded.value = true;
  });

  loading.value = false;
}

watchDebounced(
  () => props.searchText,
  () => !!props.searchText && getPosts(),
  { debounce: 2000, maxWait: 5000 },
)

const loadMoreResults = async () => {
  loading.value = true;
  await useGet(`api/search-posts-or-products/${props.item}/${props.searchText}?skip=${posts.value.length}&limit=${limit}`, { router, toast }, (data) => {

    data.forEach(item => {
      const regex = new RegExp(props.searchText, 'i');

      const text = item.textContent.replace(regex, (match) => `<b>${match}</b>`);
      item.textContent = text;
    });

    posts.value.push(...data);
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

const goToPost = (post) => {
  router.push(`/app/post/${post._id}`);
  emit('onPostClick')
}

onMounted(async () => await getPosts());

onUnmounted(() => getPosts = () => null);
</script>

<template>
  <div @scroll="handleScroll" class="h-[calc(100dvh-13rem)] overflow-y-auto">
    <Toast class="max-w-96" />

    <div v-for="post in posts" :key="post._id" @click="goToPost(post)" class="mb-3">
      <PostItem :post />
    </div>

    <div v-show="!posts.length">
      <p>No results</p>
    </div>

    <div v-if="loading">
      <PostDetailsSkeleton />
    </div>
  </div>
</template>