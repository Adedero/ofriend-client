<script setup>
import { computed, defineAsyncComponent, ref } from 'vue';
import DynamicAvatar from '@/components/ui/DynamicAvatar.vue';
import { timeAgo } from '@/composables/utils/formats';
import { getFileType } from '@/composables/utils/file-type';
import { useUserStore } from '@/stores/user';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { addToast } from '@/composables/utils/add-toast';
import { useGet } from '@/composables/utils/use-fetch';

const ReplyCommentItem = defineAsyncComponent({
  loader: () => import('@/components/app/post/ReplyCommentItem.vue')
})
const props = defineProps({
  comment: {
    type: Object
  }
});
const toast = useToast();
const emit = defineEmits(['onReplyCreated']);
const userStore = useUserStore();
const refComment = ref(props.comment);

const fileType = computed(() => {
  if (refComment.value.hasMedia && refComment.value.mediaUrl) {
    const type = getFileType(refComment.value.mediaUrl);
    return type;
  }
  return 'unknown';
});

const replies = ref([]);
const newReplies = ref([]);
//Adds a new comment to the list of comments
const onReplyCreated = (reply) => {
  refComment.value.isReplying = false;
  const authorId = reply.author;
  reply = {
    ...reply,
    author: {
      _id: authorId,
      name: userStore.user.name,
      imageUrl: userStore.user.imageUrl,
    }
  }
  refComment.value.replies++;
  newReplies.value.unshift(reply);
  emit('onReplyCreated');
}


const SKIP = computed(() => replies.value.length);
const LIMIT = 5;
const replyRes = ref({});
const loadReplies = async () => {
  replyRes.value.loading = true;
  try {
    replyRes.value = await useGet(`api/get-replies/${refComment.value.post}/${refComment.value._id}?skip=${SKIP.value}&limit=${LIMIT}`);
    console.log(replyRes.value.data);
    if (!replyRes.value || replyRes.value.error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong. Please try again later' });
      return;
    }
    if (replyRes.value.status === 200) {
      newReplies.value = [];
      replies.value.push(...replyRes.value.data.replies);
      return
    }
    addToast(replyRes.value, toast, false);
  } catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong. Please try again later' });
  } finally {
    replyRes.value.loading = false;
  }
}
</script>

<template>
  <Toast class="max-w-96" />
  <div>
    <div class="flex gap-1">
      <DynamicAvatar shape="circle" :user="refComment.author" />
      <div class="w-full">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <p class="font-bold">{{ refComment.author.name }}</p>
            <p class="text-text-light text-sm">{{ timeAgo(refComment.createdAt) }}</p>
          </div>

          <div class="text-small flex items-center gap-2">
            <CommentLikeButton :likes="refComment.likes" />
          </div>
        </div>

        <div class="whitespace-pre mt-1 text-sm border rounded-lg p-1 md:p-2">
          <p v-if="refComment.hasText">{{ refComment.textContent }}</p>
          <div v-if="refComment.hasMedia" class="mt-3">
            <Image v-if="fileType == 'image'" :src="refComment.mediaUrl" alt="Image" width="100%" preview />

            <video v-if="fileType == 'video'">
              <source :src="refComment.mediaUrl" type="video/*" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <div class="mt-1 cursor-context-menu flex items-center justify-between gap-2 text-sm font-medium">
          <Button v-if="refComment.replies" @click="loadReplies" :loading="replyRes.loading"
            :label="`${refComment.replies} ${ refComment.replies === 1 ? 'reply': 'replies' }`" size="small" rounded
            severity="secondary" />

          <button @click="refComment.isReplying = !refComment.isReplying">{{ refComment.isReplying ? 'Cancel' : 'Reply'
            }}</button>
        </div>
      </div>
    </div>

    <div v-if="newReplies.length" class="mt-5 grid gap-5 ml-8">
      <ReplyCommentItem v-for="reply in newReplies" :key="reply._id" :comment="reply" />
    </div>
    <!-- Comment replies -->
    <div v-if="replies.length" class="mt-5 grid gap-5 ml-8">
      <ReplyCommentItem v-for="reply in replies" :key="reply._id" :comment="reply" />
    </div>

    <div>
      <Button v-if="replies.length > 0 && replies.length < comment.replies" @click="loadReplies"
        :loading="replyRes.loading" label="More replies" text
        class="mt-3 border border-primary text-primary px-1 py-1 text-sm" />
    </div>

    <!-- Reply box -->
    <div v-if="refComment.isReplying" class="mt-3 ml-8">
      <NewReply :post-id="refComment.post" :comment-id="refComment._id" @on-reply-created="onReplyCreated" />
    </div>
  </div>
</template>
