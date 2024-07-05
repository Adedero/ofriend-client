<script setup>
import { computed, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useGet, usePost } from '@/composables/server/use-fetch';
import { useUserStore } from '@/stores/user';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useToastError } from '@/composables/utils/add-toast';

const props = defineProps({
  post: { type: Object }
});

const emit = defineEmits(['userBlocked', 'isEditingPost', 'isDeletingPost']);

const router = useRouter();
const toast = useToast();
const userStore = useUserStore();


const isViewerAuthor = computed(() => userStore.user.id === props.post.author._id);

const { data } = await useGet(`api/get-post-save-status/${props.post._id}`, { router, toast });


//Save Post
/* const saveRes = ref() */
const isSaving = ref(false);
const toggleSavePost = async () => {
  isSaving.value = true;
  await usePost(`api/toggle-post-save/${props.post._id}`,
    { method: 'PUT', router, toast },
    (savedStatus) => data.value.isSaved = savedStatus.isSaved,
  );
  isSaving.value = false;
}

//Follow or unfollow user
const isFollowing = ref(null);

watchEffect(() => {
  isFollowing.value = props.post.viewerFollowsAuthor;
});

const followLoading = ref(false)
const toggleFollowUser = async () => {
  followLoading.value = true;
  await usePost(`api/toggle-user-follow/${props.post.author._id}`,
    { method: 'PUT', router, toast },
    (followStatus) => isFollowing.value = followStatus.isFollowing);
 
  followLoading.value = false;
}

//Copy link
const isCopied = ref(false);
const copyLink = async () => {
  await navigator.clipboard.writeText(window.location.href);
  isCopied.value = true;
  setTimeout(() => {
    isCopied.value = false;
  }, 2000);
}

//Block user
const blockLoading = ref(false);
const blockUser = async () => {
  if (userStore.user.id.toString() === props.post.author._id.toString()) return;

  blockLoading.value = true;
  try {
    const { data, error } = await usePost(`api/block-user/${ props.post.author._id }`, { router, toast });
    //console.log(data.value);
    if (error.value) useToastError(toast, error.value);

    if (!data.value.success) return toast.add({ severity: 'error', summary: data.value.info ?? 'Failed', detail: data.value.message, life: 5000 });
    emit('userBlocked', props.post.author._id.toString());
  } catch (err) {
    console.error(err);
    useToastError(toast, err);
  } finally {
    blockLoading.value = false;
  }
}
</script>

<template>
  <div>
    <Toast class="max-w-96" />
    <Button @click="copyLink" :label="isCopied ? 'Copied' : 'Copy link'" :icon="isCopied ? 'pi pi-check' : 'pi pi-link'"
      text severity="secondary" class="text-left" />

    <div v-if="!post.isViewedByAuthor" class="grid">
      <Button @click="toggleFollowUser"
        :label="isFollowing ? `Unfollow ${post.author.name}` : `Follow ${post.author.name}`"
        :icon="isFollowing ? 'pi pi-user-minus' : 'pi pi-user-plus'" text severity="secondary" class="text-left"
        :class="{ 'text-accent': isFollowing }" :loading="followLoading" />

      <Button @click="toggleSavePost" :label="data.isSaved ? 'Unsave' : 'Save'" :loading="isSaving"
        :icon="data.isSaved ? 'pi pi-bookmark pi-fill' : 'pi pi-bookmark'" text severity="secondary" class="text-left"
        :class="{ 'text-accent': data.isSaved }" />

      <!-- <Button label="Report" icon="pi pi-flag" text severity="secondary" class="text-left" /> -->

      <Button @click="blockUser" :loading="blockLoading" :label="'Block '+ post.author.name.split(' ')[0]" icon="pi pi-ban" text severity="secondary"
        class="text-left" />
    </div>

    <div v-if="post.isViewedByAuthor && isViewerAuthor" class="grid">
      <Divider />
      <Button @click="$emit('isEditingPost')" label="Edit post" icon="pi pi-file-edit" text severity="secondary" class="text-left" />

      <Button @click="$emit('isDeletingPost')" label="Delete post" icon="pi pi-trash" text severity="danger" class="text-left" />
    </div>
  </div>
</template>