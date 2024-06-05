<template>
  <Button @click="$emit('commentClick')" label="Comment" icon="pi pi-comment" severity="secondary" rounded text
    class="text cs:text-sm"></Button>
</template>

<script setup>
defineEmits(['commentClick'])
</script>
