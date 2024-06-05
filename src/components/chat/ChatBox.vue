<script setup>
import { ref } from 'vue'

const menu = ref()
const items = ref([
  {
    label: 'Options',
    items: [
      {
        label: 'Refresh',
        icon: 'pi pi-refresh'
      },
      {
        label: 'Export',
        icon: 'pi pi-upload'
      }
    ]
  }
])

const toggle = (event) => {
  menu.value.toggle(event)
}
</script>

<template>
  <header
    class="sticky top-0 bg-white p-3 h-16 border-b border-primary flex items-center justify-between"
  >
    <div>
      <h3 class="font-medium">John Smith</h3>
      <p class="text-sm truncate max-w-96 text-text-light">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p>
    </div>
    <Button @click="toggle" text icon="pi pi-ellipsis-h" />
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
  </header>

  <section>
    <div id="conversation" class="p-3">
      <header class="flex gap-2 items-center justify-between">
        <hr class="border-primary/50 w-1/2" />
        <p class="text-sm text-primary/60 font-semibold">Today</p>
        <hr class="border-primary/50 w-1/2" />
      </header>

      <div id="chat-body" class="grid gap-2 cs-2:gap-1">
        <ChatBlob user="sender" />
        <ChatBlob user="receiver" />

        <ChatBlob user="sender" />

        <ChatBlob user="sender" seen />
        <ChatBlob user="sender" seen />
        <ChatBlob user="receiver" />
        <ChatBlob user="receiver" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
