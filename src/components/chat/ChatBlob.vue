<template>
  <div
    :class="[
      '',
      user === 'sender' ? 'bg-primary' : '',
      user === 'receiver' ? 'bg-accent' : ''
    ]"
    >
    Chatblob
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: String,
    required: true
  }
})
</script>