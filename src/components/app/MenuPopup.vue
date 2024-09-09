<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
//import { useDark } from '@vueuse/core';
import { useUserStore } from '@/stores/user';
import signout from '@/composables/server/signout';

const router = useRouter();
const userStore = useUserStore();
//const isDark = useDark();
const menu = ref();

const items = ref([
  {
    label: 'Menu',
    items: [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => router.push(`/app/profile/${userStore.user.id}`)
      },
      {
        label: 'Saved Posts',
        icon: 'pi pi-bookmark',
        command: () => router.push('/app/saved-posts')
      },
      {
        label: 'Products',
        icon: 'pi pi-briefcase',
        command: () => router.push('/app/products')
      },
      {
        label: 'Notifications',
        icon: 'pi pi-bell',
        command: () => router.push('/app/notifications')
      }/* ,
      {
        label: () => (isDark.value ? 'Dark Mode' : 'Light Mode'),
        icon: isDark.value ? 'pi pi-moon' : 'pi pi-sun',
        command: () => (isDark.value = !isDark.value)
      } */,
      {
        label: 'Sign out',
        icon: 'pi pi-sign-out',
        command: () => signout(router)
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
