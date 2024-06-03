<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <main class="pt-3 px-3">
    <AppHeader />

    <RouterView />

    <MobileNavbarChats />
  </main>
</template>