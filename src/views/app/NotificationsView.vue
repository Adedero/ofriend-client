<script setup>

</script>

<template>
  <div>
    <h1 class="font-semibold text-xl">Notifications</h1>

    <Suspense>
      <template #default>
        <NotificationsList />
      </template>

      <template #fallback>
        <div class="grid gap-5">
          <div v-for="i in 3" :key="i" class="flex items-center gap-2">
            <Skeleton shape="circle" width="5rem" height="5rem" class="flex-shrink-0" />
            <div class="grid gap-2">
              <Skeleton height="1.2rem" width="8rem" />
              <Skeleton height="3rem" width="18rem" />
            </div>
          </div>
        </div>
      </template>
    </Suspense>
  </div>
</template>
