<script setup>
import { computed, inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePost } from '@/composables/server/use-fetch';
import { useToastError } from '@/composables/utils/add-toast';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import useFirebaseUpload from '@/composables/utils/firebase-upload';
import { useUserStore } from '@/stores/user';
import filterMentions from '@/composables/utils/filter-mentions';

const emit = defineEmits(['onReplyCreated']);

const router = useRouter();
const toast = useToast();
const firebase = useFirebaseUpload();
const userStore = useUserStore();

const props = defineProps({
  postId: { type: String, required: true },
  parentComment: { type: Object, required: true },
});

const post = inject('providedPost');

const isReplyingToOwnComment = computed(() => userStore.user.id === props.parentComment.author._id)

const text = ref(isReplyingToOwnComment.value ? '' : `@${props.parentComment.author.name.split(' ').join('')} `);

const mentions = ref([]);
const filteredMentions = ref([]);

const handleMention = (user) => {
  mentions.value.push({ id: user._id, name: user.name });
  text.value = text.value.concat(`@${user.name.split(' ').join('')} `);
  document.getElementById('reply-textarea').focus();
}

const comment = ref({});

const media = ref(null);
const setMedia = (file) => {
  media.value = file;
  isCommentCreated.value = false;
}

const isCommentCreated = ref(false);

const loading = ref(false);

const postReply = async () => {
  if (!text.value && !media.value) return;
  loading.value = true;

  comment.value = {
    post: props.postId,
    postAuthor: post.value.author._id,
    commentAuthor: props.parentComment.author._id,
    isReply: true,
    parentComment: props.parentComment._id,
    hasText: !!text.value,
    hasMedia: !!media.value
  }

  if (media.value) {
    const fileType = media.value.type;
    const [url, error] = await firebase.uploadSingleFile('POSTS', media.value);
    if (error) {
      loading.value = false;
      useToastError(toast, error, 5000);
      return 
    }

    comment.value.media = { url: url, type: fileType }
  }

  comment.value.textContent = filterMentions(text.value, mentions.value, filteredMentions.value);

  comment.value.mentions = filteredMentions.value;

  usePost('api/create-comment', { body: comment.value, router, toast }, (data) => {
    loading.value = false;
    emit('onReplyCreated', data.comment);
    text.value = ''
    media.value = null;
    isCommentCreated.value = true;
  });
}

onMounted(() => document.getElementById('reply-textarea').focus());
</script>

<template>
  <Toast class="max-w-96" />
  <div class="p-1">
    <div class="flex items-end gap-1">

      <div class="flex flex-col md:flex-row gap-1">
        <VMention @on-mention="handleMention" class="md:order-2" popup-class="bottom-24 left-0"
          button-class="h-full w-full" />

        <CommentMediaAttachment :isCommentCreated @on-file-upload="setMedia" @on-cancel-upload="media = null" />
      </div>

      <VTextbox input-id="reply-textarea" v-model="text" rows="1" auto-resize :max-rows="3"
        placeholder="Say something..." />


      <!-- <Textarea id="reply-textarea" v-model="comment.textContent" rows="1" auto-resize placeholder="Say something..."
        class="bg-soft-gray border-none focus:bg-white text-sm max-h-16 flex-grow" /> -->

      <Button @click="postReply" :loading="loading" icon="pi pi-send" class="btn">
        <template #loadingicon>
          <span class="pi pi-spinner pi-spin"></span>
        </template>
      </Button>
    </div>
  </div>
</template>
