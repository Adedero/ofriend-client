<script setup>
import { ref } from 'vue';
import { usePost } from '@/composables/utils/use-fetch';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { addToast } from '@/composables/utils/add-toast';

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(['onLikeClick']);

const toast = useToast();
const myPost = ref(props.post);

const res = ref({});
const toggleLike = async () => {
  res.value.loading = true;
  try {
    res.value = await usePost(`api/toggle-post-like/${myPost.value._id}`);
    if (!res.value || res.value.error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong. Please, try again later' });
      return
    }
    if (res.value.status === 200) {
      myPost.value.isLikedByViewer = res.value.data.liked;
      emit('onLikeClick', { isLiked: res.value.data.liked });
      return;
    }
    addToast(res.value, toast, false);
  } catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Error', detail: error.message });
  } finally {
    res.value.loading = false;
  }
}

//watchEffect(() => myPost.value = props.post);
</script>

<template>
  <Toast class="max-w-96" />
  <Button @click="toggleLike" label="Like"
    :icon="myPost.isLikedByViewer ? 'pi pi-thumbs-up-fill text-accent' : 'pi pi-thumbs-up'" :loading="res.loading"
    rounded text class="text cs:text-sm"></Button>
</template>
