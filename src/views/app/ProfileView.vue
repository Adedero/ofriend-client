<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGet } from '@/composables/utils/use-fetch';
import { formatNumber } from '@/composables/utils/formats';
const route = useRoute();
const router = useRouter();

const user = ref(null);
const getUserProfile = async (id) => {
  try {
    const { status, data, error } = await useGet(`api/get-user-profile/${id}`);
    //console.log(data.value);
    if (error.value) return router.push('/500');
    if (status.value === 401 && data.value.authMessage) return router.push({ name: 'signin' });
    if (status.value !== 200) return router.push('/404');
    user.value = data.value;
  } catch (error) {
    console.log(error);
    router.push('/500');
  }
}

//Update bio when changed
const setBio = (data) => user.value.bio = data;

//Update profile picture
const setImageUrl = (data) => user.value.imageUrl = data;

//Update banner image Url
const setBannerImageUrl = (data) => user.value.bannerImageUrl = data;

const handleFollowToggle = (data) => {
  data ? user.value.followers++ : user.value.followers--
  user.value.viewerFollowsUser = data;
}

watchEffect(async () => await getUserProfile(route.params.userId));

</script>


<template>
  <div v-if="user">
    <div id="banner" class="relative">
      <ProfileBanner :isViewingSelf="user.isViewingSelf" :bannerImageUrl="user.bannerImageUrl ?? ''"
        @onBannerImageChange="setBannerImageUrl" />
      <div v-if="!user.isViewingSelf" class="flex items-center gap-2 justify-end absolute z-10 right-0">
        <UserFollowButton :user @onFollowToggle="handleFollowToggle" />
        <UserSubscribeButton v-show="user.viewerFollowsUser" :user />
      </div>
    </div>

    <section class="grid gap-x-3 lg:grid-cols-5 mt-1">
      <div class="w-full relative lg:col-span-2">
        <div class="flex flex-col lg:items-center -mt-16 lg:absolute lg:w-full -top-20 lg:-mt-0 lg:-top-20 xl:-top-28">
          <div class="w-28 md:w-32 lg:w-[50%]">
            <UserProfileImage :user @onProfilePictureChange="setImageUrl" />
          </div>

          <h1 class="font-bold text-lg">{{ user.name }}</h1>
          <div class="flex items-center gap-2 text-sm">
            <p>Followers: <span class="font-semibold">{{ formatNumber(user.followers) }}</span></p>
            <p class="w-1.5 aspect-square bg-text-dark rounded-full"></p>
            <p>Following: <span class="font-semibold">{{ formatNumber(user.following) }}</span></p>
          </div>

          <div v-if="!user.isViewingSelf">
            <MessageUserButton :user />
          </div>

          <div class="p-2 border rounded-lg mt-3 w-full">
            <ProfileDetails :user />
          </div>

          <div class="p-2 border rounded-lg mt-3 w-full">
            <UserBio :user @on-bio-updated="setBio" />
          </div>
        </div>
      </div>


      <div class="lg:col-span-3">
        <TabView :lazy="true" scrollable class="mt-5 mb-4 lg:mt-16 h-[calc(100dvh-10rem)]">
          <TabPanel header="Posts">
            <UserPosts :userId="user._id" :isViewingSelf="user.isViewingSelf" />
          </TabPanel>

          <TabPanel header="Gallery">
            <UserGallery :userId="user._id" />
          </TabPanel>

          <TabPanel header="Followers">
            <UserFollowers :user />
          </TabPanel>

          <TabPanel header="Following">
            <UserFollowing :user />
          </TabPanel>
        </TabView>
      </div>
    </section>
  </div>

  <div v-else class="relative">
    <Skeleton height="12rem" width="100%" />
    <div class="grid gap-3 lg:grid-cols-5 mt-3">
      <div class="grid content-start gap-3 lg:col-span-2">
        <Skeleton shape="circle" width="8rem" height="8rem"
          class="absolute translate-x-2 border-[5px] border-white -mt-20 left-0 lg:mx-auto lg:-mt-0 lg:translate-x-0" />
        <Skeleton width="50%" height="2rem" class="lg:hidden" />
        <Skeleton width="50%" height="2rem" class="lg:hidden" />
        <Skeleton width="100%" height="3.5rem" class="hidden lg:block" />
        <Skeleton width="100%" height="3.5rem" class="hidden lg:block" />
      </div>
      <div class="lg:col-span-3 grid grid-cols-4 gap-3 mt-2">
        <Skeleton v-for="i in 4" :key="i" height="1.5rem" />
        <Skeleton width="100%" height="20rem" class="col-span-4" />
      </div>
    </div>
  </div>
</template>
