<script setup>

</script>

<template>
  <div class="mt-3">
    <Skeleton height="2.5rem" width="100%" />
    <div class="flex flex-col gap-3 mt-5">
      <div v-for="i in 4" :key="i" class="flex-shrink-0 flex gap-3 items-center">
        <Skeleton shape="circle" height="3.5rem" width="3.5rem"/>
        <div class="flex-grow grid gap-2">
          <Skeleton height="1.5rem"/>
          <Skeleton height="0.8rem" width="70%"/>
        </div>
      </div>
    </div>
  </div>
</template>
