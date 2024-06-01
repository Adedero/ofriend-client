<script setup>
import { onMounted } from 'vue';
import AOS from 'aos';
import HeroItem from '@/components/home/HeroItem.vue';
import FeaturesItem from '@/components/home/FeaturesItem.vue';
import StepsItem from '@/components/home/StepsItem.vue';
import PartnersItem from '@/components/home/PartnersItem.vue';
import FaqItem from '@/components/home/FaqItem.vue';

onMounted(() => {
  AOS.init();
});
</script>

<template>
  <main class="pt-12">
    <HeroItem />

    <FeaturesItem />

    <StepsItem />

    <PartnersItem />

    <FaqItem />

    <section class="py-12">
      <h1 class="text-center font-bold text-2xl">Are you ready to join the block?</h1>

      <div class="grid place-content-center mt-5">
        <button @click="$router.push('/onboarding/signup')" class="btn">Join Ofriend</button>
      </div>
    </section>
  </main>
</template>
