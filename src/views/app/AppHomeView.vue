<script setup>
import PostItem from '@/components/app/PostItem.vue';
</script>

<template>
  <main>
    <NewPostItem />

    <div class="reel mt-5 grid gap-5 ">
      <PostItem />
    </div>
  </main>
</template>