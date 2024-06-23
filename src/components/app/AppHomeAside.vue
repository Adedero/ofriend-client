<script setup>
import { useGet } from '@/composables/utils/use-fetch';
const { data } = await useGet('api/followers-and-following');
</script>

<template>
  <aside class="grid gap-3">
    <div class="followers flex-shrink-0 flex flex-col items-center lg:items-start">
      <h1 class="text-center font-bold lg:text-left">Followers</h1>

      <div class="mt-5 grid gap-3 lg:w-full">
        <div v-if="data.followers && data.followers.length">
          <div v-for="follower in data.followers" :key="follower._id" class="grid grid-cols-7 xl:grid-cols-10 items-center">

            <DynamicAvatar :user="follower.follower" shape="circle" class="w-10 h-10 col-span-2" />
            <div class="hidden overflow-x-hidden lg:block col-span-5 xl:col-span-8">
              <p class="font-medium">{{ follower.follower.name }}</p>
              <p class="text-xs max-w-full truncate">{{ follower.follower.bio }}</p>
            </div>
          </div>
        </div>

        <div v-else>
          <div class="text-slate-400 text-6xl lg:hidden">0</div>
          <div class="hidden lg:grid gap-3 text-sm text-slate-500 p-1">
            <img src="../../assets/images/no-following.svg" alt="no followers">
            <p class="text-center">No one follows you at the moment.</p>
            <p class="text-center font-semibold">Post more interesting stuff to attract followers!</p>
          </div>
        </div>

        <div v-if="data.followers.length > 3" class="grid gap-3">
          <Button icon="pi pi-angle-right" size="large" rounded outlined class="lg:hidden" />
          <Button label="Show All" outlined class="hidden lg:flex" />
        </div>
      </div>
    </div>

    <Divider />

    <div class="following flex-shrink-0 flex flex-col items-center lg:items-start">
      <h1 class="text-center font-bold lg:text-left">Following</h1>

      <div class="mt-5 grid gap-3 lg:w-full">
        <div v-if="data.following && data.following.length">
          <div v-for="follower in data.following" :key="follower._id" class="grid grid-cols-7 xl:grid-cols-10 items-center">

            <DynamicAvatar :user="follower.user" shape="circle" size="large" class="h-10 w-10 col-span-2" />
            <div class="hidden overflow-x-hidden lg:block col-span-5 xl:col-span-8">
              <p class="font-medium">{{ follower.user.name }}</p>
              <p class="text-xs  truncate">{{ follower.user.bio }}</p>
            </div>
          </div>
        </div>

        <div v-else>
          <div class="text-slate-400 text-6xl lg:hidden">0</div>
          <div class="hidden lg:grid gap-3 text-sm text-slate-500 p-1">
            <img src="../../assets/images/no-followers.jpg" alt="no followers">
            <p class="text-center">You're not following anyone at the moment.</p>
            <p class="text-center font-semibold">Search for interesting profiles to follow!</p>
          </div>
        </div>

        <div v-if="data.following.length > 3" class="grid gap-3">
          <Button icon="pi pi-angle-right" size="large" rounded outlined class="lg:hidden" />
          <Button label="Show All" outlined class="hidden lg:flex" />
        </div>
      </div>
    </div>
  </aside>
</template>
