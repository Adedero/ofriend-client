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
    path: '/chat',
    icon: 'pi pi-comments',
  },
  {
    name: 'Profile',
    path: '/app/profile',
    icon: 'pi pi-user',
  },
  {
    name: 'Notifications',
    path: '/app/notifications',
    icon: 'pi pi-bell',
  }
]
</script>


<template>
  <div class="translate-y-2 flex items-center justify-between pt-2 bg-white">
    <RouterLink v-for="link in links" :key="link.name" :to="link.path" class="mobile-nav text-sm flex flex-col items-center justify-center">
      <span :class="link.icon" style="font-weight: 400"></span>
      <p class="font-semibold text-sm -mt-0.5">{{ link.name }}</p>
    </RouterLink>
  </div>
</template>

<style>

a.mobile-nav {
  span {
    @apply px-4 py-2
  }
}

a.mobile-nav.router-link-exact-active {
  span {
    @apply bg-primary text-white  rounded-full
  }
}
</style>
