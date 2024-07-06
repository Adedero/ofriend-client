<script setup>
import { ref, watchEffect } from 'vue';

const showInput = ref(false);
const input = ref(null);
const visible = ref(false);
const text = ref('');

watchEffect(() => text.value ? visible.value = true: visible.value = false);

watchEffect(() => {
  if (!visible.value) text.value = ''
});

watchEffect(() => {
  if (!visible.value) showInput.value = false;
});



</script>

<template>
  <div class="relative">
    <button v-show="!showInput"  @click="showInput = true" type="button"
      class="p-3 rounded-full bg-soft-gray-2 grid place-content-center md:hidden">
      <span class="pi pi-search" style="font-size: 1.1rem"></span>
    </button>

    <div v-show="showInput" class="fixed bg-accent/50 p-2 left-0 top-0 w-dvw md:hidden">
      <div class="w-full flex gap-2 relative">

        <div class="relative w-full">
          <label for="search" class="cursor-context-menu absolute left-[0.8rem] top-[0.65rem] text-slate-400">
            <span class="pi pi-search"></span>
          </label>
          <input ref="input" v-model.trim="text" type="search" id="search" placeholder="Search"
            class="outline-none w-full border border-transparent focus:border-primary rounded-md py-2 pl-10 pr-3 transition-all text-slate-700">
        </div>

       <!--  <IconField iconPosition="left" class="w-full hidden">
          <InputIcon class="pi pi-search"> </InputIcon>
          <InputText v-model.trim="text" placeholder="Search" type="search"
            class="w-full border-transparent dark:bg-primary-lighter focus:bg-white" />
        </IconField> -->

        <Button v-show="showInput && !text" @click="showInput = false" icon="pi pi-times" size="small"
          class="btn absolute h-8 w-8 top-[0.3rem] right-[0.3rem]" />
      </div>

    </div>



    <div class="hidden md:block">
      <IconField iconPosition="left">
        <InputIcon class="pi pi-search"> </InputIcon>
        <InputText v-model.trim="text" placeholder="Search" type="search"
          class="border-transparent bg-soft-gray-2 dark:bg-primary-lighter focus:bg-transparent" />
      </IconField>
    </div>

    <div
      class="search-panel overflow-hidden z-20  bg-white fixed top-16 left-0 h-0 w-dvw md:absolute md:top-12 md:left-0 md:w-[75dvw] md:rounded-md md:shadow-md"
      :class="{ 'show': visible }">
      <div class="w-full h-full py-4 px-6">
        <h1 class="text-lg font-bold">Results</h1>
        <p>Showing results for '<span class="font-medium">{{ text }}</span>'</p>

        <TabView :lazy="true" scrollable>
          <TabPanel header="People">
            <UsersSearchResultItem v-if="visible" :searchText="text" @onUserClick="visible = false" />
          </TabPanel>

          <TabPanel header="Posts">
            <SearchResultItem v-if="visible" item="post" :searchText="text" @onPostClick="visible = false" />
          </TabPanel>

          <TabPanel header="Products">
            <SearchResultItem v-if="visible" item="product" :searchText="text" @onPostClick="visible = false" />
          </TabPanel>
        </TabView>
      </div>
    </div>
    <div
      class="overlay fixed hidden md:block left-0 w-dvw h-dvh overflow-hidden bg-opacity-50 bg-black backdrop-blur-sm"
      :class="{ 'show': visible }"></div>
  </div>
</template>

<style scoped>
.search-panel {
  transition: height 0.3s ease-in-out
}
.search-panel.show {
  @apply h-[calc(100dvh-5rem)];
}

.overlay {
  transition: opacity 0.3s;
  z-index: -100; 
  opacity: 0;
}

.overlay.show {
  @apply z-10 opacity-100;
}
</style>
