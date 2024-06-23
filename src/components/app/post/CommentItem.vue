<script setup>
import { computed, defineAsyncComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import DynamicAvatar from '@/components/ui/DynamicAvatar.vue';
import { timeAgo } from '@/composables/utils/formats';
import { useUserStore } from '@/stores/user';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { addToast, useToastError } from '@/composables/utils/add-toast';
import { useGet, usePost } from '@/composables/utils/use-fetch';
import useFirebaseUpload from '@/composables/utils/firebase-upload';

const ReplyCommentItem = defineAsyncComponent({
  loader: () => import('@/components/app/post/ReplyCommentItem.vue')
})
const props = defineProps({
  comment: {
    type: Object
  }
});

const router = useRouter();
const toast = useToast();
const emit = defineEmits(['onReplyCreated', 'onCommentDeleted']);
const userStore = useUserStore();

const viewerIsCommenAuthor = computed(() => props.comment.author._id === userStore.user.id)

const refComment = ref(props.comment);

const hasMoreReplies = ref(false);

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
  newReplies.value.push(reply);
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
      if (replyRes.value.data.replies.length) {
        replies.value.push(...replyRes.value.data.replies);
        hasMoreReplies.value = true;
        return
      } 
      hasMoreReplies.value = false;
      return;      
    }
    addToast(replyRes.value, toast, false);
  } catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong. Please try again later' });
  } finally {
    replyRes.value.loading = false;
  }
}

//Comment options
const op = ref();
const toggle = (event) => op.value.toggle(event);

//editing a comment
const visible = ref(false);
const textToEdit = ref(props.comment.textContent || '');

const editRes = ref({});
const saveEdit = async () => {
  if (!textToEdit.value || textToEdit.value === props.comment.textContent) return;
  const edit = { textContent: textToEdit.value, isEdited: true };
  editRes.value = await usePost(`api/edit-comment/${props.comment._id}`, { edit }, 'PUT');
  console.log(editRes.value);
  refComment.value.textContent = textToEdit.value;
  visible.value = false;
}

//Delete comment
const deleteLoading = ref(false);
const deleteComment = async () => {
  deleteLoading.value = true;

  if (refComment.value.hasMedia) {
    const result = useFirebaseUpload().deleteSingleFile(refComment.value.media.url);
    if (result) {
      deleteLoading.value = false;
      useToastError(toast, result);
      return;
    }
  }
  
  const { loading, error, status, data } = await usePost(`api/delete-comment/${refComment.value._id}/${refComment.value.post}?parent=${refComment.value.parentComment}`, {}, 'DELETE');

  deleteLoading.value = loading.value;
  
  if (error.value) return useToastError(toast, error.value);
  if (status.value === 401 && data.value.authMessage) return router.push({ name: 'signin' });
  if (status.value !== 200) {
    return toast.add({ severity: 'warn', summary: data.value.info, detail: data.value.message, life: 5000 });
  }
  emit('onCommentDeleted', refComment.value._id);
}
</script>

<template>
  <Toast class="max-w-96" />
  <div>
    <div class="flex gap-1">
      <DynamicAvatar @click="$router.push(`/app/profile/${refComment.author._id}`)" shape="circle"
        :user="refComment.author" class="cursor-pointer w-8 h-8 aspect-square" />

      <div class="w-full">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <p @click="$router.push(`/app/profile/${refComment.author._id}`)" class="cursor-pointer font-bold">{{
              refComment.author.name }}</p>
            <p class="text-text-light text-sm">{{ timeAgo(refComment.createdAt) }}</p>
            <small v-show="refComment.isEdited" class="text-text-light italic">edited</small>
          </div>

          <div class="flex items-center gap-1">
            <div class="text-small flex items-center gap-2">
              <CommentLikeButton :comment="refComment" />
            </div>

            <Button @click="toggle" v-if="viewerIsCommenAuthor" text rounded severity="secondary"
              icon="pi pi-ellipsis-v" />

            <OverlayPanel ref="op">
              <div class="grid gap-2">
                <Button @click="visible = true" v-show="refComment.hasText" label="Edit" severity="secondary"
                  icon="pi pi-file-edit" size="small" />

                <Button @click="deleteComment" :loading="deleteLoading" label="Delete" severity="danger" icon="pi pi-trash" text
                  size="small" />
              </div>
            </OverlayPanel>

            <Sidebar v-model:visible="visible" header="Edit comment" position="bottom" class="h-auto">
              <div class="flex flex-col cs-2:flex-row cs-2:items-end gap-3 mt-2">
                <Textarea v-model.trim="textToEdit" rows="1" auto-resize
                  class="textarea max-h-80 flex-grow" />

                <Button :loading="editRes.loading" @click="saveEdit" label="Save" icon="pi pi-check"
                  class="btn h-10 flex-shrink-0 w-fit self-end" />
              </div>
            </Sidebar>
          </div>

        </div>

        <div class="whitespace-pre-wrap mt-1 text border rounded-lg p-1 md:p-2">
          <p v-if="refComment.hasText">{{ refComment.textContent }}</p>
          <div v-if="refComment.hasMedia" class="mt-3">
            <CommentMedia :media="refComment.media" />
          </div>
        </div>
        <div class="mt-1 cursor-context-menu flex items-center justify-between gap-2 text-sm font-medium">
          <Button v-if="refComment.replies && !replies.length" @click="loadReplies" :loading="replyRes.loading"
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

    <div class="mt-3 ml-8">
      <Button v-if="hasMoreReplies" @click="loadReplies" :loading="replyRes.loading" label="More replies" text
        class="mt-3 border border-primary text-primary px-1 py-1 text-sm" />
    </div>

    <!-- Reply box -->
    <div v-if="refComment.isReplying" class="mt-3 ml-8">
      <NewReply :post-id="refComment.post" :comment-id="refComment._id" @on-reply-created="onReplyCreated" />
    </div>
  </div>
</template>
