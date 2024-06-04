<template>
  <div class="relative mt-3 h-[calc(100%-4rem)] overflow-y-auto">
    <div class="sticky top-0 bg-white z-10 pb-3">
      <IconField iconPosition="left">
        <InputIcon class="pi pi-search"> </InputIcon>
        <InputText placeholder="Search..." class="w-full border-transparent bg-soft-gray-2 focus:bg-white" />
      </IconField>
    </div>

    <div class="flex flex-col gap-3 mt-5">

      <div v-for="i in 10" :key="i"
        @click="$router.push('/m/chat/private-chat')"
        class="text-sm cursor-pointer hover:bg-accent/5 flex-shrink-0 p-2 rounded flex items-center gap-2 w-full relative before:absolute before:content-[''] before:left-0 before:h-full before:w-1 before:bg-accent">

        <Avatar label="U" shape="circle" size="large" class="flex-shrink-0" />
        
        <div class="flex-grow overflow-hidden">
          <div class="w-full flex items-end justify-between">
            <h3 class="font-semibold">John Smith</h3>
            <small>10:50 PM</small>
          </div>

          <div class="flex items-center justify-between">
            <p class="truncate text-text-light">Lorem ipsum dolor sit amet consectetur adipisicing elit!</p>
            <Badge value="2" class="bg-accent" />
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped></style>