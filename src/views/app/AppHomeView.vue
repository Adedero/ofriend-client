<script setup>
import MobileNavbar from '@/components/app/MobileNavbar.vue';
import AppHomeNavbar from '@/components/app/AppHomeNavbar.vue';
</script>

<template>
  <main class="relative h-[calc(100dvh-5.5rem)] pt-5 md:grid md:grid-cols-6 lg:grid-cols-9">
    <nav class="hidden h-full overflow-y-auto md:block lg:col-span-2">
      <AppHomeNavbar />
    </nav>

    <section class="h-full overflow-y-auto md:px-5 md:col-span-4 lg:col-span-5">
      dfd
    </section>

    <aside class="hidden md:block lg:col-span-2">
      Sidebar
    </aside>

    <div class="absolute w-full bottom-0 cs:hidden">
      <MobileNavbar />
    </div>
  </main>
</template>