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
    console.log(data.value);
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

watchEffect(async () => await getUserProfile(route.params.userId));

</script>


<template>
  <div v-if="user">
    <div id="banner" class="relative">
      <ProfileBanner :isViewingSelf="user.isViewingSelf" :bannerImageUrl="user.bannerImageUrl ?? ''"
        @onBannerImageChange="setBannerImageUrl" />
      <div v-if="!user.isViewingSelf" class="grid justify-end absolute right-0">
        <UserFollowButton :user />
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

          <div class="p-2 border rounded-lg mt-3 w-full">
            <ProfileDetails :user />
          </div>

          <div class="p-2 border rounded-lg mt-3 w-full">
            <UserBio :user @on-bio-updated="setBio" />
          </div>
        </div>
      </div>


      <div class="lg:col-span-3">
        <TabView :lazy="true" class="mt-16 h-full">
          <TabPanel header="Posts">
            <UserPosts />
          </TabPanel>
          <TabPanel header="Gallery">

          </TabPanel>
          <TabPanel header="Followers">

          </TabPanel>
          <TabPanel header="Following">

          </TabPanel>
        </TabView>
      </div>
    </section>
  </div>

  <div v-else>
    <Skeleton height="14rem" width="100%" />
    <div class="grid gap-3 lg:grid-cols-5 mt-3">
      <div class="lg:col-span-2">
        <Skeleton width="100%" height="16rem" />
      </div>
      <div class="lg:col-span-3">
        <Skeleton width="100%" height="30rem" />
      </div>
    </div>
  </div>
</template>
