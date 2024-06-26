<script setup>
import { computed, ref } from 'vue';
import { useGet, usePost } from '@/composables/utils/use-fetch';
defineProps({ user: { type: Object, required: true } });

const visible = ref(false);

const loading = ref(false);
const blockedUsers = ref([]);

const blockedUsersSize = computed(() => blockedUsers.value.length);

const getBlockedUsers = async () => {
  visible.value = true
  loading.value = true;
  try {
    const { data } = await useGet(`api/view-blocked-users?skip=${blockedUsersSize.value}`);
    //console.log(data.value);
    blockedUsers.value.push(...data.value);
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false
  }
}

const unblockLoading = ref(false);
const unblockUser = async (blockId, userId) => {
  unblockLoading.value = true;
  try {
    const { data } = await usePost(`api/unblock-user/${blockId}`);
    if (data.value.success) {
      blockedUsers.value = blockedUsers.value.filter(user => user.id !== userId);
    }
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
    unblockLoading.value = false;
  }
}

const handleScroll = async (event) => {
  const container = event.target;
  const { scrollHeight, scrollTop, clientHeight } = container;
  if (scrollTop + clientHeight >= scrollHeight - 20) {
    const scrollPositionFromBottom = scrollHeight - scrollTop;

    await getBlockedUsers();

    const newScrollHeight = container.scrollHeight;
    container.scrollTop = newScrollHeight - scrollPositionFromBottom;
  }
};

</script>

<template>
  <div>
    <div class="flex items-center gap-3">
      <p class="font-semibold">Blocked Users</p>
      <Button @click="getBlockedUsers" label="View blocked users" severity="secondary" />
    </div>

    <Sidebar v-model:visible="visible" header="Blocked users" position="bottom" class="h-dvh">
      <div v-if="!loading" @scroll="handleScroll" class="max-h-dvh overflow-y-auto flex flex-col gap-4">
        <div v-for="user in blockedUsers" :key="user.id" class="flex-shrink-0 flex-wrap flex items-center justify-between">
          <div class="flex items-center gap-3">
            <DynamicAvatar shape="circle" :user class="w-[3.4rem] h-[3.4rem] flex-shrink-0" />
            <p>{{ user.name }}</p>
          </div>
          <Button :loading="unblockLoading" @click="unblockUser(user.blockId, user.id)" label="Unblock" icon="pi pi-times" class="btn" />
          <Divider />
        </div>
      </div>

      <div v-else class="grid gap-4">
        <div v-for="i in 3" :key="i" class="w-full flex items-center gap-3">
          <Skeleton shape="circle" width="3.4rem" height="3.4rem" class="flex-shrink-0" />
          <Skeleton width="50%" height="2rem" />
          <Skeleton width="10rem" height="2.5rem" class="justify-self-end" />
        </div>
      </div>
    </Sidebar>
  </div>
</template>