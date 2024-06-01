<script setup>
import Carousel from 'primevue/carousel';
import ofriend from '../../assets/images/logo-dark.svg';
import utiva from '../../assets/images/partners/utiva.jpg';
import esut from '../../assets/images/partners/esut.jpg';
import jamb from '../../assets/images/partners/jamb.jpg';
const products = [
  {
    image: ofriend,
    title: 'Ofriend',
    text: '“With Ofriend, we were provided with an avenue to easily distribute our courses to our vast number of student easily and as well handle swift sales for our courses”'
  },
  {
    image: utiva,
    title: 'Utiva',
    text: '“With Utiva, we were provided with an avenue to easily distribute our courses to our vast number of student easily and as well handle swift sales for our courses”'
  },
  {
    image: esut,
    title: 'Esut',
    text: '“With Utiva, we were provided with an avenue to easily distribute our courses to our vast number of student easily and as well handle swift sales for our courses”'
  },
  {
    image: jamb,
    title: 'Jamb',
    text: '“With Utiva, we were provided with an avenue to easily distribute our courses to our vast number of student easily and as well handle swift sales for our courses”'
  }
];

</script>

<template>
  <section class="px-5 py-10 md:px-10 ">
    <h1 class="font-bold text-2xl text-center">Our Learning Partners.</h1>

    <div class="mt-10">
      <Carousel :value="products" :numVisible="1" :numScroll="1" :circular="true" :autoplayInterval="5000">
        <template #item="slotProps">
          <div class="grid gap-2 md:grid-cols-2 md:justify-between p-2 md:py-4 md:px-10 lg:px-20">
            <div class="grid place-content-center md:items-center md:justify-start">
              <img :src="slotProps.data.image" :alt="slotProps.data.title" class="h-32" />
            </div>

            <div class="text-center grid place-content-center md:text-left">
              <h3 class="font-semibold">{{ slotProps.data.title }}</h3>
              <p class="mt-2">{{ slotProps.data.text }}</p>
            </div>
          </div>
        </template>
      </Carousel>
    </div>
  </section>
</template>
