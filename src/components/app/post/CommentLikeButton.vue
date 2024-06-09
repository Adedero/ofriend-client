<script setup>
import { ref } from 'vue';
import { formatNumber } from '@/composables/utils/formats';
import { usePost } from '@/composables/utils/use-fetch';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { addToast } from '@/composables/utils/add-toast';

const toast = useToast();
const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
});


const myComment = ref(props.comment);

const res = ref({});
const toggleLike = async () => {
  res.value.loading = true;
  try {
    res.value = await usePost(`api/toggle-comment-like/${myComment.value._id}`);
    if (!res.value || res.value.error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong. Please, try again later' });
      return
    }
    if (res.value.status === 200) {
      myComment.value.isLikedByViewer = res.value.data.liked;
      res.value.data.liked ? myComment.value.likes ++ : myComment.value.likes --;
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
</script>

<template>
  <Toast class="max-w-96" />
  <Button @click="toggleLike" :label="formatNumber(myComment.likes)" size="small" rounded
    :icon="myComment.isLikedByViewer ? 'pi pi-thumbs-up-fill text-primary' : 'pi pi-thumbs-up'" severity="secondary" />
</template>
