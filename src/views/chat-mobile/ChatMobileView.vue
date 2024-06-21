<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <main class="pt-3 px-3 grid grid-rows-12 h-dvh">
    <AppHeader />

    <section class="row-span-10 overflow-y-auto">
      <RouterView />
    </section>

    <MobileNavbarChats />
  </main>
</template>
