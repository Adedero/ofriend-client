<script setup>
import { RouterLink } from 'vue-router';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
</script>

<template>
  <section class="max-w-80 md:max-w-96">
    <h1 class="font-bold text-3xl">Welcome Back</h1>
    <p>Don't have an account?
      <RouterLink :to="{ name: 'signup' }" class="text-accent hover:underline">Sign up</RouterLink>
      instead.
    </p>

    <div class="mt-10 grid gap-6">
      <InputText class="w-full" placeholder="Email" />

      <Password toggleMask :feedback="false" input-class="w-full" placeholder="Confirm Password" />

      <RouterLink to="/" class="-mt-3 text-stone-400 hover:underline hover:text-accent text-right">Forgot password?</RouterLink>

      <Button label="Sign in" icon="pi pi-sign-in" icon-pos="right" class="btn" />
    </div>
  </section>
</template>
