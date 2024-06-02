<script setup>
import { ref } from 'vue';;
import PostTextContent from './PostTextContent.vue';
import RePost from './RePost.vue';
import PostImageAttachment from './PostImageAttachment.vue';
import PostComments from './PostComments.vue'
const menu = ref(null);
const commentsVisible = ref(false);

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
  <Dialog v-model:visible="commentsVisible" modal header="Comments"
    class="rounded-none w-dvw h-dvh md:w-[40rem] md:rounded-xl">
    <template #container="{ closeCallback }">
      <div class="relative">
        <div class="p-5 w-full flex items-center gap-4">
          <h1 class="text-lg font-bold">Comments</h1>
          <Button @click="closeCallback" label="Back to post" size="small" text icon="pi pi-angle-left" />
        </div>

        <div class="bg-red-500 h-[calc(100dvh-15rem)] overflow-y-auto">
          <PostComments />

          <p class="mb-5">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
            est laborum.
          </p>
          <p class="mb-5">
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
            aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            Nemo enim
            ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
            qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
            consectetur,
            adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
            voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi
            ut aliquid
            ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil
            molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
          </p>
          <p class="mb-5">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti
            atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique
            sunt in culpa
            qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et
            expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus
            id quod
            maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem
            quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint
            et molestiae
            non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores
            alias consequatur aut perferendis doloribus asperiores repellat.
          </p>
          <p class="mb-5">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
            est laborum.
          </p>
          <p class="mb-5">
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
            aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            Nemo enim
            ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
            qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
            consectetur,
            adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
            voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi
            ut aliquid
            ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil
            molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
          </p>
          <p>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti
            atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique
            sunt in culpa
            qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et
            expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus
            id quod
            maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem
            quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint
            et molestiae
            non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores
            alias consequatur aut perferendis doloribus asperiores repellat.
          </p>
        </div>

        <div class="bg-green-500">New comment
          <InputText />
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
          <div class="flex items-center gap-2">
            <p>2.5k Likes</p>
            <span class="pi pi-circle-fill" style="font-size: 0.25rem"></span>
            <p>1.2k Comments</p>
            <span class="pi pi-circle-fill" style="font-size: 0.25rem"></span>
            <p>10 Reposts</p>
          </div>
          <Divider />

          <div class="flex items-center gap-1 justify-between cs:justify-center cs:gap-3">
            <Button label="Like" size="small" class="text-xs cs:text-sm" icon="pi pi-thumbs-up" rounded text></Button>

            <Button @click="commentsVisible = true" label="Comment" size="small" class="text-xs cs:text-sm"
              icon="pi pi-comment" severity="secondary" rounded text></Button>

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