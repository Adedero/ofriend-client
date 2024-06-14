<script setup>
import { computed, ref, watch, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';
import { useGet } from '@/composables/utils/use-fetch';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});


const toast = useToast();

const followers = ref([]);
const length = computed(() => followers.value.length);

const res = ref({});
const loading = ref(false);
const allLoaded = ref(false);

const getUserFollowers = async () => {
  if (loading.value || allLoaded.value) return;
  loading.value = true;
  try {
    res.value = await useGet(`api/get-user-follows/${props.user._id}/${length.value}/followers`);
    const userFollowers = res.value.data;
    //console.log(userFollowers);
    if (userFollowers.length > 0) {
      followers.value.push(...userFollowers);
      return;
    }
    allLoaded.value = true;
  } catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: 'Error', detail: error.message });
  } finally {
    loading.value = false;
  }
}

const onScroll = async (event) => {
  const container = event.target;
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
    await getUserFollowers()
  }
}

watch(() => props.user._id, () => followers.value = []);
watchEffect( async () => await getUserFollowers());

</script>

<template>
  <Toast class="max-w-96" />
  <div v-if="followers.length" @scroll="onScroll" class="lg:w-full flex flex-col gap-4 h-[calc(100dvh-17rem)] overflow-y-auto">
    <SearchFollowing :user-id="user._id" search="followers" />

    <div v-for="follower in followers" :key="follower.id" class="w-full flex-shrink-0 hover:bg-accent/10">
      <RouterLink :to="{ name: 'user-profile', params: { userId: follower.id } }" class="flex items-center gap-2 p-1">
        <DynamicAvatar shape="circle" :user="follower" size="small" class="w-10 h-10 flex-shrink-0" />
        <p class="text-sm font-semibold">{{ follower.name }}</p>
      </RouterLink>
    </div>


    <div v-if="loading" class="mt-5 grid gap-3 lg:w-full">
      <div v-for="i in 3" :key="i" class="flex items-center gap-2">
        <Skeleton shape="circle" width="3rem" height="3rem" />
        <Skeleton width="5rem" height="1.5rem" />
      </div>
    </div>

  </div>
  <div v-else class="grid gap-3 place-content-center">
    <img src="../../../assets/images/no-followers.jpg" alt="no followers" class="max-w-60 rounded-full">
    <p class="font-semibold text-center">No followers yet!</p>
  </div>
</template>