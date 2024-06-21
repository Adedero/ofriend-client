<script setup>
import { onMounted, onUnmounted } from 'vue';
import { RouterView } from 'vue-router';
import socket from '@/config/socket.config';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const handleBeforeUnload = () => {
  socket.emit('offline', userStore.user.id);
};

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
  socket.connect();

  socket.on('connect', () => {
    console.log('Connected to socket server');
  });
  socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
  })
});

onUnmounted(() =>{
  socket.disconnect();
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>

<template>
  <RouterView />
</template>
