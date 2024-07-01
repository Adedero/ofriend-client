<script setup>
import AppContentReel from './AppContentReel.vue';
</script>

<template>
  <Suspense>
    <template #default>
      <AppContentReel />
    </template>

    <template #fallback>
      <PostDetailsSkeleton />
    </template>
  </Suspense>
</template>