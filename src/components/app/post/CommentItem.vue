<template>
  <div>
    <div class="flex gap-1">
      <Avatar shape="circle" class="flex-shrink-0" />

      <div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <p class="font-bold">John Smith</p>
            <p class="text-text-light text-sm">2 s</p>
          </div>

          <div class="text-small flex items-center gap-2">
            <Button label="65" size="small" rounded icon="pi pi-thumbs-up" severity="secondary" />
          </div>
        </div>

        <div class="mt-1 text-sm border rounded-lg p-1 md:p-2">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda, rem magnam at
          recusandae cum nam incidunt delectus ex quidem corrupti odit! Asperiores pariatur minus
          iure molestias, voluptatem nesciunt vitae? Aliquam.
        </div>

        <div
          class="mt-1 cursor-context-menu flex items-center justify-between gap-2 text-sm font-medium"
        >
          <Button label="21 replies" size="small" rounded severity="secondary" />

          <button>Reply</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
