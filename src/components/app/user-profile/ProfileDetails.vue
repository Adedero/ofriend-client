<script setup>
import { formatDate } from '@/composables/utils/formats';
defineProps({
  user: {
    type: Object,
    required: true
  }
})

</script>

<template>
  <Button v-if="user.isViewingSelf" @click="$router.push({ name: 'edit-profile' })" label="Edit profile"
    severity="secondary" icon="pi pi-pencil" icon-pos="right" class="mb-2 flex justify-between px-2 text-left w-full" />

  <div class="text-sm grid gap-2">
    <p class="flex items-center gap-2 px-2">
      <span class="pi pi-map-marker"></span>
      <span>{{ user.region }}, {{ user.country }}</span>
    </p>
    <p class="flex items-center gap-2 px-2">
      <span class="pi pi-clock"></span>
      <span>Joined {{ formatDate(user.createdAt) }}</span>
    </p>
  </div>
</template>