<script setup>
import AppSearchBar from '@/components/app/AppSearchBar.vue';
import DarkModeToggler from '@/components/ui/DarkModeToggler.vue';
import MenuPopup from '@/components/app/MenuPopup.vue';
import Avatar from 'primevue/avatar';
</script>
<template>
  <header class="flex items-center justify-between h-12">
    <div class="flex items-center gap-4">
      <div @click="$router.push({ name: 'app-home' })"
        class="cursor-pointer w-32 h-10 bg-[url(../assets/images/logo-dark.svg)] bg-no-repeat bg-cover dark:bg-[url(../assets/images/logo-light.svg)]">
      </div>

      <AppSearchBar />
    </div>

    <div class="flex items-center gap-3">

      <div class="hidden icons cs:flex items-center gap-1">
        <RouterLink to="/" class="p-2 rounded hover:bg-soft-gray-2 grid place-content-center">
          <span class="pi pi-user"></span>
        </RouterLink>

        <RouterLink to="/" class="p-2 rounded hover:bg-soft-gray-2 grid place-content-center">
          <span class="pi pi-bell"></span>
        </RouterLink>

        <DarkModeToggler />
      </div>

      <Avatar label="P" shape="circle" class="bg-soft-gray-2 w-10 h-10 text-xl font-medium cursor-context-menu" />

      <MenuPopup class="cs:hidden" />
    </div>
  </header>

</template>
