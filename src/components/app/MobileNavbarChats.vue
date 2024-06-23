<script setup>
import { RouterLink } from 'vue-router';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const links = [
  {
    name: 'Home',
    path: '/app',
    icon: 'pi pi-home'
  },
  {
    name: 'Messages',
    path: '/m/chat',
    icon: 'pi pi-comments',
    isCurrent: true
  },
  {
    name: 'Profile',
    path: `/app/profile/${userStore.user.id}`,
    icon: 'pi pi-user'
  },
  {
    name: 'Notifications',
    path: '/app/notifications',
    icon: 'pi pi-bell'
  }
]
</script>

<template>
  <div class="flex items-center justify-between bg-white">
    <RouterLink
      v-for="link in links"
      :key="link.name"
      :to="link.path"
      class="mobile-nav text-sm flex flex-col items-center justify-center"
      :class="{ 'link-active': link.isCurrent }"
    >
      <span :class="link.icon" style="font-weight: 400"></span>
      <p class="font-semibold text-sm -mt-0.5">{{ link.name }}</p>
    </RouterLink>
  </div>
</template>

<style scoped>
a.mobile-nav {
  span {
    @apply px-4 py-2;
  }
}

a.mobile-nav.link-active {
  span {
    @apply bg-primary text-white  rounded-full;
  }
}
</style>
