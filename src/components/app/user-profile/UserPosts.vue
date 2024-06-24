<script setup>
import { computed, onMounted, ref } from 'vue';
import { useGet } from '@/composables/utils/use-fetch';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { watch } from 'vue';

const isNewUser = ref(false);
const props = defineProps({
  userId: { type: String, required: true },
  isViewingSelf: { type: Boolean, required: true }
});

const toast = useToast();

const posts = ref([]);
const length = computed(() => posts.value.length);

const res = ref({});
const loading = ref(false);
const allLoaded = ref(false);

const getUserPosts = async () => {
  if (loading.value || allLoaded.value) return;
  loading.value = true;
  isNewUser.value ? posts.value = [] : posts.value
  try {
    res.value = await useGet(`api/get-user-posts/${props.userId}/${length.value}`);
    const userPosts = res.value.data;
    //console.log(userPosts);
    if (userPosts.length > 0) {
      posts.value.push(...userPosts);
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


const onScroll = async (event) => {
  const container = event.target;
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 20) {
    await getUserPosts()
  }
}

watch(
  () => props.userId,
  async () => {
    isNewUser.value = true;
    await getUserPosts();
  }
);

onMounted(async () => await getUserPosts())
</script>

<template>
  <div @scroll="onScroll" class="pb-3 lg:w-full h-[calc(100dvh-12rem)] overflow-y-auto">
    <Toast class="max-w-96" />
    <NewPostItem v-if="isViewingSelf" />

    <div v-if="posts.length" class="mt-3 grid content-start gap-4">
      <PostItem v-for="post in posts" :key="post._id" :post
        @on-like-click="(data) => data.isLiked ? post.likes++ : post.likes--" @on-post-shared="post.reposts++" />
      <PostDetailsSkeleton v-if="loading" />
    </div>

    <div v-else class="grid place-content-center">
      <img src="../../../assets/images/no-posts.svg" alt="no posts" class="w-60">
    </div>
  </div>
</template>