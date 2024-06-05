<script setup>
import members from '@/data/team.js'
</script>

<template>
  <section class="px-5 py-10 grid gap-8 place-content-center lg:px-20 xl:px-32">
    <h1 class="font-bold text-2xl text-center">Our Team</h1>

    <div class="grid place-content-center gap-10 md:grid-cols-2 lg:gap-20">
      <div class="md:order-2">
        <img src="../../assets/images/our-team-img.png" alt="our team" />
      </div>

      <div class="grid gap-3 place-content-center text-center md:text-left md:order-1">
        <h3 class="font-bold">Meet our team of seasoned professionals</h3>
        <p>
          Stay updated with our latest updates, new features and exciting packages by inputting your
          email below. Stay update with our latest updates, new features and exciting packages by
          inputting your email below.
        </p>
      </div>
    </div>
  </section>

  <section class="bg-soft-blue px-5 py-10 md:px-10 lg:px-20">
    <h1 class="font-bold text-xl text-center">Meet Our Team</h1>

    <div class="mt-5 flex flex-wrap gap-5 justify-center">
      <div v-for="member in members" :key="member.name">
        <img :src="member.image" alt="member.name" />
        <div class="bg-primary text-white p-2">
          <p class="font-semibold">{{ member.name }}</p>
          <p class="font-thin">{{ member.title }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
