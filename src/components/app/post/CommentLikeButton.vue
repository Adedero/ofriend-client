<script setup>
defineProps({
  likes: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <Button :label="likes.toString()" size="small" rounded icon="pi pi-thumbs-up" severity="secondary" />
</template>
