<template>
  <section class="mt-2 h-[calc(100dvh-8rem)]">
    <div class="h-full">
      <header class=" border-b border-primary flex items-center justify-between">
        <h1 class="font-bold text-lg">Messages</h1>
        <Button @click="$router.push('/app')" severity="secondary" text icon="pi pi-angle-left" label="Home"
          size="small" class="p-2" />
      </header>

      <ChatList />
    </div>

    <!-- <div ref="convoBox" class="flex-grow overflow-y-scroll">
        <ChatBox />
        <NewChat />
      </div> -->
  </section>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>

</style>