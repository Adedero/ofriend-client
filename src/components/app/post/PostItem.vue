<script setup>
import { ref } from 'vue';
import { timeAgo } from '@/composables/utils/formats';

defineProps({
  post: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['onLikeClick', 'onPostShared']);

const sendEmit = (data) => emit('onLikeClick', data);

const menu = ref(null);
const toggle = (event) => {
  menu.value.toggle(event)
}

</script>

<template>
  <div class="min-w-0">
    <Panel toggleable>
      <template #header>
        <div @click="$router.push(`/app/profile/${post.author._id}`)" class="cursor-pointer flex align-items-center gap-2">
          <DynamicAvatar size="large" shape="circle" :user="post.author" class="w-12 h-12" />
          <div class="grid">
            <p>
              <span class="font-bold">{{ post.author.name }}</span>
              <span v-if="post.isReposting" class="italic font-medium"> shared a post</span>
            </p>
            <small class="text-slate-500">{{ timeAgo(post.createdAt) }}</small>
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
              <PostOptions :post />
            </template>
            <template #fallback>
              <div class="w-20 h-20 grid place-content-center">
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
        <PostMedia :media="post.media" />
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
            <CommentButton @comment-click="$router.push(`/app/post/${post._id}`)" />
            <ShareButton :post="post" class="cs:ml-auto" @on-post-shared="$emit('onPostShared')" />
          </div>
        </div>
      </template>
    </Panel>
  </div>
</template>
