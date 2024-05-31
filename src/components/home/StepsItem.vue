<script setup>
const steps = [
  'Create an account',
  'View posts from other learners and organizations',
  'Create engaging learning posts',
  'Join organizations or join learning groups',
  'Enjoy free/paid learning courses',
  'Free/paid e-books for you'
]
</script>

<template>
  <section class="bg-primary p-5 md:p-10 text-white">
    <h1 class="font-bold text-2xl text-center">Simplified for you.</h1>

    <div class="mt-8 grid gap-10 items-center md:gap-5 md:grid-cols-2">
      <div class="grid place-content-center">
        <img data-aos="fade-left" data-aos-duration="800" src="../../assets/images/steps-img.png" alt="steps" class="">
      </div>

      <div class="lg:text-lg">
        <h3 class="font-semibold">All you need in one place</h3>
        <ul class="grid gap-3 mt-5">
          <li v-for="step in steps" :key="step" class="flex items-center gap-3">
            <span class="pi pi-arrows-alt text-accent"></span>
            <span>{{ step }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
