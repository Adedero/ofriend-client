<script setup>
defineProps({
  file: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div>
    <div v-if="file.type.includes('audio')">
      <audio controls>
        <source :src="file.url" :type="file.type">
        Your browser does not support audio files
      </audio>
    </div>

    <div v-if="file.type.includes('video')">
      <video controls>
        <source :src="file.url" :type="file.type">
        Your browser does not support audio files
      </video>
    </div>

    <div v-if="file.type.includes('image')">
      <Image :src="file.url" :alt="file.name" preview />
    </div>

    <a v-if="file.type.includes('application')" :href="file.url" download class="flex items-center p-1 gap-2 bg-accent/10 rounded">
      <div class="p-2 text-center min-w-8 grid place-content-center aspect-square rounded bg-accent text-white">
        {{ file.extension ? file.extension.toUpperCase() : '?' }}
      </div>
      <p class="max-w-full truncate">{{ file.name }}</p>
    </a>

  </div>
</template>