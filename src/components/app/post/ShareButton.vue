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
    <Button @click="visible = true" label="Share" icon="pi pi-replay" severity="secondary" rounded text
      class="text cs:text-sm"></Button>

    <Sidebar v-model:visible="visible" position="bottom" style="height: auto">
      <template #header>
        <h1 class="font-semibold">Sharing {{ post.author.name }}'s post</h1>
      </template>
      <NewRepostItem :post-id="post._id" @on-post-shared="clearEditor" />
    </Sidebar>
  </div>

</template>
