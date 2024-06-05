<script setup>
import { onMounted } from 'vue'
import AOS from 'aos'
import HeroItem from '@/components/home/HeroItem.vue'
import FeaturesItem from '@/components/home/FeaturesItem.vue'
import StepsItem from '@/components/home/StepsItem.vue'
import PartnersItem from '@/components/home/PartnersItem.vue'
import FaqItem from '@/components/home/FaqItem.vue'
onMounted(() => {
  AOS.init()
})
</script>

<template>
  <main>
    <HeroItem />

    <FeaturesItem />

    <StepsItem />

    <PartnersItem />

    <FaqItem />
  </main>
</template>
