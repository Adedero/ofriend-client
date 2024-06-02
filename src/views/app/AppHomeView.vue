<script setup>
import MobileNavbar from '@/components/app/MobileNavbar.vue';
</script>

<template>
  <main class="relative h-[calc(100dvh-6rem)] pt-5">
    <nav>
      Sidebar
    </nav>

    <section>
      Content reel
    </section>

    <nav>
      Sidebar
    </nav>

    <div class="absolute w-full bottom-0 lg:hidden">
      <MobileNavbar />
    </div>
  </main>
</template>