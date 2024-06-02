<script setup>
import { RouterLink } from 'vue-router';
const links = [
  {
    name: 'Home',
    path: '/app/home',
    icon: 'pi pi-home',
  },
  {
    name: 'Messages',
    path: '/',
    icon: 'pi pi-comments',
  },
  {
    name: 'Profile',
    path: '/',
    icon: 'pi pi-user',
  },
  {
    name: 'Notifications',
    path: '/',
    icon: 'pi pi-bell',
  }
]
</script>


<template>
  <div class="flex items-center justify-between">
    <RouterLink v-for="link in links" :key="link.name" :to="link.path" class="mobile-nav text-sm flex flex-col items-center justify-center">
      <span :class="link.icon" style="font-weight: 400; font-size: 1.2rem"></span>
      <p class="font-semibold">{{ link.name }}</p>
    </RouterLink>
  </div>
</template>

<style>

a.mobile-nav {
  span {

  }
}

a.mobile-nav.router-link-exact-active {
  span {
    @apply bg-primary text-white px-4 py-2 rounded-full
  }
}
</style>
