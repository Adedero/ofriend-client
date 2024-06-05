<script setup>
import { ref } from 'vue'
const post = ref('')
const files = ref(null)

const setFiles = (data) => (files.value = data)
</script>

<template>
  <div class="p-3 border rounded-md">
    <div class="flex flex-col gap-2 md:flex-row">
      <div class="flex items-center justify-between md:block">
        <img
          src="../../../assets/images/default-profile-img.png"
          alt="default profile image"
          class="w-10 aspect-square rounded-full object-cover"
        />
      </div>

      <div class="flex-grow">
        <Textarea
          v-model="post"
          placeholder="Ready to share your knowledge?"
          rows="1"
          auto-resize
          class="bg-soft-gray-2 focus:bg-white w-full max-h-[400px]"
        />
      </div>
    </div>

    <div class="mt-3 flex items-start justify-between">
      <div>
        <AttachMedia @on-file-upload="setFiles" />
      </div>

      <Button
        label="Post"
        icon="pi pi-angle-double-right"
        icon-pos="right"
        size="small"
        class="bg-primary border-primary hover:bg-primary-lighter transition-colors"
      />
    </div>
  </div>
</template>
