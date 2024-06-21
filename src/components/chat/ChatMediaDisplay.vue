<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  media: {
    type: Array,
    required: true
  }
});

const fileType = computed(() => {
  const file = props.media[0]
  if (file.type.includes('image')) return 'image';
  if (file.type.includes('video')) return 'video';
  if (file.type.includes('audio')) return 'audio';
  return 'undefined'
});

const hasCaption = computed(() => props.media.some((item) => item.caption));

const isDisplaying = ref(false);
</script>

<template>
  <div>
    <div v-if="fileType === 'audio'">
      <audio controls class="rounded-none">
        <source :src="media[0].url" :type="media[0].type">
        Your browser does not support the audio tag.
      </audio>
    </div>

    <div v-if="fileType === 'video'">
      <video controls>
        <source :src="media[0].url" :type="media[0].type">
      </video>

      <p v-if="media[0].caption">{{ media[0].caption }}</p>
    </div>

    <div v-if="fileType === 'image'">
      <div v-if="media.length < 2">
        <Image :src="media[0].url" alt="chat media" preview />
        <p class="whitespace-pre-wrap">{{ media[0].caption }}</p>
      </div>

      <div v-else>
        <div v-if="hasCaption" class="grid gap-1">
          <div v-for="img, i in media" :key="i">
            <Image :src="img.url" alt="image" preview />
            <p class="whietspace-pre-wrap">{{ img.caption }}</p>
          </div>
        </div>

        <div v-else>
          <div @click="isDisplaying = true"
            class="relative grid grid-cols-2 w-60 h-60 hover:brightness-75 cursor-pointer overflow-hidden">
            <Image v-for="img, i in media.slice(0, 4)" :key="i" :src="img.url" />
            <p v-if="media.length - 4" class="text-white text-6xl absolute right-8 bottom-5">+{{ media.length - 4 }}</p>
          </div>

          <Teleport to="body">
            <div v-if="isDisplaying">
              <div
                class="z-20 w-dvw h-[40dvh] bg-primary fixed top-1/2 -translate-y-1/2 p-3 flex items-center gap-3 overflow-x-auto transition-all">
                <Image v-for="img, i in media.slice(0, 4)" :key="i" :src="img.url" class="h-full flex-shrink-0"
                  image-class="h-full object-cover" preview />
              </div>
              <div @click="isDisplaying = false" class="transition-all z-10 fixed h-dvh w-dvw bg-black/75 top-0 left-0">
              </div>
            </div>

          </Teleport>
        </div>
      </div>

    </div>
  </div>
</template>