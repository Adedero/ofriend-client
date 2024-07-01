<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { formatDate } from '@/composables/utils/formats';
import signout from '@/composables/server/signout';

const userStore = useUserStore();

const routes = [
  {
    name: 'Home',
    path: '/app',
    params: '12345',
    icon: 'pi pi-home'
  },
  {
    name: 'Products',
    path: '/app/products',
    params: '12345',
    icon: 'pi pi-briefcase'
  },
  {
    name: 'Chats',
    path: '/chat',
    params: '12345',
    icon: 'pi pi-comments'
  },
  {
    name: 'Saved Posts',
    path: '/app/saved-posts',
    icon: 'pi pi-bookmark'
  },
  {
    name: 'Notifications',
    path: '/app/notifications',
    params: '12345',
    icon: 'pi pi-bell'
  },
  {
    name: 'My Profile',
    path: `/app/profile/${userStore.user.id}`,
    params: '12345',
    icon: 'pi pi-user'
  }
]
const menu = ref()
const items = ref([
  {
    label: 'Profile',
    items: [
      {
        label: userStore.user.name,
        icon: 'pi pi-user'
      },
      {
        label: 'Joined '+ formatDate(userStore.user.createdAt),
        icon: 'pi pi-calendar-clock'
      },
      {
        label: userStore.user.bio ? userStore.user.bio.slice(0, 20) + '...' : '',
        icon: 'pi pi-info-circle'
      }
    ]
  }
])

const toggle = (event) => {
  menu.value.toggle(event)
}
</script>

<template>
  <div class="flex flex-col items-center h-full">
    <div class="text-center flex flex-col items-center flex-shrink-0">
      <DynamicAvatar :user="userStore.user" shape="circle" class="text-3xl w-16 h-16 lg:w-[4.5rem] lg:h-[4.5rem] flex-shrink-0" />

      <div class="hidden mt-2 lg:flex flex-col items-center">
        <h3 class="font-semibold">{{ userStore.user.name }}</h3>
        <p class="text-text-light">Joined {{ formatDate(userStore.user.createdAt) }}</p>

        <p class="mt-2 text-sm font-medium truncate-3">{{ userStore.user.bio }}</p>
      </div>

      <div class="mt-2 lg:hidden">
        <Button type="button" icon="pi pi-user" @click="toggle" rounded />
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
      </div>
    </div>

    <Divider />

    <nav class="grid gap-1 flex-shrink-0 lg:w-full">
      <RouterLink v-for="route in routes" :key="route.name" :to="route.path" class="app-nav">
        <span :class="[route.icon]"></span>
        <span class="hidden text-sm lg:inline">{{ route.name }}</span>
      </RouterLink>
    </nav>

    <div class="mt-auto lg:w-full flex-shrink-0">
      <Button @click="signout($router)" icon="pi pi-sign-out" icon-pos="right" size="large" class="btn lg:hidden w-12" />
      <Button @click="signout($router)" label="Sign out" icon="pi pi-sign-out" icon-pos="right" class="w-full btn hidden lg:flex" />
    </div>
  </div>
</template>

<style scoped>
a.app-nav {
  @apply flex items-center gap-4 p-5 rounded-lg transition-colors hover:bg-accent/10 lg:p-3 lg:pl-5 lg:rounded-md;
}

a.app-nav.router-link-exact-active {
  @apply bg-accent/10 font-semibold text-primary dark:text-accent relative lg:before:absolute lg:before:content-[''] lg:before:w-2 lg:before:h-full lg:before:left-0 lg:before:bg-accent;
}

.truncate-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
