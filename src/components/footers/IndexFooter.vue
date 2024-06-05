<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer
    class="bg-primary text-white grid gap-y-8 pt-16 pb-6 px-5 text-sm lg:text-base md:grid-cols-5 lg:px-20"
  >
    <div class="md:col-span-2">
      <RouterLink to="/" class="flex items-center gap-2">
        <img src="../../assets/images/icon.png" alt="ofriend-icon" />
        <h1 class="font-bold text-3xl">Ofriend</h1>
      </RouterLink>
    </div>

    <div class="lg:col-span-1">
      <RouterLink to="/about" class="link font-bold">Company</RouterLink>

      <div class="mt-2 grid gap-1 font-light text-xs lg:text-sm">
        <RouterLink to="/about" class="link">About</RouterLink>
        <RouterLink to="/about/team" class="link">Our Team</RouterLink>
        <RouterLink to="/about/careers" class="link">Careers</RouterLink>
      </div>
    </div>

    <div class="lg:col-span-1">
      <RouterLink to="/legal" class="link font-bold">Resources</RouterLink>

      <div class="mt-2 grid gap-1 font-light text-xs lg:text-sm">
        <RouterLink to="/legal/terms-and-conditions" class="link">Terms and Conditions</RouterLink>
        <RouterLink to="/legal/privacy-policy" class="link">Privacy Policy</RouterLink>
        <RouterLink to="/legal/cookie-policy" class="link">Cookie Policy</RouterLink>
      </div>
    </div>

    <div class="lg:col-span-1">
      <RouterLink to="/contact" class="link font-bold">Contact</RouterLink>

      <div class="mt-2 grid gap-1 font-light text-xs lg:text-sm">
        <p>contact@ofriend.io</p>
        <p>info@ofriend.io</p>
        <p>+234-659999999</p>
      </div>
    </div>

    <div class="md:col-span-5 mt-4 text-sm flex items-center gap-4 md:gap-10">
      <hr class="block flex-grow border-soft-gray" />
      <div class="text-center">
        <p class="font-medium">Ofriend Technologies</p>
        <p class="text-xs lg:text-sm mt-1">All rights reserved 2022</p>
      </div>
      <hr class="block flex-grow border-soft-gray" />
    </div>
  </footer>
</template>

<style scoped>
a.link {
  @apply hover:underline;
}
</style>
