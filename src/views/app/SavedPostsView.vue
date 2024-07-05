<script setup>
import SavedPostsContent from './SavedPostsContent.vue'
</script>

<template>
  <Suspense>
    <template #default>
      <SavedPostsContent />
    </template>

    <template #fallback>
      <div class="grid gap-4">
        <div v-for="i in 3" :key="i" class="flex gap-3 items-center">
          <Skeleton width="5rem" height="5rem" />
          <div class="grid gap-2">
            <Skeleton width="18rem" height="2rem" />
            <Skeleton width="12rem" height="1rem" />
            <Skeleton width="6rem" height="0.8rem" />
          </div>
        </div>
      </div>
    </template>
  </Suspense>
</template>