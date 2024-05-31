<script setup>
import { RouterView } from 'vue-router';
import IndexHeader from '@/components/headers/IndexHeader.vue';
import IndexFooter from '@/components/footers/IndexFooter.vue';
</script>

<template>
  <main class="relative">
    <IndexHeader />

    <RouterView />

    <IndexFooter />
  </main>
</template>


<style>

</style>

