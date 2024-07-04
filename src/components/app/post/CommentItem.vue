<script setup>
import { computed, defineAsyncComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import DynamicAvatar from '@/components/ui/DynamicAvatar.vue';
import { timeAgo } from '@/composables/utils/formats';
import { useUserStore } from '@/stores/user';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useToastError } from '@/composables/utils/add-toast';
import { useGet, usePost } from '@/composables/server/use-fetch';
import useFirebaseUpload from '@/composables/utils/firebase-upload';
import { revertHTML } from '@/composables/utils/html-parse';
import filterMentions from '@/composables/utils/filter-mentions';

const ReplyCommentItem = defineAsyncComponent({
  loader: () => import('@/components/app/post/ReplyCommentItem.vue')
})
const props = defineProps({
  comment: {
    type: Object
  }
});

const emit = defineEmits(['onReplyCreated', 'onCommentDeleted', 'onReplyDeleted']);


const router = useRouter();
const toast = useToast();
const userStore = useUserStore();
const firebase = useFirebaseUpload();

const viewerIsCommentAuthor = computed(() => props.comment.author._id === userStore.user.id)

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
const repliesLoading = ref(false);
const allRepliesLoaded = ref(false);
const loadReplies = () => {

  if (allRepliesLoaded.value || repliesLoading.value) return;

  repliesLoading.value = true;

  useGet(`api/get-replies/${refComment.value.post}/${refComment.value._id}?skip=${SKIP.value}&limit=${LIMIT}`,
    { router, toast },
    (data) => {
      repliesLoading.value = false;
      newReplies.value = [];
      replies.value.push(...data.replies);
      
      if (data.replies.length < LIMIT) {
        allRepliesLoaded.value = true;
        hasMoreReplies.value = false;
      } else {
        hasMoreReplies.value = true;
        allRepliesLoaded.value = false;
      }
    }
  );
}


//Comment options
const op = ref();
const toggle = (event) => op.value.toggle(event);

//editing a comment
const visible = ref(false);
const textToEdit = ref(revertHTML(props.comment.textContent) || '');

const mentions = ref(props.comment.mentions || []);
const filteredMentions = ref([]);

const handleMention = (user) => {
  mentions.value.push({ id: user._id, name: user.name });
  textToEdit.value = textToEdit.value.concat(`@${user.name.split(' ').join('')} `);
  document.getElementById('v-textbox').focus();
}

const editLoading= ref(false);
const saveEdit = () => {
  if (!textToEdit.value || textToEdit.value === props.comment.textContent) return;

  editLoading.value = true;

  const textContent = filterMentions(textToEdit.value, mentions.value, filteredMentions.value);

  const edit = { textContent, isEdited: true, mentions: filteredMentions.value };

  usePost(`api/edit-comment/${props.comment._id}`, { body: { edit }, method: 'PUT', router, toast }, () => {
    editLoading.value = false;
    refComment.value.textContent = textContent;
    visible.value = false;
  });
}

//Delete comment
const deleteLoading = ref(false);
const deleteComment = async () => {

  deleteLoading.value = true;

  if (refComment.value.hasMedia) {
    const errorResult = await firebase.deleteSingleFile(refComment.value.media.url);
    if (errorResult) {
      deleteLoading.value = false;
      useToastError(toast, errorResult);
      return;
    }
  }

  await usePost(`api/delete-comment/${refComment.value._id}/${refComment.value.post}?parent=${refComment.value.parentComment}`, {
    method: 'DELETE', router, toast
  });

  deleteLoading.value = false;

  emit('onCommentDeleted', refComment.value._id);
}

//When a reply is deleted
const handleReplyDeleted = (replyId) => {
  replies.value = replies.value.filter(reply => reply._id.toString() !== replyId.toString());
  newReplies.value = newReplies.value.filter(reply => reply._id.toString() !== replyId.toString());
  refComment.value.replies--;
  emit('onReplyDeleted')
}

const isReplyingToReply = ref(false);
const parentReply = ref({});

//When a user is replying to a reply
const handleCancelReply = () => {
  isReplyingToReply.value = false;
  parentReply.value = {};
}

const handleReply = (reply) => {
  if (isReplyingToReply.value) return handleCancelReply();
  
  isReplyingToReply.value = true;
  parentReply.value = reply;
}


</script>

<template>
  <Toast class="max-w-96" />
  <div>
    <div class="flex gap-1">
      <DynamicAvatar @click="$router.push(`/app/profile/${refComment.author._id}`)" shape="circle"
        :user="refComment.author" class="flex-shrink-0 cursor-pointer w-8 h-8 aspect-square" />

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

            <Button @click="toggle" v-if="viewerIsCommentAuthor" text rounded severity="secondary"
              icon="pi pi-ellipsis-v" />

            <OverlayPanel ref="op">
              <div class="grid gap-2">
                <Button @click="visible = true" v-show="refComment.hasText" label="Edit" severity="secondary"
                  icon="pi pi-file-edit" size="small" />

                <Button @click="deleteComment" :loading="deleteLoading" label="Delete" severity="danger"
                  icon="pi pi-trash" text size="small" />
              </div>
            </OverlayPanel>

            <Sidebar v-model:visible="visible" header="Edit comment" position="bottom" class="h-auto">
              <div class="flex flex-col cs-2:flex-row cs-2:items-end gap-3 mt-2">
                <VMention @on-mention="handleMention" popup-class="bottom-16 left-5" button-class="h-full" />

                <VTextbox input-id="v-textbox" v-model="textToEdit" rows="1" auto-resize :max-rows="5" />

                <Button :loading="editLoading" @click="saveEdit" label="Save" icon="pi pi-check"
                  class="btn h-10 flex-shrink-0 w-fit self-end" />
              </div>
            </Sidebar>
          </div>

        </div>

        <div class="whitespace-pre-wrap mt-1 text border rounded-md py-2 px-3">
          <p v-if="refComment.hasText" v-html="refComment.textContent" class="whitespace-pre-wrap"></p>

          <div v-if="refComment.hasMedia" class="mt-3">
            <CommentMedia :media="refComment.media" />
          </div>
        </div>
        <div class="mt-1 cursor-context-menu flex items-center justify-between gap-2 text-sm font-medium">
          <Button v-if="refComment.replies && !replies.length" @click="loadReplies" :loading="repliesLoading"
            :label="`${refComment.replies} ${ refComment.replies === 1 ? 'reply': 'replies' }`" size="small" rounded
            severity="secondary" />

          <button @click="refComment.isReplying = !refComment.isReplying">{{ refComment.isReplying ? 'Cancel' : 'Reply'
            }}</button>
        </div>
      </div>
    </div>

    <!-- Reply box -->
    <div v-if="refComment.isReplying" class="mt-3 ml-8">
      <NewReply :post-id="refComment.post" :parentComment="refComment" @on-reply-created="onReplyCreated" />
    </div>

    <!-- Comment replies -->
    <div v-if="replies.length" class="mt-5 grid gap-5 ml-8">
      <ReplyCommentItem @onCommentDeleted="handleReplyDeleted" v-for="reply in replies" :key="reply._id"
        :comment="reply" @isReplying="handleReply" @isNotReplying="handleCancelReply" />
    </div>

    <div v-if="newReplies.length" class="mt-5 grid gap-5 ml-8">
      <ReplyCommentItem @onCommentDeleted="handleReplyDeleted" v-for="reply in newReplies" :key="reply._id"
        :comment="reply" @isReplying="handleReply" @isNotReplying="handleCancelReply" />
    </div>

    <div class="mt-3 ml-8">
      <Button v-if="hasMoreReplies" @click="loadReplies" :loading="repliesLoading" label="More replies" text
        class="mt-3 border border-primary text-primary px-1 py-1 text-sm" />
    </div>

    <div v-if="isReplyingToReply" class="mt-3 ml-8 grid">
      <Button @click="handleCancelReply" label="cancel" icon="pi pi-times" size="small" class="justify-self-end bg-primary h-8" />
      <NewReply :post-id="refComment.post" :parentComment="refComment" @on-reply-created="onReplyCreated"
        :isReplyingToReply :parentReply />
    </div>
  </div>
</template>
