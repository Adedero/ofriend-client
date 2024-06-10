<script setup>
import { timeAgo } from '@/composables/utils/formats';
defineProps({
  post: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="cursor-pointer" @click="$router.push({ name: 'user-post', params: { postId: post._id } })">
    <Panel>
      <template #header>
        <div class="flex items-center gap-2">
          <DynamicAvatar :user="post.author" size="large" shape="circle" />
          <div class="grid">
            <span class="font-bold">{{ post.author.name }}</span>
            <small class="text-slate-500">{{ timeAgo(post.createdAt) }}</small>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="text-sm flex justify-end">
          <PostStats :post="post" />
        </div>
      </template>

      <div class="mt-2">
        <div v-if="post.hasText">
          <PostTextContent :text="post.textContent" />
        </div>

        <div v-if="post.hasMedia" class="mt-5">
          <PostMedia :media="post.media" />
        </div>

        <div v-if="post.isReposting" class="mt-5 px-2">
          <RePost :post="post.repostedPost" />
        </div>
      </div>
    </Panel>
  </div>
</template>
