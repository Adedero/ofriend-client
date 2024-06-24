<script setup>
import { onUnmounted } from 'vue';
import { RouterView } from 'vue-router';
import socket from '@/config/socket.config';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

onUnmounted(() =>{
  socket.emit('offline', userStore.user.id);
  socket.disconnect();
});
</script>

<template>
  <RouterView />
</template>
