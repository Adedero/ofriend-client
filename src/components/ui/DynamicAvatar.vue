<script setup>
import { computed } from 'vue';
const props = defineProps({
  shape: String,
  size: String,
  user: Object,
});

const hasImageUrl = computed(() => props.user.imageUrl)
</script>

<template>
  
  <img v-if="hasImageUrl" :src="user.imageUrl" alt="user profile picture" class="rounded-full object-cover">

  <Avatar v-else :label="user.name[0]" :size="size" :shape="shape" class="bg-accent/30 dark:bg-accent dark:text-primary" />
</template>