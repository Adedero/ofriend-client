<script setup>
import Button from 'primevue/button';
</script>

<template>
  <section class="pb-20 md:grid md:grid-cols-2">
    <div class="px-5 text-center md:text-left lg:px-20">
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold">Discover a social way of learning</h1>

      <p class="mt-8 md:mt-10 lg:text-lg xl:text-xl">
        Are you looking for a platform to learn a skill or improve academically? Ofriend got you covered with our social
        education platform.
      </p>

      <Button @click="$router.push('/onboarding')" label="Get Started" class="btn mt-3" />

      <div class="mt-10">
        <p>Trusted
          <span class="text-accent">
            <a href="#">Utiva,</a>
            <a href="#"> Ofriend,</a>
            <a href="#"> LASU,</a>
            <a href="#"> ESUT,</a>
            <a href="#"> Jamb</a>
          </span>
        </p>
      </div>

      <div data-aos="fade-up" data-aos-duration="800"
        class="mt-5 flex items-center justify-center gap-5 md:justify-normal">
        <button class="btn flex items-center justify-center gap-3 md:h-auto md:w-44">
          <img src="../../assets/images/apple.svg" alt="apple-store" class="w-6">
          <div class="text-left flex flex-col">
            <small class="text-[0.7rem]">Download on</small>
            <p class="text-[0.85rem] md:text-base -mt-1">Apple Store</p>
          </div>
        </button>

        <button class="btn flex items-center justify-center gap-3 md:h-auto md:w-44">
          <img src="../../assets/images/playstore.svg" alt="play-store" class="w-6">
          <div class="text-left flex flex-col">
            <small class="text-[0.7rem]">Download on</small>
            <p class="text-[0.85rem] md:text-base -mt-1">Play Store</p>
          </div>
        </button>
      </div>
    </div>

    <div class="hidden md:block">
      <img data-aos="fade-left" data-aos-duration="800" src="../../assets/images/landing-img.png"
        alt="ofriend landing image">
    </div>
  </section>
</template>
