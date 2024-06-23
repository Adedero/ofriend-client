<script setup>
import { ref } from 'vue';
const visible = ref(false);

const emit = defineEmits(['onPostShared']);

defineProps({
  post: {
    type: Object
  }
});

const clearEditor = () => {
  visible.value = false;
  emit('onPostShared');
}

</script>

<template>
  <div>
    <Button @click="visible = true" label="Share" severity="secondary" rounded text
      class="text cs:text-sm">
      <template #icon>
        <svg fill="#000000" width="1.3rem" height="1.3rem" viewBox="0 0 24 24" id="repost-round" data-name="Flat Line"
          xmlns="http://www.w3.org/2000/svg" class="icon flat-line mr-1">
          <path id="primary" d="M6,14V9A6,6,0,0,1,16.89,5.54"
            style="fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;">
          </path>
          <path id="primary-2" data-name="primary" d="M18,10v5A6,6,0,0,1,7.11,18.46"
            style="fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;">
          </path>
          <polyline id="primary-3" data-name="primary" points="8 12 6 14 4 12"
            style="fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;">
          </polyline>
          <polyline id="primary-4" data-name="primary" points="16 12 18 10 20 12"
            style="fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;">
          </polyline>
        </svg>
      </template>
    </Button>

    <Sidebar v-model:visible="visible" position="bottom" style="height: auto">
      <template #header>
        <h1 class="font-semibold">Sharing {{ post.author.name }}'s post</h1>
      </template>
      <NewRepostItem :post-id="post._id" @on-post-shared="clearEditor" />
    </Sidebar>
  </div>

</template>
