<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/headers/AppHeader.vue'
import MobileNavbar from '@/components/app/MobileNavbar.vue'
import AppHomeNavbar from '@/components/app/AppHomeNavbar.vue'
import AppHomeAside from '@/components/app/AppHomeAside.vue'
</script>
<template>
  <main class="px-2 pt-2 pb-5 lg:px-10">
    <AppHeader />

    <section
      class="relative h-[calc(100dvh-5.5rem)] pt-5 md:grid md:grid-cols-8 lg:grid-cols-12 xl:grid-cols-11"
    >
      <nav class="hidden h-full overflow-y-auto md:block lg:col-span-2 xl:col-span-2">
        <AppHomeNavbar />
      </nav>

      <section
        class="h-full overflow-y-auto pb-12 md:px-5 md:col-span-6 lg:col-span-8 xl:col-span-7"
      >
        <RouterView />
      </section>

      <aside class="hidden h-full overflow-y-auto md:block lg:col-span-2 xl:col-span-2">
        <AppHomeAside />
      </aside>

      <div class="absolute w-full -bottom-3 cs:hidden">
        <MobileNavbar />
      </div>
    </section>
  </main>
</template>
