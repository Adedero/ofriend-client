<script setup>
import { defineAsyncComponent, ref } from 'vue';

defineProps({
  post: { type: Object, required: true },
  addComment: { type: Boolean, default: false }
});

const NewComment = defineAsyncComponent({ loader: () => import('./NewComment.vue') });

const emit = defineEmits(['commentClick', 'onCommentCreated']);

const visible = ref(false);
const handleCommentCreated = (comment) => {
  emit('onCommentCreated', comment);
  visible.value = false;
}
</script>

<template>
  <Button @click="visible = true" label="Comment" icon="pi pi-comment" severity="secondary" rounded text
    class="text cs:text-sm"></Button>

  <Sidebar v-model:visible="visible" header="Leave a comment" position="bottom">
    <NewComment @on-comment-created="handleCommentCreated" :post-id="post._id" />
  </Sidebar>
</template>
