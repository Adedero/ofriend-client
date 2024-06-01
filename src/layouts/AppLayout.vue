<script setup>
import { RouterView } from 'vue-router';
import  AppHeader from '@/components/headers/AppHeader.vue';
</script>
<template>
  <main class="p-5 lg:px-10">
    <AppHeader />
    <RouterView />
  </main>
</template>
