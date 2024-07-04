<script setup>
import PostDetailsSkeleton from '@/components/skeletons/PostDetailsSkeleton.vue';
import PostDetailsMain from './PostDetailsMain.vue';
</script>

<template>
  <Suspense>
    <template #default>
      <PostDetailsMain />
    </template>

    <template #fallback>
      <PostDetailsSkeleton />
    </template>
  </Suspense>
</template>