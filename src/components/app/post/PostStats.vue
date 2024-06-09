<script setup>
import { computed, defineAsyncComponent, ref } from 'vue'; 
import { formatNumber } from '@/composables/utils/formats';
import LikersListSekeleton from '@/components/skeletons/LikersListSekeleton.vue';
import { useGet } from '@/composables/utils/use-fetch';
import Toast from 'primevue/toast';
import{ useToast } from 'primevue/usetoast';
import { addToast } from '@/composables/utils/add-toast';

const LikersList = defineAsyncComponent({
  loader: () => import('@/components/app/post/LikersList.vue'),
  loadingComponent: LikersListSekeleton,
});

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

const toast = useToast();
const visible = ref(false);
const likers = ref([]);
const SKIP = computed(() => likers.value.length);
const LIMIT = 20;
const res = ref({});
const isLoadMoreVisible = ref(true);

const showLikers = async () => {
  visible.value = true;
  try {
    res.value  = await useGet(`api/get-post-likers/${props.post._id}/${SKIP.value}/${LIMIT}`);
    if (res.value.error) {
      toast.add({ severity: 'error', summary: 'Error', detail: res.value.error });
      return;
    }
    if (!res.value.data.success) {
      addToast(res.value, toast, false);
      return;
    }
    if (!res.value.data.likers.length) {
      isLoadMoreVisible.value = false;
    }
    likers.value.push(...res.value.data.likers); 
  } catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Error', detail: error.message });
  }
}
</script>


<template>
  <Toast class="max-w-96" />
  <div class="flex items-center gap-2">
    <button @click="showLikers" class="hover:font-semibold">{{ formatNumber(post.likes) }} Likes</button>

    <span class="pi pi-circle-fill" style="font-size: 0.25rem"></span>

    <button>{{ formatNumber(post.comments) }} Comments</button>
    <span class="pi pi-circle-fill" style="font-size: 0.25rem"></span>

    <p class="cursor-context-menu">{{ formatNumber(post.reposts) }} Reposts</p>
  </div>

  <Sidebar v-model:visible="visible" header="People who liked this" position="right">
    <LikersList v-if="likers.length" :likers @on-load-more="showLikers" :isLoadMoreVisible :loading="res.loading" />
  </Sidebar>
</template>
