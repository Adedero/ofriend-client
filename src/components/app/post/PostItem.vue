<script setup>
import { defineAsyncComponent, ref } from 'vue';
import { timeAgo } from '@/composables/utils/formats';
defineProps({
  post: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['onLikeClick', 'onPostShared']);

const sendEmit = (data) => emit('onLikeClick', data);

const LikersList = defineAsyncComponent({
  loader: () => import('./LikersList.vue')
});
const isLikersVisible = ref(false);




const menu = ref(null);
const items = ref([
  {
    label: 'Follow User',
    icon: 'pi pi-user-plus'
  },
  {
    label: 'Save',
    icon: 'pi pi-bookmark'
  },
  {
    label: 'Copy Link',
    icon: 'pi pi-copy'
  },
  {
    separator: true
  },
  {
    label: 'Report',
    icon: 'pi pi-flag'
  }
]);

const toggle = (event) => {
  menu.value.toggle(event)
}

</script>

<template>
  <div>
    <Panel toggleable>
      <template #header>
        <div class="flex align-items-center gap-2">
          <DynamicAvatar size="large" shape="circle" :user="post.author" />
          <div class="grid">
            <span class="font-bold">{{ post.author.name }}</span>
            <small class="text-slate-500">{{ timeAgo(post.createdAt) }}</small>
          </div>
        </div>
      </template>

      <template #icons>
        <button class="p-panel-header-icon p-link mr-2" @click="toggle">
          <span class="pi pi-ellipsis-v"></span>
        </button>
        <Menu ref="menu" id="config_menu" :model="items" popup />
      </template>

      <div v-if="post.hasText">
        <PostTextContent :text="post.textContent" />
      </div>

      <div v-if="post.hasMedia" class="mt-5">
        <PostMedia :media="post.media" />
      </div>

      <div v-if="post.isReposting" class="mt-5 px-2">
        <RePost />
      </div>

      <template #footer>
        <div class="text-sm">
          <PostStats :post="post" />
          <Divider />
          <div class="flex items-center gap-1 justify-between cs:justify-normal cs:gap-3">
            <LikeButton :post="post" @on-like-click="sendEmit" />
            <CommentButton @comment-click="$router.push(`/app/post/${post._id}`)" />
            <ShareButton :post="post" class="cs:ml-auto" @on-post-shared="$emit('onPostShared')" />
          </div>
        </div>
      </template>
    </Panel>
  </div>

  <Sidebar v-model:visible="isLikersVisible" header="People who liked this" position="right">
    <LikersList />
  </Sidebar>
</template>
