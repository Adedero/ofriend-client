<script setup>
import { ref } from 'vue';;
import PostTextContent from '@/components/app/PostTextContent.vue';
import RePost from '@/components/app/RePost.vue';
import PostImageAttachment from './PostImageAttachment.vue';
const menu = ref(null);;

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
          <div class="flex items-center gap-2 cs:justify-end">
            <p>2.5k Likes</p>
            <span class="pi pi-circle-fill" style="font-size: 0.25rem"></span>
            <p>1.2k Comments</p>
            <span class="pi pi-circle-fill" style="font-size: 0.25rem"></span>
            <p>10 Reposts</p>
          </div>
          <Divider />

          <div class="flex items-center gap-1 justify-between cs:justify-center cs:gap-3">
            <Button label="Like" size="small" class="text-xs cs:text-sm" icon="pi pi-thumbs-up" rounded text></Button>
            <Button label="Comment" size="small" class="text-xs cs:text-sm" icon="pi pi-comment" severity="secondary"
              rounded text></Button>
            <Button label="Repost" size="small" class="text-xs cs:text-sm" icon="pi pi-replay" severity="secondary"
              rounded text></Button>
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

      <div>
        <RePost />
      </div>
    </Panel>
  </div>
</template>