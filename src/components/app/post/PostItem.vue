<script setup>
import { defineAsyncComponent, ref } from 'vue';
import { timeAgo } from '@/composables/utils/formats';
defineProps({
  post: {
    type: Object,
    required: true
  }
})
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

      <div v-if="post.hasMedia">
        <div class="images grid gap-2 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
          <PostImageAttachment />
        </div>

        <div class="videos"></div>
      </div>

      <div v-if="post.isReposting" class="mt-5 px-2">
        <RePost />
      </div>

      <template #footer>
        <div class="text-sm">
          <PostStats :likes="post.likes" :comments="post.comments" :reposts="post.reposts" @like-click="isLikersVisible = true" />
          <Divider />
          <div class="flex items-center gap-1 justify-between cs:justify-normal cs:gap-3">
            <LikeButton />
            <CommentButton @comment-click="$router.push('/app/post')" />
            <ShareButton class="cs:ml-auto" />
          </div>
        </div>
      </template>
    </Panel>
  </div>

  <Sidebar v-model:visible="isLikersVisible" header="People who liked this" position="right">
    <LikersList />
  </Sidebar>
</template>
