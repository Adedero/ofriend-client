<script setup>
defineProps({
  media: {
    type: Array
  }
})
</script>

<template>
  <Carousel :value="media" :numVisible="1" :numScroll="1">
    <template #item="slotProps">
      <div class="grid place-content-center">
        <Image v-if="slotProps.data.type.includes('image')" :src="slotProps.data.url" alt="Image" width="100%"
          preview />
        <video v-if="slotProps.data.type.includes('video')">
          <source :src="slotProps.data.url" :type="slotProps.data.type">
        </video>
      </div>
    </template>
  </Carousel>

</template>
