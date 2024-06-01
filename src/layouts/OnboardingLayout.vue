<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <main class="lg:h-dvh lg:grid lg:grid-cols-5">
    <section class="hidden bg-no-repeat bg-center bg-[url(../assets/images/onboarding-img.png)] lg:block lg:col-span-2">
      <!-- <img src="../assets/images/onboarding-img.png" alt="background image" class="h-full w-full object-cover"> -->
      <h1 class="text-white font-bold text-3xl ml-10 mt-20">Discover New <br> Learning Interests.</h1>
    </section>

    <section
      class="grid place-content-center gap-4 px-5 py-10 lg:max-h-full lg:overflow-y-auto lg:col-span-3">
      <RouterLink to="/">
        <img src="../assets/images/logo-dark.svg" alt="ofriend logo" class="w-32">
      </RouterLink>

      <RouterView />
    </section>
  </main>
</template>
