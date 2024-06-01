<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import Button from 'primevue/button';
import Sidebar from 'primevue/sidebar';

const visible = ref(false);
</script>

<template>
  <header class="sticky top-0 z-10 bg-white flex items-center justify-between shadow-sm py-2 px-5 lg:px-20">
    <div class="logo">
      <RouterLink to="/">
        <img src="../../assets/images/logo-dark.svg" alt="">
      </RouterLink>
    </div>

    <div class="hidden links lg:flex items-center gap-10">
      <RouterLink to="/" class="nav">Home</RouterLink>

      <RouterLink to="/about" class="nav">About</RouterLink>

      <RouterLink to="/contact" class="nav">Contact</RouterLink>
    </div>

    <div class="hidden actions lg:flex items-center gap-2">
      <RouterLink to="/onboarding/login">
        <Button label="Sign in" text class="text-primary" />
      </RouterLink>

      <RouterLink to="/onboarding/signup">
        <Button label="Create an Account" class="btn" />
      </RouterLink>
    </div>

    <div class="flex items-center gap-3 lg:hidden">
      <RouterLink to="/onboarding">
        <Button label="Log in" class="btn" />
      </RouterLink>

      <button @click="visible = true" type="button"
        class="grid place-content-center p-2.5 transition rounded hover:bg-soft-gray-2">
        <span class="pi pi-bars text-primary" style="font-size: 1.2rem"></span>
      </button>
    </div>
  </header>

  <Sidebar v-model:visible="visible" position="right" class="w-[80dvw] md:w-80">
    <template #header>
      <img src="../../assets/images/logo-dark.svg" alt="ofriend logo" class="w-28">
    </template>

    <div class="links grid justify-start gap-10 lg:hidden">
      <RouterLink @click="visible = false" to="/" class="nav flex items-center gap-3">
        <span class="pi pi-home -translate-y-0.5"></span>
        <span>Home</span>
      </RouterLink>

      <RouterLink @click="visible = false" to="/about" class="nav flex items-center gap-3">
        <span class="pi pi-info-circle -translate-y-0.5"></span>
        <span>About</span>
      </RouterLink>

      <RouterLink @click="visible = false" to="/contact" class="nav flex items-center gap-3">
        <span class="pi pi-address-book -translate-y-0.5"></span>
        <span>Contact</span>
      </RouterLink>
    </div>
  </Sidebar>
</template>

<style>
a.nav {
  @apply font-medium relative
}

a.nav::before {
  @apply absolute content-[""] left-0 bottom-0 w-0 h-1 bg-accent rounded translate-y-0.5 transition-all
}

a.nav:hover:before {
  @apply w-full
}

a.nav.router-link-exact-active {
  @apply before:w-full
}
</style>