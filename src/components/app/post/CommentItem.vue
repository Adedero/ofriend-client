<template>
  <div>
    <div class="flex gap-1">
      <Avatar shape="circle" class="flex-shrink-0" />

      <div>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-bold">John Smith</p>
            <p class="text-text-light text-sm">2 seconds ago</p>
          </div>

          <div class="text-small flex items-center gap-2">
            <Button size="small" rounded icon="pi pi-thumbs-up" severity="secondary" />
            <Button size="small" rounded icon="pi pi-comment" severity="secondary" />
          </div>
        </div>

        <div class="text-sm border rounded-lg p-1 md:p-2">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda, rem magnam at recusandae cum nam incidunt
          delectus ex quidem corrupti odit! Asperiores pariatur minus iure molestias, voluptatem nesciunt vitae?
          Aliquam.
        </div>

        <div class="cursor-context-menu flex items-center justify-end gap-2 text-sm font-medium">
          <p>2.5k Likes</p>
          <p>3.5k Replies</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>