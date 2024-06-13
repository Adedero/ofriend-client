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

const following = ref([]);
const length = computed(() => following.value.length);

const res = ref({});
const loading = ref(false);
const allLoaded = ref(false);

const getUserFollowing = async () => {
  if (loading.value || allLoaded.value) return;
  loading.value = true;
  try {
    res.value = await useGet(`api/get-user-follows/${props.user._id}/${length.value}/following`);
    const userFollowing = res.value.data;
    //console.log(userFollowing);
    if (userFollowing.length > 0) {
      following.value.push(...userFollowing);
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
    await getUserFollowing()
  }
}
watch(() => props.user._id, () => following.value = []);
watchEffect(async () => await getUserFollowing());

</script>

<template>
  <Toast class="max-w-96" />
  <div v-if="following.length" @scroll="onScroll"
    class="lg:w-full flex flex-col gap-4 h-[calc(100dvh-17rem)] overflow-y-auto">

    <div v-for="user in following" :key="user.id" class="w-full flex-shrink-0 hover:bg-accent/10">
      <RouterLink :to="{ name: 'user-profile', params: { userId: user.id } }" class="flex items-center gap-2">
        <DynamicAvatar shape="circle" :user="user" size="small" class="w-10 h-10 flex-shrink-0" />
        <p class="text-sm font-semibold">{{ user.name }}</p>
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
    <img src="../../../assets/images/no-following.svg" alt="no followers" class="max-w-60 rounded-full">
    <p class="font-semibold text-center">No followers yet!</p>
  </div>
</template>