<script setup>
import Button from 'primevue/button'
</script>

<template>
  <section class="bg-soft-blue px-5 pt-10 pb-20 lg:px-20 xl:px-40">
    <h1 class="font-bold text-2xl text-center">About Us</h1>

    <div class="mt-10 grid place-content-center gap-10 md:grid-cols-2">
      <div class="grid place-content-center md:block">
        <img src="../../assets/images/about-video.png" alt="about ofriend video" />
      </div>

      <div class="flex flex-col gap-8 items-start justify-center">
        <p class="text-center md:text-left">
          Lorem ipsum dolor sit amet consectetur. Varius faucibus a risus fermentum lectus.
          Tristique maecenas justo non lectus arcu lorem bibendum hendrerit gravida. Sit velit
          interdum lacus pulvinar non.
        </p>

        <div class="grid place-content-center w-full md:block">
          <Button label="Read More" icon="pi pi-arrow-right" icon-pos="right" class="btn" />
        </div>
      </div>
    </div>
  </section>
</template>
