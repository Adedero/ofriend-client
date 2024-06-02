<script setup>
import { RouterLink } from 'vue-router';
const links = [
  {
    name: 'Home',
    path: '/app/home',
    icon: 'pi pi-home',
  }
]
</script>


<template>
  <div class="w-full flex items-center justify-between">
    <RouterLink v-for="link in links" :key="link.name" :to="link.path">
      <span :class="link.icon"></span>
      <span>{{ link.name }}</span>
    </RouterLink>
  </div>
</template>

