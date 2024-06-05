<script setup>
import { ref } from 'vue'
import { useDark } from '@vueuse/core'
import Menu from 'primevue/menu'
const isDark = useDark()
const menu = ref()
const items = ref([
  {
    label: 'Menu',
    items: [
      {
        label: 'Profile',
        icon: 'pi pi-user'
      },
      {
        label: 'Notifications',
        icon: 'pi pi-bell'
      },
      {
        label: () => (isDark.value ? 'Dark Mode' : 'Light Mode'),
        icon: isDark.value ? 'pi pi-moon' : 'pi pi-sun',
        command: () => (isDark.value = !isDark.value)
      },
      {
        label: 'Sign out',
        icon: 'pi pi-sign-out'
      }
    ]
  }
])

const toggle = (event) => {
  menu.value.toggle(event)
}
</script>

<template>
  <div class="flex justify-center">
    <button
      @click="toggle"
      type="button"
      class="p-2 rounded hover:bg-soft-gray-2 grid place-content-center"
    >
      <span class="pi pi-ellipsis-v" style="font-size: 1.1rem"></span>
    </button>
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
  </div>
</template>
