<script setup>
import { useDark } from '@vueuse/core'
const isDark = useDark()
</script>
<template>
  <input type="checkbox" v-model="isDark" id="dark-toggler" class="hidden" />
  <label
    for="dark-toggler"
    class="p-2 bg-soft-gray-2 rounded-full grid place-content-center cursor-pointer"
  >
    <span :class="isDark ? 'pi pi-moon' : 'pi pi-sun'"></span>
  </label>
  <!--  <input v-model="isDark" type="checkbox"
    class="appearance-none cursor-pointer bg-soft-gray w-10 h-5 rounded-full checked:bg-accent relative checked:before:transition-transform before:absolute before:content-[''] before:rounded-full before:w-3.5 before:aspect-square before:bg-primary before:left-1 before:top-[3px] checked:before:bg-white checked:before:translate-x-[1.1rem] transition-colors"> -->
</template>
