<script setup>
import EditProfileContent from './EditProfileContent.vue';
</script>

<template>
  <Suspense>
    <template #default>
      <EditProfileContent />
    </template>

    <template #fallback>
      <div>
        <div v-for="i in 3" :key="i" class="mb-6">
          <div class="flex items-center gap-3">
            <Skeleton width="6rem" height="1.5rem" />
            <Skeleton shape="circle" height="2.5rem" width="2.5rem" />
          </div>
          <Skeleton width="100%" height="2.5rem" class="mt-1" />
        </div>
      </div>
    </template>
  </Suspense>
</template>