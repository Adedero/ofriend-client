<script setup>
import { ref } from 'vue';
import { usePost } from '@/composables/utils/use-fetch';
import { useToastError } from '@/composables/utils/add-toast';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['onFollowToggle']);

const toast = useToast();

const isFollowing = ref(props.user.viewerFollowsUser);

const loading = ref(false);
const toggleFollowUser = async () => {
  loading.value = true;
  try {
    const { error, data: followStatus, status } = await usePost(`api/toggle-user-follow/${props.user._id}`, {}, 'PUT');
    if (error.value || status.value !== 200) {
      console.log(error.value);
      useToastError(toast, error.value, 500)
      return;
    }
    isFollowing.value = followStatus.value.isFollowing;
    emit('onFollowToggle', followStatus.value.isFollowing) 
  } catch (error) {
    useToastError(toast, error)
  } finally {
    loading.value = false;
  }
}

const op = ref(null);

const onFollowClick = async (event) => {
  if (isFollowing.value) {
    op.value.toggle(event);
    return;
  }
  await toggleFollowUser();
  return;
}

const items = ref([
  {
    label: `Unfollow ${props.user.name}?`,
    icon: 'pi pi-user',
    command: async () => await toggleFollowUser()
  }
])
</script>

<template>
  <div>
    <Button @click="onFollowClick" :loading :label="isFollowing ? 'Following' : 'Follow'" icon="pi pi-user-plus" size="small"
      class="h-10 text-sm lg:text-base mt-2 bg-accent border-0 hover:bg-sky-500" />
    <Menu :model="items" :popup="true" ref="op" />
  </div>
</template>
