<script setup>
const features = [
  { title: 'Easy and Efficient Learning', description: 'Plan your learning schedule and enjoy our learning experience' },
  { title: 'Learning Communities', description: 'Plan your learning schedule and enjoy our learning experience' },
  { title: 'E-library and Organizations', description: 'Plan your learning schedule and enjoy our learning experience' },
  { title: 'Discover new interests', description: 'Plan your learning schedule and enjoy our learning experience' }
]
</script>

<template>
  <section class="bg-soft-blue p-5 md:p-10">
    <h1 class="font-bold text-2xl text-center">We make learning seamless.</h1>

    <div class="mt-12 lg:grid lg:grid-cols-2 lg:gap-5">
      <div class="hidden lg:block">
        <img src="../../assets/images/features-img.png" alt="we love to learn">
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <div v-for="feature in features" :key="feature.title" class="text-center">
          <h3 class="font-semibold">{{ feature.title }}</h3>
          <p class="mt-2">{{ feature.description }}</p>
        </div>

        <div class="mt-3 grid place-content-center md:col-span-2  lg:col-span-1">
          <button class="btn">Create an account</button>
        </div>
      </div>
    </div>
  </section>
</template>


