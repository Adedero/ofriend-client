<script setup>
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
</script>

<template>
  <button type="button" class="p-3 rounded-full bg-soft-gray-2 grid place-content-center md:hidden">
    <span class="pi pi-search" style="font-size: 1.1rem"></span>
  </button>

  <div class="hidden md:block">
    <IconField iconPosition="left">
      <InputIcon class="pi pi-search"> </InputIcon>
      <InputText
        placeholder="Search"
        class="border-transparent bg-soft-gray-2 dark:bg-primary-lighter focus:bg-transparent"
      />
    </IconField>
  </div>
</template>
