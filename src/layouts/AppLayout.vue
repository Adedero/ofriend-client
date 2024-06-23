<script setup>
import { onMounted } from "vue";
import { RouterView } from 'vue-router'
import socket from '@/config/socket.config';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

onMounted(() => socket.emit('online', userStore.user.id));
</script>
<template>
  <main class="px-2 pt-2 pb-5 lg:px-5">
    <AppHeader />

    <section class="relative h-[calc(100dvh-5.5rem)] pt-5 cs-2:grid cs-2:grid-cols-8 lg:grid-cols-12 xl:grid-cols-11">
      
      <nav class="hidden h-full overflow-y-auto cs-2:block lg:col-span-2 xl:col-span-2">
        <AppHomeNavbar />
      </nav>

      <section class=" h-full overflow-y-auto pb-12 cs-2:pb-0 cs-2:px-5 cs-2:col-span-6 lg:col-span-8 xl:col-span-7">
        <RouterView />
      </section>

      <aside class="hidden h-full max-w-full overflow-y-auto cs-2:block lg:col-span-2 xl:col-span-2">
        <Suspense>
          <template #default>
            <AppHomeAside />
          </template>
          <template #fallback>
            <AppHomeAsideSkeleton />
          </template>
        </Suspense>
      </aside>

      <div class="absolute w-full -bottom-3 cs-2:hidden">
        <MobileNavbar />
      </div>
    </section>
  </main>
</template>
