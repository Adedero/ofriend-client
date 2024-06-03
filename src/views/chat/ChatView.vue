<template>
  <main class="p-2 lg:px-10">
    <AppHeader />

    <section class="mt-4 h-[calc(100dvh-6rem)] border border-primary rounded-lg flex">
      <div class="h-full p-3 border-r border-primary w-[30%] xl:w-[25%]">
        <header class="pb-3 border-b border-primary flex items-center justify-between">
          <h1 class="font-bold text-lg">Messages</h1>
          <Button @click="$router.push('/app')" severity="secondary" text icon="pi pi-angle-left" label="Home" size="small" class="p-2" />
        </header>

        <ChatList />
      </div>

      <div class="flex-grow">
        <ChatBox />
      </div>
    </section>
  </main>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>