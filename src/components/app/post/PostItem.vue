<script setup>
import { ref, defineAsyncComponent } from 'vue';
import NewComment from './NewComment.vue';
import PostTextContent from './PostTextContent.vue';
import RePost from './RePost.vue';
import PostImageAttachment from './PostImageAttachment.vue';
import PostStats from './PostStats.vue';
import LikeButton from './LikeButton.vue';
import CommentButton from './CommentButton.vue';
import ShareButton from './ShareButton.vue';

const menu = ref(null);


const commentsVisible = ref(false);
const isLikersVisible = ref(false);

const PostComments = defineAsyncComponent({
  loader: () => import('./PostComments.vue')
});

const LikersList = defineAsyncComponent({
  loader: () => import('./LikersList.vue')
})

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
  menu.value.toggle(event);
};

const longHtmlText = `
  <p>Lorem ipsum dolor sit amet, <strong>consectetur adipiscing elit</strong>. Quisque sit amet accumsan arcu. 
  Nulla sit amet <em>volutpat magna</em>. Cras in risus eget nisl facilisis vehicula. 
  Sed sollicitudin urna vel ex bibendum, <a href="#">quis cursus nisi hendrerit</a>. 
  Nam et ligula at nulla malesuada scelerisque.</p>
  <p>Curabitur at <strong>velit sit amet libero</strong> auctor faucibus. 
  Aliquam erat volutpat. Maecenas <em>fringilla</em> magna nec justo dignissim, 
  nec varius quam suscipit. Suspendisse potenti. 
  Proin vitae turpis auctor, lacinia ante eu, <strong>tincidunt nunc</strong>. 
  Sed non ex vel eros fermentum mollis.</p>
  <p>Donec eget <a href="#">sapien tincidunt</a>, lacinia quam vitae, accumsan sem. 
  Praesent ac magna convallis, <em>facilisis est</em> nec, tincidunt nisi. 
  Nullam a semper eros, ut pellentesque nisi. Duis a nisi <strong>eu odio fermentum</strong> 
  viverra. Nulla auctor enim id metus vulputate, in porttitor magna pellentesque.</p>
`;
</script>

<template>
  <Dialog v-model:visible="commentsVisible" modal class="rounded-none w-dvw h-[150dvh] md:w-[40rem] md:rounded-xl">
    <template #container="{ closeCallback }">
      <div class="relative">
        <div class="px-5 py-3 w-full flex items-center gap-4">
          <h1 class="text-lg font-bold">Comments</h1>
          <Button @click="closeCallback" label="Back to post" size="small" text icon="pi pi-angle-left" />
        </div>

        <div class="h-[calc(100dvh-15rem)] overflow-y-auto px-5">
          <PostComments v-if="commentsVisible" />
        </div>

        <div>
          <NewComment @close-dialog="closeCallback" />
        </div>
      </div>
    </template>
  </Dialog>

  <div>
    <Panel toggleable>
      <template #header>
        <div class="flex align-items-center gap-2">
          <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" size="large" shape="circle" />
          <div class="grid">
            <span class="font-bold">Amy Elsner</span>
            <small class="text-slate-500">2 days ago</small>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="text-xs cs:text-sm">
          <PostStats @like-click="isLikersVisible = true" />

          <Divider />

          <div class="flex items-center gap-1 justify-between cs:justify-center cs:gap-3">
            <LikeButton />
            <CommentButton @comment-click="commentsVisible = true" />
            <ShareButton />
          </div>
        </div>
      </template>

      <template #icons>
        <button class="p-panel-header-icon p-link mr-2" @click="toggle">
          <span class="pi pi-ellipsis-v"></span>
        </button>
        <Menu ref="menu" id="config_menu" :model="items" popup />
      </template>

      <div>
        <PostTextContent :text="longHtmlText" />
      </div>

      <div>
        <div class="images grid gap-2 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
          <PostImageAttachment />
        </div>

        <div class="videos"></div>

        <div class="documents"></div>
      </div>

      <div class="mt-5">
        <RePost />
      </div>
    </Panel>
  </div>

  <Sidebar v-model:visible="isLikersVisible" header="People who liked this" position="right">
    <LikersList />
  </Sidebar>
</template>