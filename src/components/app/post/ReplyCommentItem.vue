<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import DynamicAvatar from '@/components/ui/DynamicAvatar.vue';
import { timeAgo } from '@/composables/utils/formats';
import { useUserStore } from '@/stores/user';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useToastError } from '@/composables/utils/add-toast';
import { usePost } from '@/composables/server/use-fetch';
import useFirebaseUpload from '@/composables/utils/firebase-upload';
import { revertHTML } from '@/composables/utils/html-parse';
import filterMentions from '@/composables/utils/filter-mentions';
import { watch } from 'vue';

const props = defineProps({
  comment: {
    type: Object
  }
});

const emit = defineEmits(['onCommentDeleted', 'isReplying', 'isNotReplying']);

const router = useRouter();
const toast = useToast();
const userStore = useUserStore();
const firebase = useFirebaseUpload();

const viewerIsCommentAuthor = computed(() => props.comment.author._id === userStore.user.id)

const refComment = ref(props.comment);

const toggleReply = () => {
  if (refComment.value.isReplying) {
    emit('isNotReplying');
    refComment.value.isReplying = false;
  } else {
    emit('isReplying', refComment.value);
    refComment.value.isReplying = true;
  }
}

watch(() => refComment.value, () => refComment.value.isReplying  ? emit('isReplying', refComment.value) : emit('isNotReplying') )

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

const editLoading = ref(false);
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
            :label="`${refComment.replies} ${refComment.replies === 1 ? 'reply' : 'replies'}`" size="small" rounded
            severity="secondary" />

          <button @click="toggleReply">{{ refComment.isReplying ? 'Cancel' : 'Reply'
            }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
