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
          <DynamicAvatar :user="post.author" size="large" shape="circle" class="w-12 h-12" />
          <div class="grid">
            <p>
              <span class="font-bold">{{ post.author.name }}</span>
              <span v-if="post.isReposting" class="italic font-medium"> shared a post</span>
            </p>
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
      </div>
    </Panel>
  </div>
</template>
