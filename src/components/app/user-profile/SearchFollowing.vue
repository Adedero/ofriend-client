<script setup>
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import Toast from 'primevue/toast';
import { useToastError } from '@/composables/utils/add-toast';
import { useToast } from 'primevue/usetoast';
import { useGet } from '@/composables/utils/use-fetch';

const toast = useToast();

const props = defineProps({
  userId: {
    type: String,
    required: true
  },
  search: {
    type: String,
    required: true
  }
})

const input = ref('');

const isSearching = ref(false);
const allLoaded = ref(false);
const loading = ref(false);

const results = ref([]);
const skip = computed(() => results.value.length)

const searchUser = async (isNewSearch) => {
  if (!input.value) return;
  if (loading.value || allLoaded.value) return;
  isSearching.value = true;
  loading.value = true;
  isNewSearch ? results.value = [] : results.value;
  try {
    const { data } = await useGet(`api/search-following?userId=${props.userId}&search=${input.value.trim()}&type=${props.search}&skip=${skip.value}`);
    if (!data.value.length) {
      allLoaded.value = true;
      return
    }

    results.value.push(...data.value);
  } catch (error) {
    console.error(error);
    useToastError(toast, error);
  } finally {
    loading.value = false;
  }
};

const cancelSearch = () => {
  input.value = '';
  results.value = [];
  isSearching.value = false;
  allLoaded.value = true;
  loading.value = false;
};

const onScroll = async (event) => {
  const container = event.target;
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
    await searchUser(false);
  }
}

</script>

<template>
  <div>
    <Toast class="max-w-96" />
    <InputGroup>
      <InputGroupAddon>
        <i class="pi pi-search"></i>
      </InputGroupAddon>
      <InputText @search="searchUser(true)" @change="allLoaded = false" type="search" v-model="input" placeholder="Search name" />
    </InputGroup>

    <div v-if="isSearching" class="mt-2 border-b pb-2">
      <div class="flex items-center justify-between">
        <p class="text-sm font-semibold">Search results</p>
        <Button @click="cancelSearch" rounded icon="pi pi-times-circle" text severity="danger" class="h-8 w-8" />
      </div>

      <Divider />
      <div v-if="results.length" @scroll="onScroll" id="results"
        class="flex flex-col gap-3 max-h-[32rem] overflow-y-auto">

        <div v-for="follow in results" :key="follow._id" class="w-full flex-shrink-0 hover:bg-accent/10">
          <RouterLink v-if="search === 'followers'"
            :to="{ name: 'user-profile', params: { userId: follow.follower._id } }" class="flex items-center gap-2 p-2">
            <DynamicAvatar shape="circle" :user="follow.follower" size="small" class="w-8 h-8 flex-shrink-0" />
            <p class="text-sm font-semibold">{{ follow.follower.name }}</p>
          </RouterLink>

          <RouterLink v-if="search === 'following'" :to="{ name: 'user-profile', params: { userId: follow.user._id } }"
            class="flex items-center gap-2 p-2">
            <DynamicAvatar shape="circle" :user="follow.user" size="small" class="w-8 h-8 flex-shrink-0" />
            <p class="text-sm font-semibold">{{ follow.user.name }}</p>
          </RouterLink>
        </div>

        <div v-if="loading" class="flex-shrink-0 grid place-content-center">
          <span class="pi pi-spinner pi-spin text-primary" style="font-size: 1.2rem"></span>
        </div>
      </div>

      <p v-else class="text-center font-medium">No results found</p>

      <!-- <div v-if="!allLoaded" class="grid justify-center mt-2">
        <Button label="Load more" icon="pi pi-plus" outlined size="small" />
      </div> -->
    </div>
  </div>

</template>