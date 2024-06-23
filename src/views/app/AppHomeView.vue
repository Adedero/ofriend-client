<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
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
    res.value = await useGet(`api/content-reel/${posts.value.length}?products=false`);
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

const handleCommentCreated = (post) => {
  post.isCommentAdded = true;
  post.comments++;
  post.addedComments ? post.addedComments++ : post.addedComments = 1;
}


onMounted( async () => await getPosts())
</script>

<template>
  <Toast class="max-w-96" />
  <main @scroll="onScroll" class="h-full overflow-y-auto ">
    <NewPostItem />

    <div id="posts-container" class="reel mt-5 grid gap-10">
      <div v-for="post in posts" :key="post._id">
        <PostItem :post @on-like-click="(data) => data.isLiked ? post.likes++ : post.likes--"
          @on-post-shared="post.reposts++" @on-post-deleted="deletePost" @on-comment-created="handleCommentCreated(post)" />

        <div v-if="post.isCommentAdded" class="text-sm flex items-center gap-2 mt-2">
          <p><b>You</b> added {{ post.addedComments < 2 ? 'a comment' : post.addedComments + ' comments' }}.</p>
          <Button @click="$router.push(`/app/post/${post._id}`)" label="View comment" severity="secondary" size="small" class=" text-sm h-8" />
        </div>
      </div>

      <PostDetailsSkeleton v-if="res.loading" />
    </div>
  </main>
</template>
