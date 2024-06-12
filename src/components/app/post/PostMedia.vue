<script setup>
defineProps({
  media: {
    type: Array
  }
})
</script>

<template>
  <div v-if="media.length < 2">
    <div class="grid place-content-center">
      <Image v-if="media[0].type.includes('image')" :src="media[0].url" alt="Image" width="100%" preview />
      <video v-if="media[0].type.includes('video')" controls class="w-full">
        <source :src="media[0].url" :type="media[0].type">
      </video>
    </div>
  </div>
  <div v-else>
    <Carousel :value="media" :numVisible="1" :numScroll="1">
      <template #item="slotProps">
        <div class="grid place-content-center">
          <Image v-if="slotProps.data.type.includes('image')" :src="slotProps.data.url" alt="Image" width="100%"
            preview />
          <video v-if="slotProps.data.type.includes('video')" controls>
            <source :src="slotProps.data.url" :type="slotProps.data.type">
          </video>
        </div>
      </template>
    </Carousel>
  </div>
</template>
