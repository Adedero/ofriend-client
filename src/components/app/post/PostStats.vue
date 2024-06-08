<template>
  <div class="flex items-center gap-2">
    <button @click="$emit('likeClick')" class="hover:font-semibold">{{ formatNumber(likes) }} Likes</button>

    <span class="pi pi-circle-fill" style="font-size: 0.25rem"></span>

    <button @click="$emit('commentClick')" class="hover:font-semibold">{{ formatNumber(comments) }} Comments</button>
    <span class="pi pi-circle-fill" style="font-size: 0.25rem"></span>

    <p class="cursor-context-menu">{{ formatNumber(reposts) }} Reposts</p>
  </div>
</template>

<script setup>
import { formatNumber } from '@/composables/utils/formats';
defineEmits(['likeClick', 'commentClick']);
defineProps({
  likes: {
    type: Number,
    required: true
  },
  comments: {
    type: Number,
    required: true
  },
  reposts: {
    type: Number,
    required: true
  }
})
</script>
