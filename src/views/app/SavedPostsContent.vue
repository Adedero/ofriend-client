<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGet } from '@/composables/server/use-fetch';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

const limit = 10;

const { data: posts } = await useGet(`api/get-saved-posts?skip=0&limit=${limit}`, { router, toast })

const postsLength = computed(() => posts.value.length);

const loading = ref(false);
const allLoaded = ref(false);

const loadMorePosts = async () => {
  if (loading.value || allLoaded.value) return;
  loading.value = true;
  await useGet(`api/get-saved-posts?skip=${postsLength.value}&limit=${limit}`, { router, toast }, (data) => {
    posts.value.push(...data);
    if (data.length < limit) allLoaded.value = true;
    else allLoaded.value = true;
  });
  loading.value = false;
}

const removePost = (postId) => posts.value = posts.value.filter(post => post.post._id !== postId);

const onScroll = event => {
  const container = event.target;
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
    loadMorePosts();
  }
}

</script>

<template>
  <div>
    <Toast class="max-w-96" />
    <h1 class="font-semibold text-xl">Saved posts</h1>

    <div @scroll="onScroll" class="mt-2 grid content-start gap-3 h-[calc(100dvh-12rem)]">
      <SavedPostItem v-for="post in posts" :key="post._id" :post="post.post" :save-date="post.createdAt" @on-post-unsaved="removePost" />
      
      <div v-if="loading" class="grid place-content-center">
        <span class="pi pi-spinner pi-spin text-primary" style="font-size: 1.2rem"></span>
      </div>
    </div>
  </div>
</template>
