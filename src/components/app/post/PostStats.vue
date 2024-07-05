<script setup>
import { computed, defineAsyncComponent, ref } from 'vue'; 
import { useRouter } from 'vue-router';
import { formatNumber } from '@/composables/utils/formats';
import LikersListSekeleton from '@/components/skeletons/LikersListSekeleton.vue';
import { useGet } from '@/composables/server/use-fetch';
import Toast from 'primevue/toast';
import{ useToast } from 'primevue/usetoast';

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
const router = useRouter();
const toast = useToast();
const visible = ref(false);
const likers = ref([]);
const SKIP = computed(() => likers.value.length);
const LIMIT = 20;
const isLoadMoreVisible = ref(true);

const loading = ref(false)
const showLikers = async () => {
  visible.value = true;
  loading.value = true;
  if (loading.value || !isLoadMoreVisible.value) return;
  await useGet(`api/get-post-likers/${props.post._id}/${SKIP.value}/${LIMIT}`, { router, toast }, (data) => {
    likers.value.push(...data.likers); 
    if (data.likers.length < LIMIT) {
      isLoadMoreVisible.value = false;
    } else {
      isLoadMoreVisible.value = true;
    }
  });
  loading.value = false;
}
</script>


<template>
  <Toast class="max-w-96" />
  <div class="flex items-center gap-2">
    <button @click="showLikers" class="hover:font-semibold">{{ formatNumber(post.likes) }} {{ post.likes == 1 ? 'Like' :
      'Likes' }}</button>

    <span class="pi pi-circle-fill" style="font-size: 0.25rem"></span>

    <button @click="$router.push(`/app/post/${post._id}`)">{{ formatNumber(post.comments) }} {{ post.comments ==
      1 ? 'Comment' : 'Comments' }}</button>
    <span class="pi pi-circle-fill" style="font-size: 0.25rem"></span>

    <p class="cursor-context-menu">{{ formatNumber(post.reposts) }} {{ post.reposts == 1 ? 'Share' : 'Shares' }}</p>
  </div>

  <Sidebar v-model:visible="visible" header="People who liked this" position="right">
    <LikersList v-if="likers.length" :likers @on-load-more="showLikers" :isLoadMoreVisible :loading />
  </Sidebar>
</template>
