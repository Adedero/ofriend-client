<script setup>
import PostItem from '@/components/app/post/PostItem.vue';
import NewPostItem from '@/components/app/post/NewPostItem.vue';
</script>

<template>
  <main>
    <NewPostItem />

    <div class="reel mt-5 grid gap-5 ">
      <PostItem />
    </div>
  </main>
</template>