<script setup>
import DynamicAvatar from '@/components/ui/DynamicAvatar.vue';

defineProps({
  likers: {
    type: Object,
    required: true,
  },
  isLoadMoreVisible: {
    type: Boolean
  },
  loading: {
    type: Boolean
  }
});

defineEmits(['onLoadMore']);

</script>

<template>
  <div flex flex-col gap-3>
    <!-- Wrap this in a router link later on to lead to the user's profile -->
    <div v-for="like in likers" :key="like.liker._id" class="flex-shrink-0 flex items-center gap-1 p-2">
      <DynamicAvatar shape="circle" :user="like.liker" />
      <p>{{ like.liker.name }}</p>
    </div>

    <Button :loading @click="$emit('onLoadMore')" v-if="isLoadMoreVisible" label="More" outlined size="small" class="mt-3" />
  </div>
</template>
