<script setup>
import { ref, defineAsyncComponent } from 'vue';

const PostComments = defineAsyncComponent({
  loader: () => import('@/components/app/post/PostComments.vue')
});

const commentsVisible = ref(false);
</script>

<template>
  <div>
    <PostItem />
    
    <div class="relative">
      <div>
        <PostComments />
      </div>

      <div class="sticky mt-2 -bottom-3 cs:-bottom-12 bg-white">
        <NewComment />
      </div>
    </div>

  </div>
</template>