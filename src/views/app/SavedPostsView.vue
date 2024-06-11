<script setup>
import { computed, onMounted, ref } from 'vue';
import { useGet } from '@/composables/utils/use-fetch';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const posts = ref([]);

const length = computed(() => posts.value.length);

const res = ref({});
const loading = ref(false);
const allLoaded = ref(false);

const getSavedPosts = async () => {
  if (loading.value || allLoaded.value) return;
  loading.value = true;
  try {
    res.value = await useGet(`api/get-saved-posts/${length.value}`);
    const { savedPosts } = res.value.data;
    //console.log(savedPosts);
    if (savedPosts.length > 0) {
      posts.value.push(...savedPosts);
      return;
    }
    allLoaded.value = true;
  } catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: 'Error', detail: error.message });
  } finally {
    loading.value = false;
  }
}

const removePost = (postId) => posts.value = posts.value.filter(post => post.post._id !== postId);

const onScroll = event => {
  const container = event.target;
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
    console.log('pushed');
  }
}

onMounted(async () => await getSavedPosts())
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
