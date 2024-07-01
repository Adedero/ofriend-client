<script setup>
import ProductsView from './ProductsView.vue';
</script>

<template>
  <Suspense>
    <template #default>
      <ProductsView />
    </template>

    <template #fallback>
      <PostDetailsSkeleton />
    </template>
  </Suspense>
</template>