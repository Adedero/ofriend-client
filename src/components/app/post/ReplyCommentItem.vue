<script setup>
import DynamicAvatar from '@/components/ui/DynamicAvatar.vue';
import { timeAgo } from '@/composables/utils/formats';


defineProps({
  comment: {
    type: Object
  }
});

</script>

<template>
  <div>
    <div class="flex gap-1">
      <DynamicAvatar shape="circle" :user="comment.author" class="h-8 w-8" />
      <div class="w-full">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <p class="font-bold">{{ comment.author.name }}</p>
            <p class="text-text-light text-sm">{{ timeAgo(comment.createdAt) }}</p>
          </div>

          <div class="text-small flex items-center gap-2">
            <CommentLikeButton :comment />
          </div>
        </div>

        <div v-if="comment.hasText" class="whitespace-pre mt-1 text-sm border rounded-lg p-1 md:p-2">
          {{ comment.textContent }}
        </div>

        <div v-if="comment.hasMedia">
          <CommentMedia :media="comment.media" />
        </div>
      </div>
    </div>
  </div>
</template>
