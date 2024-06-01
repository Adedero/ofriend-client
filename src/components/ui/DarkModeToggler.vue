<script setup>
import { useDark } from '@vueuse/core';
const isDark = useDark();
</script>
<template>
  <input v-model="isDark" type="checkbox"
    class="appearance-none cursor-pointer bg-soft-gray w-10 h-5 rounded-full checked:bg-accent relative checked:before:transition-transform before:absolute before:content-[''] before:rounded-full before:w-3.5 before:aspect-square before:bg-primary before:left-1 before:top-[3px] checked:before:bg-white checked:before:translate-x-[1.1rem] transition-colors">
</template>