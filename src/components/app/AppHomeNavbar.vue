<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";

const routes = [
  {
    name: 'Home',
    path: '/app/home',
    params: '12345',
    icon: 'pi pi-home'
  },
  {
    name: 'Chats',
    path: '/chat',
    params: '12345',
    icon: 'pi pi-envelope'
  },
  {
    name: 'Saved Posts',
    path: '/app/saved-posts',
    icon: 'pi pi-bookmark'
  },
  {
    name: 'My Products',
    path: '/app/products-and-services',
    params: '12345',
    icon: 'pi pi-briefcase'
  },
  {
    name: 'My Profile',
    path: '/app/profile',
    params: '12345',
    icon: 'pi pi-user'
  },
  {
    name: 'Notifications',
    path: '/app/notifications',
    params: '12345',
    icon: 'pi pi-bell'
  }
]
const menu = ref();
const items = ref([
  {
    label: 'Options',
    items: [
      {
        label: 'Adedero Cosmos',
        icon: 'pi pi-user'
      },
      {
        label: 'Joined 14 April, 2024',
        icon: 'pi pi-calendar-clock'
      },
      {
        label: 'UI/UX designer | Brand Promoter',
        icon: 'pi pi-info-circle'
      }
    ]
  }
]);

const toggle = (event) => {
  menu.value.toggle(event);
};

</script>

<template>
  <div class="flex flex-col items-center h-full">
    <div class="text-center flex flex-col items-center flex-shrink-0">
      <img src="../../assets/images/default-profile-img.png" alt="default profile image0"
        class="block w-16 lg:w-20 aspect-square object-cover">

      <div class="hidden mt-2 lg:flex flex-col items-center">
        <h3 class="font-semibold">John Smith</h3>
        <p class="text-text-light">Joined 14 April, 2024</p>

        <p class="mt-2 text-sm font-medium">UI/UX designer | Brand Promoter</p>
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
        <span class="hidden lg:inline">{{ route.name }}</span>
      </RouterLink>
    </nav>

    <div class="mt-auto lg:w-full flex-shrink-0">
      <Button icon="pi pi-sign-out" icon-pos="right" size="large" class="btn lg:hidden w-12" />
      <Button label="Sign out" icon="pi pi-sign-out" icon-pos="right" class="w-full btn hidden lg:flex" />
    </div>
  </div>
</template>

<style scoped>
a.app-nav {
  @apply flex items-center gap-4 p-5 rounded-lg transition-colors hover:bg-accent/10 lg:p-3 lg:pl-5 lg:rounded-md
}

a.app-nav.router-link-exact-active {
  @apply bg-accent/10 font-semibold text-primary relative lg:before:absolute lg:before:content-[''] lg:before:w-2 lg:before:h-full lg:before:left-0 lg:before:bg-accent
}
</style>