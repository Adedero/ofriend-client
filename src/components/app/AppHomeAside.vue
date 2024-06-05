<template>
  <aside class="grid gap-3">
    <div class="followers flex-shrink-0 flex flex-col items-center lg:items-start">
      <h1 class="text-center font-bold lg:text-left">Followers</h1>

      <div class="mt-5 grid gap-3 lg:w-full">
        <div v-for="i in 3" :key="i" class="flex items-center gap-2">
          <Avatar
            image="https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png"
            shape="circle"
            size="large"
          />
          <div class="hidden lg:block">
            <p class="font-medium">John Smith</p>
            <p class="text-xs">UI/UX Designer</p>
          </div>
        </div>

        <Button icon="pi pi-angle-right" size="large" rounded outlined class="lg:hidden" />
        <Button label="Show All" outlined class="hidden lg:flex" />
      </div>
    </div>

    <Divider />

    <div class="following flex-shrink-0 flex flex-col items-center lg:items-start">
      <h1 class="text-center font-bold lg:text-left">Following</h1>

      <div class="mt-5 grid gap-3 lg:w-full">
        <div v-for="i in 3" :key="i" class="flex items-center gap-2">
          <Avatar
            image="https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png"
            shape="circle"
            size="large"
          />
          <div class="hidden lg:block">
            <p class="font-medium">John Smith</p>
            <p class="text-xs">UI/UX Designer</p>
          </div>
        </div>

        <Button icon="pi pi-angle-right" size="large" rounded outlined class="lg:hidden" />
        <Button label="Show All" outlined class="hidden lg:flex" />
      </div>
    </div>
  </aside>
</template>

<script setup></script>

<style lang="scss" scoped></style>
