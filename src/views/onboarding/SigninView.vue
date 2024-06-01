<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <section>
    <h1 class="font-bold text-3xl">Welcome Back</h1>
    <p>Don't have an account?
      <RouterLink :to="{ name: 'signup' }" class="text-accent hover:underline">Sign up</RouterLink>
      instead.
    </p>

    <div class="mt-5">

      <InputText id="username" class="w-full" placeholder="Username" />


    </div>
  </section>
</template>
