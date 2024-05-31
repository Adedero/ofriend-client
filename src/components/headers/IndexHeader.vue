<script setup>
import { RouterLink } from 'vue-router';
import Button from 'primevue/button';
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

    <Button icon="pi pi-bars" text class="color-primary lg:hidden" />
  </header>
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