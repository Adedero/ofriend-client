<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import socket from '@/config/socket.config';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

onMounted(() => {
  !socket.connected && socket.connect();

  socket.on('connect', () => {
    console.log('Connected to socket server');
    socket.emit('online', userStore.user.id);
  });
})
</script>

<template>
  <main class="pt-3 px-3 grid grid-rows-12 h-dvh">
    <AppHeader />

    <section class="row-span-10 overflow-y-auto">
      <RouterView />
    </section>

    <MobileNavbarChats />
  </main>
</template>
