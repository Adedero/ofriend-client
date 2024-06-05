<template>
  <div class="flex items-center gap-2">
    <button @click="$emit('likeClick')">2.5k Likes</button>

    <span class="pi pi-circle-fill" style="font-size: 0.25rem"></span>

    <button @click="$emit('commentClick')">3.5k Comments</button>
    <span class="pi pi-circle-fill" style="font-size: 0.25rem"></span>

    <p class="cursor-context-menu">10 Reposts</p>
  </div>
</template>

<script setup>
defineEmits(['likeClick', 'commentClick'])
</script>
