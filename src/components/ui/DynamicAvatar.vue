<script setup>
import { computed } from 'vue';
const props = defineProps({
  shape: String,
  size: String,
  user: Object
});

const hasImageUrl = computed(() => props.user.imageUrl)
</script>

<template>
  <Avatar v-if="hasImageUrl" :image="user.imageUrl" :size="size" :shape="shape" />

  <Avatar v-else :label="user.name[0]" :size="size" :shape="shape" class="bg-accent/30" />
</template>