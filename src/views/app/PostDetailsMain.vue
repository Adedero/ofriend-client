<script setup>
import { computed, defineAsyncComponent, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useGet } from '@/composables/server/use-fetch';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const CommentItem = defineAsyncComponent({
  loader: () => import('@/components/app/post/CommentItem.vue')
});
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();



const { loading, data } = await useGet(`api/get-post/${route.params.postId}`, { router, toast })


const comments = ref([]);
const newComments = ref([]);
const commentSection = ref(null);

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
  data.value.post.comments++;
  newComments.value.unshift(comment);
}


const SKIP = computed(() => comments.value.length);
const LIMIT = 10;
const isLoading = ref(false);

const allLoaded = ref(false);
const hasMoreComments = ref(false);

const loadComments = () => {
  if (isLoading.value || allLoaded.value) return;

  isLoading.value = true;

  useGet(`api/get-comments/${route.params.postId}?skip=${SKIP.value}&limit=${LIMIT}`, { router, toast }, (payload) => {
    newComments.value = [];
    comments.value.push(...payload.comments);
    if (payload.comments.length < LIMIT) {
      allLoaded.value = true;
      hasMoreComments.value = false;
    } else {
      hasMoreComments.value = true;
      allLoaded.value = false;
    }
  });
}

//updates the likes on the post
const updateLikes = (state) => {
  const { isLiked } = state;
  isLiked ? data.value.post.likes++ : data.value.post.likes--
}

watch(
  () => route.params.postId,
  () => {
    comments.value = [];
    newComments.value = [];
  }
)

//Comment options
const removeComment = (id) => {
  comments.value = comments.value.filter(comment => comment._id.toString() !== id.toString());
  newComments.value = comments.value.filter(comment => comment._id.toString() !== id.toString());
  data.value.post.comments--;
}


</script>

<template>
  <Toast class="max-w-96" />
  <PostDetailsSkeleton v-if="loading" />
  <div v-else>
    <div>
      <PostItem :post="data.post" @on-like-click="updateLikes" @on-post-shared="data.post.reposts++"
        @on-comment-created="onCommentCreated" />
    </div>

    <div class="mt-3">
      <p class="text-lg font-semibold">{{ data.post.comments }} {{ data.post.comments === 1 ? 'Comment' :
        'Comments' }}</p>
      <Button v-show="data.post.comments > 0 && comments.length === 0" @click="loadComments"
        :loading="isLoading" label="View comments" text
        class="mt-1 border border-primary text-primary px-1 py-1 text-sm" />
    </div>

    <div class="relative">
      <div v-if="newComments.length" class="mt-5 grid gap-5">
        <CommentItem v-for="comment in newComments" :key="comment._id" @on-reply-created="data.post.comments++"
          :comment="comment" @on-comment-deleted="removeComment" />
      </div>
      
      <div v-if="comments.length" class="mt-5 grid gap-5">
        <CommentItem v-for="comment in comments" :key="comment._id" :comment="comment"
          @on-reply-created="data.post.comments++" @on-comment-deleted="removeComment" />
      </div>

      <div>
        <Button v-if="hasMoreComments" @click="loadComments" :loading="isLoading" label="More comments" text
          class="mt-3 border border-primary text-primary px-1 py-1 text-sm" />
      </div>

      <div ref="commentSection" class="sticky mt-2 -bottom-3 cs-2:bottom-0  bg-white">
        <NewComment @on-comment-created="onCommentCreated" :post-id="data.post._id"
          :post-author-id="data.post.author._id" />
      </div>
    </div>
  </div>
</template>
