<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import NewPostItem from '@/components/app/post/NewPostItem.vue';
import { useGet } from '@/composables/utils/use-fetch';
import { addToast } from '@/composables/utils/add-toast';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();
const res = ref({});
const posts = ref([]);
const getPosts = async () => {
  res.value.loading = true;
  try {
    res.value = await useGet(`api/content-reel/${posts.value.length}`);
    //console.log(res.value.data)
    if (!res.value || res.value.error) return router.push('/500');
    if (res.value.status === 401 && res.value.data.authMessage) return router.push({ name: 'signin' });
    if (res.value.status !== 200) return addToast(res.value, toast, false);
    posts.value.push(...res.value.data);
  } catch (error) {
    console.log(error)
  }
}

onMounted( async () => await getPosts())
</script>

<template>
  <Toast class="max-w-96" />
  <main>
    <NewPostItem />

    <div id="posts-container" class="reel mt-5 grid gap-10">
      <PostItem
        v-for="post in posts"
        :key="post._id"
        :post
        @on-like-click="(data) => data.isLiked ? post.likes++ : post.likes--"
        @on-post-shared="post.reposts++" />
    </div>
  </main>
</template>
