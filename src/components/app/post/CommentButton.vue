<template>
  <Button @click="$emit('commentClick')" label="Comment" class="text-xs cs:text-sm" icon="pi pi-comment" severity="secondary" rounded text></Button>
</template>

<script setup>
defineEmits(['commentClick'])
</script>
