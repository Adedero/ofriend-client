<script setup>
defineProps({
  media: {
    type: Object, 
    required: true
  }
})

</script>

<template>
  <div>
    <Image v-if="media.type.split('/')[0] == 'image'" :src="media.url" alt="Image" preview />

    <video v-if="media.type.split('/')[0] == 'video'" controls>
      <source :src="media.url" :type="media.type" />
      Your browser does not support the video tag.
    </video>
  </div>
</template>