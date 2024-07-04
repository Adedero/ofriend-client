<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePost } from '@/composables/server/use-fetch';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import useFirebaseUpload from '@/composables/utils/firebase-upload';
import socket from '@/config/socket.config';
import filterMentions from '@/composables/utils/filter-mentions';

const emit = defineEmits(['onCommentCreated']);
const router = useRouter();
const toast = useToast();
const firebase = useFirebaseUpload();

const props = defineProps({
  postId: { type: String, required: true },
  postAuthorId: { type: String, required: true }
});

const text = ref('');

const comment = ref({});

const mentions = ref([]);
const filteredMentions = ref([]);

const media = ref(null);
const setMedia = (file) => {
  media.value = file;
  isCommentCreated.value = false;
}

const isCommentCreated = ref(false);

const res = ref({});
const loading = ref(false);

const postComment = async () => {
  if (!text.value && !media.value) return;

  comment.value = {
    post: props.postId,
    hasText: !!text.value,
    hasMedia: !!media.value,
    postAuthor: props.postAuthorId,
  }

  loading.value = true;

  if (media.value) {
    const fileType = media.value.type;
    const [url, error] = await firebase.uploadSingleFile('POSTS', media.value);
    if (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file. Please, check your network connection and try again later.' });
      return;
    }
    comment.value.media = {
      url: url,
      type: fileType
    }
  }

  comment.value.textContent = filterMentions(text.value, mentions.value, filteredMentions.value);
  comment.value.mentions = filteredMentions.value;

  usePost('api/create-comment', { body: comment.value , router, toast }, (data) => {
    loading.value = false;

    emit('onCommentCreated', data.comment);

    comment.value = {
      post: props.postId,
      textContent: '',
      hasText: false,
      hasMedia: false,
      postAuthor: props.postAuthorId,
    };
    media.value = null;
    isCommentCreated.value = true;
    socket.emit('comment-created', data.comment);
  });
}

const handleMention = (user) => {
  mentions.value.push({ id: user._id, name: user.name });
  text.value = text.value.concat(`@${user.name.split(' ').join('')} `);
  document.getElementById('v-reply-textarea').focus();
}

onMounted(() => document.getElementById('v-reply-textarea').focus());

</script>

<template>
  <Toast class="max-w-96" />
  <div class="p-1">
    <div class="flex items-end gap-1">
      <div class="flex gap-2">
        <CommentMediaAttachment :isCommentCreated @on-file-upload="setMedia" @on-cancel-upload="media = null" />

        <VMention @on-mention="handleMention" popup-class="bottom-12 left-0" />
      </div>

      <VTextbox input-id="v-reply-textarea" v-model="text" rows="1" auto-resize :max-rows="5"
        placeholder="Say something..." />

      <Button @click="postComment" :loading="res.loading" icon="pi pi-send" class="btn">
        <template #loadingicon>
          <span class="pi pi-spinner pi-spin"></span>
        </template>
      </Button>
    </div>
  </div>
</template>
