<script setup>
import { RouterView } from 'vue-router';
import IndexHeader from '@/components/headers/IndexHeader.vue';
import IndexFooter from '@/components/footers/IndexFooter.vue';
import JoinOfriend from '@/components/footers/JoinOfriend.vue';

</script>

<template>
  <main class="relative overflow-x-clip">
    <IndexHeader />

    <RouterView />

    <JoinOfriend />
    
    <IndexFooter />
  </main>
</template>

