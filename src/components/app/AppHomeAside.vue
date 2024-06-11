<script setup>
import { watchEffect } from 'vue';
import { useGet } from '@/composables/utils/use-fetch';
const { data } = await useGet('api/followers-and-following');
//Get followers and following
watchEffect(() => console.log(data.value))
</script>

<template>
  <aside class="grid gap-3">
    <div class="followers flex-shrink-0 flex flex-col items-center lg:items-start">
      <h1 class="text-center font-bold lg:text-left">Followers</h1>

      <div class="mt-5 grid gap-3 lg:w-full">
        <div v-for="follower in data.followers" :key="follower._id" class="flex items-center gap-2 min-w-0">

          <DynamicAvatar :user="follower.user" shape="circle" size="large" class="flex-shrink-0" />
          <div class="hidden overflow-x-hidden lg:block">
            <p class="font-medium">{{ follower.user.name }}</p>
            <p class="text-xs  truncate">{{ follower.user.bio }}</p>
          </div>
        </div>

        <div v-if="!data.followers.length">
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
        <div v-for="follower in data.following" :key="follower._id" class="flex items-center gap-2 min-w-0">

          <DynamicAvatar :user="follower.user" shape="circle" size="large" class="flex-shrink-0" />
          <div class="hidden overflow-x-hidden lg:block">
            <p class="font-medium">{{ follower.user.name }}</p>
            <p class="text-xs  truncate">{{ follower.user.bio }}</p>
          </div>
        </div>

        <div v-if="!data.following.length">
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
