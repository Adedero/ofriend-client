<script setup>
import { defineAsyncComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { timeAgo } from '@/composables/utils/formats';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { usePost } from '@/composables/server/use-fetch';
import useFirebaseUpload from '@/composables/utils/firebase-upload';

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});


const EditPostItem = defineAsyncComponent({
  loader: () => import('@/components/app/post/EditPostItem.vue')
});

const emit = defineEmits(['onLikeClick', 'onPostShared', 'onPostDeleted', 'onCommentCreated', 'userBlocked']);

const router = useRouter();
const toast = useToast();
const firebase = useFirebaseUpload();

const sendEmit = (data) => emit('onLikeClick', data);

const visible = ref(false);

const menu = ref(null);
const toggle = (event) => {
  menu.value.toggle(event)
}

const showConfirm = ref(false);

const deletePost = async () => {
  showConfirm.value = false;
  toast.add({ severity: 'info', summary: 'Deleting post', detail: 'Deleting post. You will be notified when this is done', life: 5000 });

  if (props.post.hasMedia) {
    const urlArray = props.post.media.map(item => item.url);
    await firebase.deleteMultipleFiles(urlArray);
  }
  await usePost(`api/delete-post/${props.post._id}?repostedPost=${props.post.repostedPost?._id ?? ''}`,
    { method: 'DELETE', router, toast },
    () => {
    toast.add({ severity: 'success', summary: 'Done', detail: 'Your post has been deleted', life: 5000 });
    emit('onPostDeleted', props.post._id);
  });
}

</script>

<template>
  <div class="min-w-0">
    <Toast class="max-w-96" />
    <Dialog v-model:visible="showConfirm" modal header="Confirmation">
      <div>
        <span class="pi pi-exclamation-triangle text-amber-500" style="font-size: 1.2rem"></span>
        Are you sure you want to delete this post?
        <div class="mt-4 flex items-center gap-2 justify-end">
          <Button @click="showConfirm = false" label="Cancel" severity="secondary" />
          <Button @click="deletePost" label="Proceed" class="btn" />
        </div>
      </div>
    </Dialog>

    <Panel toggleable>
      <template #header>
        <div @click="$router.push(`/app/profile/${post.author._id}`)"
          class="cursor-pointer flex align-items-center gap-2">
          <DynamicAvatar size="large" shape="circle" :user="post.author" class="w-12 h-12" />
          <div class="grid">
            <p>
              <span class="font-bold">{{ post.author.name }}</span>
              <span v-if="post.isReposting" class="italic font-medium"> shared a post</span>
            </p>
            <p class="flex items-center gap-1">
              <small class="text-slate-500">{{ timeAgo(post.createdAt) }}</small>
              <span v-show="post.isEdited" class="block w-1 aspect-square bg-slate-500 rounded-full"></span>
              <small v-show="post.isEdited" class="text-slate-500">edited</small>
            </p>

          </div>
        </div>
      </template>

      <template #icons>
        <button class="p-panel-header-icon p-link mr-2" @click="toggle">
          <span class="pi pi-ellipsis-v"></span>
        </button>
        <OverlayPanel ref="menu">
          <Suspense>
            <template #default>
              <PostOptions :post @isEditingPost="visible = true" @isDeletingPost="showConfirm = true" @userBlocked="(userId) => $emit('userBlocked', userId)" />
            </template>
            <template #fallback>
              <div class="w-40 h-20 grid place-content-center">
                <span class="pi pi-spinner pi-spin text-accent" style="font-size: 1.2rem"></span>
              </div>
            </template>
          </Suspense>
        </OverlayPanel>
      </template>

      <div v-if="post.hasText">
        <PostTextContent :text="post.textContent" />
      </div>

      <div v-if="post.hasMedia" class="mt-5">
        <PostMedia :media="post.media" preview />
      </div>

      <div v-if="post.isReposting" class="mt-5 px-2">
        <RePost :post="post.repostedPost" />
      </div>

      <template #footer>
        <div class="text-sm">
          <PostStats :post="post" />
          <Divider />
          <div class="flex items-center gap-1 justify-between cs:justify-normal cs:gap-3">
            <LikeButton :post="post" @on-like-click="sendEmit" />
            <CommentButton @onCommentCreated="(comment) => $emit('onCommentCreated', comment)" :post />
            <ShareButton :post="post" class="cs:ml-auto" @on-post-shared="$emit('onPostShared')" />
          </div>
        </div>
      </template>
    </Panel>

    <Sidebar v-model:visible="visible" header="Edit post" position="bottom" class="h-auto">
      <EditPostItem v-if="visible" :post @onPostEdited="visible = false" />
    </Sidebar>
  </div>
</template>
