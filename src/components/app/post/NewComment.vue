<script setup>
import { onMounted, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { usePost } from '@/composables/utils/use-fetch';
import { addToast } from '@/composables/utils/add-toast';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import useFirebaseUpload from '@/composables/utils/firebase-upload';
import socket from '@/config/socket.config';

const emit = defineEmits(['onCommentCreated']);
const router = useRouter();
const toast = useToast();
const props = defineProps({
  postId: { type: String, required: true },
  postAuthorId: { type: String, required: true }
});

const comment = ref({
  post: props.postId,
  postAuthor: props.postAuthorId,
  textContent: '',
  hasText: false,
  hasMedia: false
});

const media = ref(null);
const setMedia = (file) => {
  media.value = file;
  isCommentCreated.value = false;
}

const isCommentCreated = ref(false);

const res = ref({});
const postComment = async () => {
  if (!comment.value.textContent && !media.value) return;
  res.value.loading = true;
  if (media.value) {
    const fileType = media.value.type;
    const [url, error] = await useFirebaseUpload().uploadSingleFile('POSTS', media.value);
    if (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file. Please, check your network connection and try again later.' });
      return;
    }
    comment.value.media = {
      url: url,
      type: fileType
    }
  }
  try {
    res.value = await usePost('api/create-comment', comment.value);
    if (!res.value || res.value.error) {
      router.push('/500');
      return;
    }

    if (res.value.status === 401 && res.value.data.authMessage) {
      router.push({ name: 'signin' });
      return;
    }
    if (res.value.data.success) {
      emit('onCommentCreated', res.value.data.comment);
      comment.value = {
        post: props.postId,
        textContent: '',
        hasText: false,
        hasMedia: false,
        postAuthor: props.postAuthorId,
      };
      media.value = null;
      isCommentCreated.value = true;
      socket.emit('comment-created', res.value.data.comment);
      return
    }
    addToast(res.value, toast, false);
  } catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Error', detail: error.message });
  } finally {
    res.value.loading = false;
  }
}

watchEffect(() => {
  comment.value.hasText = (comment.value.textContent !== '');
  comment.value.hasMedia = (media.value !== null);
});

onMounted(() => document.getElementById('v-reply-textarea').focus());

</script>

<template>
  <Toast class="max-w-96" />
  <div class="p-1">
    <div class="flex items-end gap-1">
      <CommentMediaAttachment :isCommentCreated @on-file-upload="setMedia" @on-cancel-upload="media = null" />

      <Textarea id="v-reply-textarea" v-model="comment.textContent" rows="1" auto-resize placeholder="Say something..."
        class="bg-soft-gray border-none focus:bg-white text-sm max-h-16 flex-grow" />

      <Button @click="postComment" :loading="res.loading" icon="pi pi-send" class="btn h-9">
        <template #loadingicon>
          <span class="pi pi-spinner pi-spin"></span>
        </template>
      </Button>
    </div>
  </div>
</template>
