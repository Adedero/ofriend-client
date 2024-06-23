<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import NewPostItem from '@/components/app/post/NewPostItem.vue';
import { useGet } from '@/composables/utils/use-fetch';
import { addToast } from '@/composables/utils/add-toast';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();
const allLoaded = ref(false);
const res = ref({});
const posts = ref([]);
const getPosts = async () => {
  if (res.value.loading || allLoaded.value) return;
  res.value.loading = true;
  try {
    res.value = await useGet(`api/content-reel/${posts.value.length}`);
    //console.log(res.value.data)
    if (!res.value || res.value.error) return router.push('/500');
    if (res.value.status === 401 && res.value.data.authMessage) return router.push({ name: 'signin' });
    if (res.value.status !== 200) return addToast(res.value, toast, false);
    if (!res.value.data.length) {
      allLoaded.value = true;
      return;
    }
    posts.value.push(...res.value.data);
  } catch (error) {
    console.log(error)
  }
}

const deletePost = (postId) => posts.value = posts.value.filter(post => post._id !== postId);


const onScroll = async (event) => {
  const container = event.target;
  const { scrollHeight, scrollTop, clientHeight } = container;
  if (scrollTop + clientHeight >= scrollHeight - 20) {
    const scrollPositionFromBottom = scrollHeight - scrollTop;

    await getPosts();

    const newScrollHeight = container.scrollHeight;
    container.scrollTop = newScrollHeight - scrollPositionFromBottom;
  }
};


onMounted( async () => await getPosts())
</script>

<template>
  <Toast class="max-w-96" />
  <main @scroll="onScroll" class="h-full overflow-y-auto ">
    <NewPostItem />

   <div id="posts-container" class="reel mt-5 grid gap-10">
      <PostItem v-for="post in posts" :key="post._id" :post
        @on-like-click="(data) => data.isLiked ? post.likes++ : post.likes--" @on-post-shared="post.reposts++" @on-post-deleted="deletePost" />
      <PostDetailsSkeleton v-if="res.loading" />
    </div>
  </main>
</template>
