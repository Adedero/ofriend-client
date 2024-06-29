<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGet } from '@/composables/server/use-fetch';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();
const allLoaded = ref(false);

const posts = ref([]);

const isLoading = ref(false);

const getPosts = async () => {
  if (allLoaded.value) return;
  isLoading.value = true;
  const { loading } = await useGet(`api/content-reel/${posts.value.length}?products=false`,
  { router, toast }, (data) => {
    if (!data.length) {
      allLoaded.value = true;
      return;
    }
    posts.value.push(...data);
  });
  isLoading.value = loading.value;
}

//Load more posts on scroll
const handleScroll = async (event) => {
  const container = event.target;
  const { scrollHeight, scrollTop, clientHeight } = container;
  if (scrollTop + clientHeight >= scrollHeight - 20) {
    await getPosts();
  }
}


const deletePost = (postId) => posts.value = posts.value.filter(post => post._id !== postId);



const handleCommentCreated = (post) => {
  post.isCommentAdded = true;
  post.comments++;
  post.addedComments ? post.addedComments++ : post.addedComments = 1;
}

const removePostsByBlockedUser = (userId) => {
  posts.value = posts.value.filter(post => post.author._id.toString() !== userId);
}

onMounted( async () => await getPosts())

</script>

<template>
  <Toast class="max-w-96" />

  <main @scroll="handleScroll" class="h-full overflow-y-auto ">
    <NewPostItem />

    <div id="posts-container" class="reel mt-5 grid gap-10">
      <div v-for="post in posts" :key="post._id">
        <PostItem :post @on-like-click="(data) => data.isLiked ? post.likes++ : post.likes--"
          @on-post-shared="post.reposts++" @on-post-deleted="deletePost"
          @on-comment-created="handleCommentCreated(post)" @userBlocked="removePostsByBlockedUser" />

        <div v-if="post.isCommentAdded" class="text-sm flex items-center gap-2 mt-2">
          <p><b>You</b> added {{ post.addedComments < 2 ? 'a comment' : post.addedComments + ' comments' }}.</p>
              <Button @click="$router.push(`/app/post/${post._id}`)" label="View comment" severity="secondary"
                size="small" class=" text-sm h-8" />
        </div>
      </div>

      <PostDetailsSkeleton v-if="isLoading" />
    </div>
  </main>
</template>
