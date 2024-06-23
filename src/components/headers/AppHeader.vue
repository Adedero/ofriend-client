<script setup>
import AppSearchBar from '@/components/app/AppSearchBar.vue'
import DarkModeToggler from '@/components/ui/DarkModeToggler.vue'
import MenuPopup from '@/components/app/MenuPopup.vue'
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>
<template>
  <header class="flex items-center justify-between h-12">
    <div class="flex items-center gap-4">
      <div @click="$router.push({ name: 'app-home' })"
        class="cursor-pointer w-32 h-10 bg-[url(../assets/images/logo-dark.svg)] bg-no-repeat bg-cover dark:bg-[url(../assets/images/logo-light.svg)] dark:bg-center dark:bg-contain">
      </div>

      <AppSearchBar />
    </div>

    <div class="flex items-center gap-3">
      <div class="hidden icons cs-2:flex items-center gap-2">
        <RouterLink :to="`/app/profile/${userStore.user.id}`" class="p-2 rounded-full bg-soft-gray-2 grid place-content-center">
          <span class="pi pi-user"></span>
        </RouterLink>

        <RouterLink to="/app/notifications" class="p-2 rounded-full bg-soft-gray-2 grid place-content-center">
          <span class="pi pi-bell"></span>
        </RouterLink>

        <DarkModeToggler />
      </div>

      <DynamicAvatar :user="userStore.user" shape="circle"
        class="w-9 h-9 text-xl cursor-context-menu" />

      <MenuPopup class="cs-2:hidden" />
    </div>
  </header>
</template>
