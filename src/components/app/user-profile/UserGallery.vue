<script setup>
import { computed, onMounted, ref } from 'vue';
import { useGet } from '@/composables/utils/use-fetch';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
});

const toast = useToast();

const media = ref([]);
const length = computed(() => media.value.length);

const res = ref({});
const loading = ref(false);
const allLoaded = ref(false);

const getUserMedia = async () => {
  if (loading.value || allLoaded.value) return;
  loading.value = true;
  try {
    res.value = await useGet(`api/get-user-media/${props.userId}/${length.value}`);
    const userMedia = res.value.data;
    //console.log(userMedia);
    if (userMedia.length > 0) {
      media.value.push(...userMedia);
      return;
    }
    allLoaded.value = true;
  } catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: 'Error', detail: error.message });
  } finally {
    loading.value = false;
  }
}


const onScroll = async (event) => {
  const container = event.target;
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
    await getUserMedia()
  }
}

onMounted(async () => await getUserMedia())
</script>

<template>
  <Toast class="max-w-96" />
  <div v-if="media.length" @scroll="onScroll" class="gallery-container lg:w-full grid gap-4 h-[calc(100dvh-17rem)] overflow-y-auto">
    <div v-for="(item, index) in media" :key="index">
      <Image v-if="item.type.includes('image')" :src="item.url" :alt="'media-' + index" class="w-full" preview image-class="w-full" />
      <video v-if="item.type.includes('video')" controls class=" w-full">
        <source :src="item.url" :type="item.type" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>

  <div v-else>
    <img src="../../../assets/images/no-posts.svg" alt="no posts">
  </div>
</template>

<style scoped>
.gallery-container {
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}
</style>