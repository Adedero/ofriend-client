<script setup>
import { computed, defineAsyncComponent, ref, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useGet } from '@/composables/utils/use-fetch';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { addToast } from '@/composables/utils/add-toast';

const CommentItem = defineAsyncComponent({
  loader: () => import('@/components/app/post/CommentItem.vue')
});
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const hasMoreComments = ref(false);
const commentSection = ref(null);

const res = ref({
  loading: true,
});
//Gets the required post
const getPost = async () => {
  try {
    res.value = await useGet(`api/get-post/${route.params.postId}`);
    //console.log(res.value.data);
    if (!res.value || res.value.error) return router.push('/500');
    if (res.value.status === 401 && res.value.data.authMessage) return router.push({ name: 'signin' });
    if (res.value.status === 404 || !res.value.data) return router.push('/404');
  } catch (error) {
    console.log(error);
    router.push('/500');
  } finally {
    res.value.loading = false;
  }
}

const comments = ref([]);
const newComments = ref([]);
//Adds a new comment to the list of comments
const onCommentCreated = (comment) => {
  const authorId = comment.author;
  comment = {
    ...comment,
    author: {
      _id: authorId,
      name: userStore.user.name,
      imageUrl: userStore.user.imageUrl,
    }
  }
  res.value.data.post.comments++;
  newComments.value.push(comment);
}


const SKIP = computed(() => comments.value.length);
const LIMIT = 5;
const commentsRes = ref({});

const loadComments = async () => {
  commentsRes.value.loading = true;
  try {
    commentsRes.value = await useGet(`api/get-comments/${route.params.postId}?skip=${SKIP.value}&limit=${LIMIT}`);
    //console.log(commentsRes.value.data);
    if (!commentsRes.value || commentsRes.value.error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong. Please try again later' });
      return;
    }
    if (commentsRes.value.status === 200) {
      newComments.value = [];
      if (commentsRes.value.data.comments.length) {
        comments.value.push(...commentsRes.value.data.comments);
        hasMoreComments.value = true;
        return
      }
      hasMoreComments.value = false;
      return;
    }
    addToast(commentsRes.value, toast, false);
  } catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong. Please try again later' });
  } finally {
    commentsRes.value.loading = false;
  }
}

//updates the likes on the post
const updateLikes = (data) => {
  const { isLiked } = data;
  isLiked ? res.value.data.post.likes ++ : res.value.data.post.likes--
}

watch(
  () => route.params.postId,
  () => {
    comments.value = [];
    newComments.value = [];
  }
)
watchEffect(async () => await getPost())

</script>

<template>
  <Toast class="max-w-96" />
  <PostDetailsSkeleton v-if="res.loading" />
  <div v-else>
    <div>
      <PostItem :post="res.data.post" @on-like-click="updateLikes" @on-post-shared="res.data.post.reposts++" />
    </div>

    <div class="mt-3">
      <p class="text-lg font-semibold">{{ res.data.post.comments }} {{ res.data.post.comments === 1 ? 'Comment' :
        'Comments' }}</p>
      <Button v-if="res.data.post.comments > 0 && comments.length === 0" @click="loadComments"
        :loading="commentsRes.loading" label="View comments" text
        class="mt-1 border border-primary text-primary px-1 py-1 text-sm" />
    </div>

    <div class="relative">

      <div v-if="comments.length" class="mt-5 grid gap-5">
        <CommentItem v-for="comment in comments" :key="comment._id" :comment="comment"
          @on-reply-created="res.data.post.comments++" />
      </div>

      <div v-if="newComments.length" class="mt-5 grid gap-5">
        <CommentItem v-for="comment in newComments" :key="comment._id" @on-reply-created="res.data.post.comments++"
          :comment="comment" />
      </div>

      <div>
        <Button v-if="hasMoreComments" @click="loadComments" :loading="commentsRes.loading" label="More comments" text
          class="mt-3 border border-primary text-primary px-1 py-1 text-sm" />
      </div>

      <div ref="commentSection" class="sticky mt-2 -bottom-3 cs:-bottom-12 bg-white">
        <NewComment @on-comment-created="onCommentCreated" :post-id="res.data.post._id" />
      </div>
    </div>
  </div>
</template>
