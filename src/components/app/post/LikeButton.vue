<script setup>
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { usePost } from '@/composables/server/use-fetch';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(['onLikeClick']);

const router = useRouter();
const toast = useToast();
const myPost = ref(props.post);

const loading = ref(false);
const toggleLike = async () => {
  loading.value = true;
  await usePost(`api/toggle-post-like/${myPost.value._id}`, { router, toast }, (data) => {
    loading.value = false;
    myPost.value.isLikedByViewer = data.liked;
    emit('onLikeClick', { isLiked: data.liked });
  });
}
watchEffect(() => myPost.value = props.post);
</script>

<template>
  <Toast class="max-w-96" />
  <Button @click="toggleLike" label="Like"
    :icon="myPost.isLikedByViewer ? 'pi pi-thumbs-up-fill text-accent' : 'pi pi-thumbs-up'" :loading
    rounded text class="text cs:text-sm"></Button>
</template>
