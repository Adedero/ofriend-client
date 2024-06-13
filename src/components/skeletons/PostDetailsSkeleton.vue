<template>
  <div class="p-2 h-[80dvh] flex flex-col">
    <div class="flex items-center gap-2">
      <Skeleton shape="circle" width="4rem" height="4rem" class="flex-shrink-0" />
      <div class="grid gap-2 items-start">
        <Skeleton height="2rem" width="10rem" />
        <Skeleton width="4rem" />
      </div>
    </div>
    <div class="mt-4 flex flex-col gap-3 items-start flex-grow">
      <Skeleton height="2rem" width="100%" />
      <Skeleton width="80%" />
      <Skeleton width="60%" />
      <Skeleton width="100%" height="20rem" class="mt-3 flex-grow" />
    </div>
  </div>
</template>