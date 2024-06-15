<script setup>
import { ref } from 'vue';
import Sidebar from 'primevue/sidebar';

const visible = ref(false);
</script>

<template>
  <div>
    <div class="flex items-center gap-3">
      <p class="font-semibold">Blocked Users</p>
      <Button label="View blocked users" severity="secondary" />
    </div>

    <Sidebar v-model:visible="visible" position="bottom"></Sidebar>
  </div>
</template>