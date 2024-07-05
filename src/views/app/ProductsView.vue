<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGet } from '@/composables/server/use-fetch';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();
const allLoaded = ref(false);
const isLoading = ref(false);
const limit = 10;

const { data: posts } = await useGet(`api/content-reel/0/${limit}?products=true`, { router, toast });

async function loadMorePosts() {
  if (isLoading.value || allLoaded.value) return;
  isLoading.value = true;
  await useGet(`api/content-reel/${posts.value.length}/${limit}?products=true`, { router, toast }, (data) => {
    posts.value.push(...data);
    if (data.length < limit) allLoaded.value = true;
  });
  isLoading.value = false;
}

const handleScroll = (event) => {
  const container = event.target;
  const { scrollHeight, scrollTop, clientHeight } = container;
  if (scrollTop + clientHeight >= scrollHeight - 20) {
    loadMorePosts();
  }
}

const deletePost = (postId) => posts.value = posts.value.filter(post => post._id !== postId);


const handleCommentCreated = (post) => {
  post.isCommentAdded = true;
  post.comments++;
  post.addedComments ? post.addedComments++ : post.addedComments = 1;
}

</script>

<template>
  <Toast class="max-w-96" />
  <main @scroll="handleScroll" class="h-full overflow-y-auto ">
    <h1 class="font-semibold text-xl">Products and Services</h1>

    <div id="posts-container" class="reel mt-5 grid gap-10">
      <div v-for="post in posts" :key="post._id">

        <PostItem :post @on-like-click="(data) => data.isLiked ? post.likes++ : post.likes--"
          @on-post-shared="post.reposts++" @on-post-deleted="deletePost"
          @on-comment-created="handleCommentCreated(post)" />

        <div v-if="post.isCommentAdded" class="text-sm flex items-center gap-2 mt-2">
          <p><b>You</b> added {{ post.addedComments < 2 ? 'a comment' : post.addedComments + ' comments' }}.</p>
          
          <Button @click="$router.push(`/app/post/${post._id}`)" label="View comment" severity="secondary"
                size="small" class=" text-sm h-8" />
        </div>
      </div>

    </div>
  </main>
</template>
