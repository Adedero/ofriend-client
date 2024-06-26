<script setup>
import { computed, ref } from 'vue';
import { useGet, usePost } from '@/composables/utils/use-fetch';

const props = defineProps({ user: { type: Object, required: true } });

const visible = ref(false);

const loading = ref(false);

const subToAllLoaded = ref(false);
const subAllLoaded = ref(false);

const subscribedToUsers = ref([]);
const subscribers = ref([]);

const subscribedToUsersSize = computed(() => subscribedToUsers.value.length);
const subscribersSize = computed(() => subscribers.value.length);

const getSubs = async (type, array, skip, indicator) => {
  if (indicator) return;
  loading.value = true;
  try {
    const { data } = await useGet(`api/get-subcriptions/${ props.user._id }?skip=${ skip }&type=${ type }`);
    console.log(data.value);
    if (!data.value.length) {
      indicator = true;
      return;
    }
    array.push(...data.value);
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false
  }
}

const deleteSub = async (subId, userId, array, loader) => {
  loader = true;
  try {
    const { data } = await usePost(`api/delete-subscription/${subId}/${userId}`, {}, 'DELETE');
    if (data.value.success) {
      const filtered = array.filter(item => item.subId !== subId);
      array = filtered;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loader = false;
  } 
}

const getSubscribedTo = () => getSubs('subscribedTo', subscribedToUsers.value, subscribedToUsersSize.value, subToAllLoaded.value);

const getSubscribers = () => getSubs('subscribers', subscribers.value, subscribersSize.value, subAllLoaded.value);


</script>

<template>
  <div>
    <div>
      <p class="font-semibold">Subscriptions</p>
      <p>Subscriptions enable you to receive notifications from users you have subscribed to. <br> Unsubscribing from a
        user will not make you unfollow them. It will only stop you from getting pop up notifications when they post.
      </p>

      <Button @click="visible = true" label="Manage subscriptions" severity="secondary" class="mt-3" />
    </div>

    <Sidebar v-model:visible="visible" header="Subcriptions" position="bottom" class="h-dvh">
      <TabView lazy>
        <TabPanel header="Subscribed to">
          <p>People you have subscribed to and receive notifications from.</p>

          <div class="h-[calc(100dvh-12rem)] overflow-y-auto">
            <section>
              <div v-if="!loading" class="max-h-dvh overflow-y-auto flex flex-col gap-4">
                <div v-for="user in subscribedToUsers" :key="user.id"
                  class="flex-shrink-0 flex-wrap flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <DynamicAvatar shape="circle" :user class="w-[3.4rem] h-[3.4rem] flex-shrink-0" />
                    <p>{{ user.name }}</p>
                  </div>
                  <Button :loading="user.isDeleting"
                    @click="deleteSub(user.subId, user.id, subscribedToUsers, user.isDeleting)" label="Remove"
                    icon="pi pi-times" class="btn" />
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
            </section>

            <Button @click="getSubscribedTo" label="Load subscriptions" class="btn mt-3" />
          </div>
        </TabPanel>

        <TabPanel header="Subscribers">
          <p>People who have subscribed to you and receive notifications from you.</p>

          <div class="h-[calc(100dvh-12rem)] overflow-y-auto">
            <section>
              <div v-if="!loading" class="max-h-dvh overflow-y-auto flex flex-col gap-4">
                <div v-for="user in subscribers" :key="user.id"
                  class="flex-shrink-0 flex-wrap flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <DynamicAvatar shape="circle" :user class="w-[3.4rem] h-[3.4rem] flex-shrink-0" />
                    <p>{{ user.name }}</p>
                  </div>
                  <Button :loading="user.isDeleting"
                    @click="deleteSub(user.subId, user.id, subscribers, user.isDeleting)" label="Remove"
                    icon="pi pi-times" class="btn" />
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
            </section>

            <Button @click="getSubscribers" label="Load subscriptions" class="btn mt-3" />
          </div>
        </TabPanel>

      </TabView>

    </Sidebar>
  </div>
</template>